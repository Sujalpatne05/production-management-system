/**
 * ADMIN MANAGEMENT MODULE
 * Handles company admin management and provisioning
 * Extracted from super-admin-module.js
 */

const createAuditLog = async (prisma, data) => {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

export const setupAdminManagementModule = (app, prisma, authenticateToken, authorize) => {
  console.log("👨‍💼 Setting up Admin Management Module...");

  // =====================
  // ADMIN MANAGEMENT
  // =====================

  // Get all admins with pagination
  app.get("/api/super-admin/admins", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0, companyId } = req.query;
      const where = {};
      
      if (companyId) {
        where.companyId = companyId;
      }

      const admins = await prisma.companyAdmin.findMany({
        where,
        include: {
          company: true,
          user: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.companyAdmin.count({ where });

      res.json({ 
        success: true, 
        data: admins, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Add admin to company
  app.post("/api/super-admin/admins", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { companyId, userId, role } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (!companyId) errors.companyId = "Company ID is required";
      if (!userId) errors.userId = "User ID is required";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check if company exists
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });

      if (!company) {
        return res.status(400).json({ success: false, error: "Company not found" });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(400).json({ success: false, error: "User not found" });
      }

      // Check if user is already admin for another company
      const existingAdmin = await prisma.companyAdmin.findFirst({
        where: { userId }
      });

      if (existingAdmin && existingAdmin.companyId !== companyId) {
        return res.status(409).json({ 
          success: false, 
          error: "User is already admin for another company",
          code: "DUPLICATE_RECORD"
        });
      }

      const admin = await prisma.companyAdmin.create({
        data: {
          companyId,
          userId,
          role: role || "admin",
          status: "active"
        },
        include: { company: true, user: true }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId,
        action: "create",
        resourceType: "admin",
        resourceId: admin.id,
        changes: { created: admin },
        ipAddress,
        userAgent
      });

      res.status(201).json({ success: true, data: admin, message: "Admin added successfully" });
    } catch (error) {
      console.error("Error adding admin:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update admin
  app.put("/api/super-admin/admins/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { role, status } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get existing admin
      const existingAdmin = await prisma.companyAdmin.findUnique({
        where: { id: req.params.id }
      });

      if (!existingAdmin) {
        return res.status(404).json({ success: false, error: "Admin not found" });
      }

      // If deactivating, check if company has another active admin
      if (status === "inactive") {
        const activeAdmins = await prisma.companyAdmin.count({
          where: {
            companyId: existingAdmin.companyId,
            status: "active",
            id: { not: req.params.id }
          }
        });

        if (activeAdmins === 0) {
          return res.status(400).json({ 
            success: false, 
            error: "Cannot deactivate the last active admin for this company" 
          });
        }
      }

      const updateData = {};
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;

      const admin = await prisma.companyAdmin.update({
        where: { id: req.params.id },
        data: updateData,
        include: { company: true, user: true }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: existingAdmin.companyId,
        action: "update",
        resourceType: "admin",
        resourceId: admin.id,
        changes: { before: existingAdmin, after: admin },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: admin, message: "Admin updated successfully" });
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete admin (deactivate)
  app.delete("/api/super-admin/admins/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const admin = await prisma.companyAdmin.findUnique({
        where: { id: req.params.id }
      });

      if (!admin) {
        return res.status(404).json({ success: false, error: "Admin not found" });
      }

      // Check if company has another active admin
      const activeAdmins = await prisma.companyAdmin.count({
        where: {
          companyId: admin.companyId,
          status: "active",
          id: { not: req.params.id }
        }
      });

      if (activeAdmins === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Cannot remove the last active admin for this company" 
        });
      }

      // Deactivate admin instead of deleting
      const deletedAdmin = await prisma.companyAdmin.update({
        where: { id: req.params.id },
        data: { status: "inactive" },
        include: { company: true, user: true }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: admin.companyId,
        action: "delete",
        resourceType: "admin",
        resourceId: admin.id,
        changes: { deleted: admin },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: deletedAdmin, message: "Admin removed successfully" });
    } catch (error) {
      console.error("Error removing admin:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Admin Management Module setup complete!");
};
