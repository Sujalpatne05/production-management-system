/**
 * API KEYS & SUPPORT MODULE
 * Handles API key management and support tickets
 * Extracted from super-admin-module.js
 */

const createAuditLog = async (prisma, data) => {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

export const setupAPIKeysModule = (app, prisma, authenticateToken, authorize) => {
  console.log("🔑 Setting up API Keys & Support Module...");

  // =====================
  // API KEYS
  // =====================

  // Get API keys
  app.get("/api/super-admin/api-keys", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const keys = await prisma.apiKey.findMany({
        select: {
          id: true,
          name: true,
          key: true,
          status: true,
          lastUsed: true,
          createdAt: true,
          companyId: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.apiKey.count();

      res.json({ 
        success: true, 
        data: keys,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create API key
  app.post("/api/super-admin/api-keys", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, companyId } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: "API key name is required" });
      }

      const key = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const secret = `secret_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const apiKey = await prisma.apiKey.create({
        data: { 
          name: name.trim(), 
          key, 
          secret, 
          companyId: companyId || null,
          status: "active"
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyId || null,
        action: "create",
        resourceType: "api_key",
        resourceId: apiKey.id,
        changes: { created: { name: apiKey.name, key: apiKey.key } },
        ipAddress,
        userAgent
      });

      res.status(201).json({ 
        success: true, 
        data: apiKey, 
        message: "API key created successfully" 
      });
    } catch (error) {
      console.error("Error creating API key:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get API key by ID
  app.get("/api/super-admin/api-keys/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          name: true,
          key: true,
          status: true,
          lastUsed: true,
          createdAt: true,
          companyId: true
        }
      });

      if (!apiKey) {
        return res.status(404).json({ success: false, error: "API key not found" });
      }

      res.json({ success: true, data: apiKey });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update API key
  app.put("/api/super-admin/api-keys/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, status } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const existingKey = await prisma.apiKey.findUnique({
        where: { id: req.params.id }
      });

      if (!existingKey) {
        return res.status(404).json({ success: false, error: "API key not found" });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (status !== undefined) updateData.status = status;

      const apiKey = await prisma.apiKey.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: existingKey.companyId || null,
        action: "update",
        resourceType: "api_key",
        resourceId: apiKey.id,
        changes: { before: existingKey, after: apiKey },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: apiKey, message: "API key updated successfully" });
    } catch (error) {
      console.error("Error updating API key:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Revoke API key
  app.delete("/api/super-admin/api-keys/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const apiKey = await prisma.apiKey.findUnique({
        where: { id: req.params.id }
      });

      if (!apiKey) {
        return res.status(404).json({ success: false, error: "API key not found" });
      }

      const revokedKey = await prisma.apiKey.update({
        where: { id: req.params.id },
        data: { status: "revoked" }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: apiKey.companyId || null,
        action: "delete",
        resourceType: "api_key",
        resourceId: apiKey.id,
        changes: { revoked: apiKey },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: revokedKey, message: "API key revoked successfully" });
    } catch (error) {
      console.error("Error revoking API key:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // SUPPORT TICKETS
  // =====================

  // Get all support tickets
  app.get("/api/super-admin/tickets", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0, status } = req.query;
      const where = {};

      if (status) where.status = status;

      const tickets = await prisma.supportTicket.findMany({
        where,
        include: { company: true, assignee: true },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.supportTicket.count({ where });

      res.json({ 
        success: true, 
        data: tickets,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get support ticket by ID
  app.get("/api/super-admin/tickets/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: req.params.id },
        include: { company: true, assignee: true }
      });

      if (!ticket) {
        return res.status(404).json({ success: false, error: "Ticket not found" });
      }

      res.json({ success: true, data: ticket });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create support ticket
  app.post("/api/super-admin/tickets", authenticateToken, async (req, res) => {
    try {
      const { title, description, priority, companyId } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      if (!title || title.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Ticket title is required" });
      }

      const ticket = await prisma.supportTicket.create({
        data: {
          title: title.trim(),
          description,
          priority: priority || "medium",
          status: "open",
          companyId: companyId || null,
          createdBy: req.user.id
        },
        include: { company: true, assignee: true }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyId || null,
        action: "create",
        resourceType: "support_ticket",
        resourceId: ticket.id,
        changes: { created: ticket },
        ipAddress,
        userAgent
      });

      res.status(201).json({ success: true, data: ticket, message: "Ticket created successfully" });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update support ticket
  app.put("/api/super-admin/tickets/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { status, priority, assigneeId, notes } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const existingTicket = await prisma.supportTicket.findUnique({
        where: { id: req.params.id }
      });

      if (!existingTicket) {
        return res.status(404).json({ success: false, error: "Ticket not found" });
      }

      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
      if (notes !== undefined) updateData.notes = notes;

      const ticket = await prisma.supportTicket.update({
        where: { id: req.params.id },
        data: updateData,
        include: { company: true, assignee: true }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: existingTicket.companyId || null,
        action: "update",
        resourceType: "support_ticket",
        resourceId: ticket.id,
        changes: { before: existingTicket, after: ticket },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: ticket, message: "Ticket updated successfully" });
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Close support ticket
  app.post("/api/super-admin/tickets/:id/close", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { resolution } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const ticket = await prisma.supportTicket.update({
        where: { id: req.params.id },
        data: { 
          status: "closed",
          resolution,
          closedAt: new Date()
        },
        include: { company: true, assignee: true }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: ticket.companyId || null,
        action: "close",
        resourceType: "support_ticket",
        resourceId: ticket.id,
        changes: { closed: ticket },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: ticket, message: "Ticket closed successfully" });
    } catch (error) {
      console.error("Error closing ticket:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ API Keys & Support Module setup complete!");
};
