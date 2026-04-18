/**
 * AUDIT LOGGING MODULE
 * Handles audit log retrieval and management
 * Extracted from super-admin-module.js
 */

export const setupAuditModule = (app, prisma, authenticateToken, authorize) => {
  console.log("📋 Setting up Audit Logging Module...");

  // =====================
  // AUDIT LOGS
  // =====================

  // Get audit logs (super admin - all logs)
  app.get("/api/super-admin/audit-logs", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { companyId, userId, action, limit = 50, offset = 0 } = req.query;
      
      const where = {};
      if (companyId) where.companyId = companyId;
      if (userId) where.userId = userId;
      if (action) where.action = action;

      const logs = await prisma.auditLog.findMany({
        where,
        include: { company: true, user: true },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.auditLog.count({ where });

      res.json({ 
        success: true, 
        data: logs, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get audit logs (company admin - company-specific logs)
  app.get("/api/company-admin/audit-logs", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { action, limit = 50, offset = 0 } = req.query;
      
      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const where = {
        companyId: companyAdmin.companyId
      };

      if (action) where.action = action;

      const logs = await prisma.auditLog.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.auditLog.count({ where });

      res.json({ 
        success: true, 
        data: logs, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get audit log by ID
  app.get("/api/super-admin/audit-logs/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const log = await prisma.auditLog.findUnique({
        where: { id: req.params.id },
        include: { company: true, user: true }
      });

      if (!log) {
        return res.status(404).json({ success: false, error: "Audit log not found" });
      }

      res.json({ success: true, data: log });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get audit logs by resource
  app.get("/api/super-admin/audit-logs/resource/:resourceType/:resourceId", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { resourceType, resourceId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const logs = await prisma.auditLog.findMany({
        where: {
          resourceType,
          resourceId
        },
        include: { company: true, user: true },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.auditLog.count({
        where: {
          resourceType,
          resourceId
        }
      });

      res.json({
        success: true,
        data: logs,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Export audit logs as CSV
  app.get("/api/super-admin/audit-logs/export/csv", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { companyId, startDate, endDate } = req.query;

      const where = {};
      if (companyId) where.companyId = companyId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const logs = await prisma.auditLog.findMany({
        where,
        include: { company: true, user: true },
        orderBy: { createdAt: "desc" }
      });

      // Generate CSV
      let csv = "Timestamp,User,Company,Action,Resource Type,Resource ID,Status,IP Address\n";
      
      logs.forEach(log => {
        const row = [
          log.createdAt.toISOString(),
          `"${log.user?.name || 'Unknown'}"`,
          `"${log.company?.name || 'N/A'}"`,
          log.action,
          log.resourceType,
          log.resourceId,
          log.status,
          log.ipAddress || 'N/A'
        ].join(",");
        csv += row + "\n";
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=audit-logs-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get audit statistics
  app.get("/api/super-admin/audit-stats", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { companyId, days = 30 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const where = {
        createdAt: { gte: startDate }
      };

      if (companyId) where.companyId = companyId;

      // Get action counts
      const actionCounts = await prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true
      });

      // Get resource type counts
      const resourceCounts = await prisma.auditLog.groupBy({
        by: ['resourceType'],
        where,
        _count: true
      });

      // Get status counts
      const statusCounts = await prisma.auditLog.groupBy({
        by: ['status'],
        where,
        _count: true
      });

      // Get top users
      const topUsers = await prisma.auditLog.groupBy({
        by: ['userId'],
        where,
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10
      });

      res.json({
        success: true,
        data: {
          period: `Last ${days} days`,
          actionCounts: actionCounts.map(a => ({ action: a.action, count: a._count })),
          resourceCounts: resourceCounts.map(r => ({ resourceType: r.resourceType, count: r._count })),
          statusCounts: statusCounts.map(s => ({ status: s.status, count: s._count })),
          topUsers: topUsers.map(u => ({ userId: u.userId, count: u._count }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Audit Logging Module setup complete!");
};
