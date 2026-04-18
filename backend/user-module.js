/**
 * CONSOLIDATED USER MANAGEMENT MODULE
 * Consolidates all user management endpoints from:
 * - /api/users (generic CRUD)
 * - /api/super-admin/users (super admin user management)
 * - /api/company-admin/users (company admin user management)
 * - /api/hr/employees (HR employee management)
 * 
 * Single source of truth for all user-related operations
 */

import bcrypt from "bcryptjs";

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
};

// Create audit log helper
const createAuditLog = async (prisma, data) => {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

// Business roles for company admins (9 roles)
const BUSINESS_ROLES = [
  'CEO',
  'Finance Manager',
  'Sales Manager',
  'Procurement Manager',
  'Production Manager',
  'Quality Manager',
  'Warehouse Manager',
  'HR Manager',
  'System Administrator'
];

// Validate if role is a valid business role
const isValidBusinessRole = (role) => {
  return BUSINESS_ROLES.includes(role);
};

export const setupUserModule = (app, prisma, authenticateToken, authorize) => {
  console.log("👥 Setting up Consolidated User Management Module...");

  // =====================
  // SUPER ADMIN: USER MANAGEMENT (Platform-wide)
  // =====================

  // Get all users (super admin - all users across all companies)
  app.get("/api/super-admin/users", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0, role, status, companyId } = req.query;
      const where = {};

      if (role) where.role = role;
      if (status) where.status = status;
      if (companyId) where.companyId = companyId;

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          status: true,
          companyId: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.user.count({ where });

      res.json({
        success: true,
        data: users,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get user by ID (super admin)
  app.get("/api/super-admin/users/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          status: true,
          companyId: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create user (super admin)
  app.post("/api/super-admin/users", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, email, username, role, status, companyId, phone, department, position, salary, joinDate } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (!name || name.trim().length === 0) errors.name = "User name is required";
      if (!email || email.trim().length === 0) errors.email = "Email is required";
      else if (!isValidEmail(email)) errors.email = "Invalid email format";
      if (!username || username.trim().length === 0) errors.username = "Username is required";
      if (!role) errors.role = "Role is required";
      if (phone && !isValidPhone(phone)) errors.phone = "Invalid phone format";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      }).catch(() => null);

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: "Email already in use",
          code: "DUPLICATE_RECORD"
        });
      }

      // Check username uniqueness
      const existingUsername = await prisma.user.findUnique({
        where: { username: username.toLowerCase() }
      }).catch(() => null);

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          error: "Username already in use",
          code: "DUPLICATE_RECORD"
        });
      }

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          role: role || "user",
          status: status || "active",
          companyId: companyId || null,
          password: "temp-password-" + Math.random().toString(36).substr(2, 9)
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyId || null,
        action: "create",
        resourceType: "user",
        resourceId: user.id,
        changes: { created: user },
        ipAddress,
        userAgent
      });

      res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully"
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update user (super admin)
  app.put("/api/super-admin/users/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, email, username, role, status, companyId, phone } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get existing user
      const existingUser = await prisma.user.findUnique({
        where: { id: req.params.id }
      });

      if (!existingUser) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      // Validation
      const errors = {};
      if (email && !isValidEmail(email)) errors.email = "Invalid email format";
      if (phone && !isValidPhone(phone)) errors.phone = "Invalid phone format";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness if changing
      if (email && email.toLowerCase() !== existingUser.email) {
        const duplicateEmail = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        }).catch(() => null);

        if (duplicateEmail) {
          return res.status(409).json({
            success: false,
            error: "Email already in use",
            code: "DUPLICATE_RECORD"
          });
        }
      }

      // Check username uniqueness if changing
      if (username && username.toLowerCase() !== existingUser.username) {
        const duplicateUsername = await prisma.user.findUnique({
          where: { username: username.toLowerCase() }
        }).catch(() => null);

        if (duplicateUsername) {
          return res.status(409).json({
            success: false,
            error: "Username already in use",
            code: "DUPLICATE_RECORD"
          });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (email !== undefined) updateData.email = email.toLowerCase();
      if (username !== undefined) updateData.username = username.toLowerCase();
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;
      if (companyId !== undefined) updateData.companyId = companyId;

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: user.companyId || null,
        action: "update",
        resourceType: "user",
        resourceId: user.id,
        changes: { before: existingUser, after: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: user, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete user (super admin - deactivate)
  app.delete("/api/super-admin/users/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const user = await prisma.user.findUnique({
        where: { id: req.params.id }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const deactivatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { status: "inactive" }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: user.companyId || null,
        action: "delete",
        resourceType: "user",
        resourceId: user.id,
        changes: { deactivated: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: deactivatedUser, message: "User deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // COMPANY ADMIN: USER MANAGEMENT (Company-specific)
  // =====================

  // Get users in company
  app.get("/api/company-admin/users", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const users = await prisma.user.findMany({
        where: { companyId: companyAdmin.companyId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.user.count({
        where: { companyId: companyAdmin.companyId }
      });

      const company = await prisma.company.findUnique({
        where: { id: companyAdmin.companyId }
      });

      res.json({
        success: true,
        data: users,
        total,
        userCount: total,
        maxUsers: company?.maxUsers || 10,
        availableSlots: (company?.maxUsers || 10) - total,
        availableRoles: BUSINESS_ROLES,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create user in company
  app.post("/api/company-admin/users", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { name, email, role, phone, department, password } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      // Validation
      const errors = {};
      if (!name || name.trim().length === 0) errors.name = "User name is required";
      if (!email || email.trim().length === 0) errors.email = "Email is required";
      else if (!isValidEmail(email)) errors.email = "Invalid email format";
      if (!role) errors.role = "Role is required";
      if (!password || password.trim().length === 0) errors.password = "Password is required";
      else if (password.length < 6) errors.password = "Password must be at least 6 characters";
      if (phone && !isValidPhone(phone)) errors.phone = "Invalid phone format";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Prevent company admins from creating super_admin users
      if (role === "super_admin") {
        return res.status(403).json({
          success: false,
          error: "Company admins cannot create super_admin users"
        });
      }

      // Validate role is one of the business roles
      if (!isValidBusinessRole(role)) {
        return res.status(400).json({
          success: false,
          error: `Invalid role. Must be one of: ${BUSINESS_ROLES.join(', ')}`
        });
      }

      // Check email uniqueness
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      }).catch(() => null);

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "Email already in use",
          code: "DUPLICATE_RECORD"
        });
      }

      // Check user limit
      const userCount = await prisma.user.count({
        where: { companyId: companyAdmin.companyId, status: "active" }
      });

      const company = await prisma.company.findUnique({
        where: { id: companyAdmin.companyId }
      });

      if (userCount >= (company?.maxUsers || 10)) {
        return res.status(400).json({
          success: false,
          error: `User limit exceeded. Current: ${userCount}, Limit: ${company?.maxUsers || 10}`,
          code: "USER_LIMIT_EXCEEDED"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          role: role || "user",
          status: "active",
          companyId: companyAdmin.companyId,
          passwordHash: hashedPassword,
          username: email.toLowerCase().split('@')[0] // Generate username from email
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyAdmin.companyId,
        action: "create",
        resourceType: "user",
        resourceId: user.id,
        changes: { created: user },
        ipAddress,
        userAgent
      });

      res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully"
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update user (company admin)
  app.put("/api/company-admin/users/:id", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { role, status } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      // Get existing user
      const existingUser = await prisma.user.findUnique({
        where: { id: req.params.id }
      });

      if (!existingUser) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      // Verify user belongs to company
      if (existingUser.companyId !== companyAdmin.companyId) {
        return res.status(403).json({ success: false, error: "Cannot modify user from another company" });
      }

      // Prevent company admins from creating super_admin users
      if (role === "super_admin") {
        return res.status(403).json({
          success: false,
          error: "Company admins cannot assign super_admin role"
        });
      }

      // Validate role is one of the business roles
      if (role !== undefined && !isValidBusinessRole(role)) {
        return res.status(400).json({
          success: false,
          error: `Invalid role. Must be one of: ${BUSINESS_ROLES.join(', ')}`
        });
      }

      const updateData = {};
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyAdmin.companyId,
        action: "update",
        resourceType: "user",
        resourceId: user.id,
        changes: { before: existingUser, after: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: user, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Deactivate user (company admin)
  app.delete("/api/company-admin/users/:id", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.params.id }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      // Verify user belongs to company
      if (user.companyId !== companyAdmin.companyId) {
        return res.status(403).json({ success: false, error: "Cannot deactivate user from another company" });
      }

      const deactivatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { status: "inactive" }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyAdmin.companyId,
        action: "delete",
        resourceType: "user",
        resourceId: user.id,
        changes: { deactivated: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: deactivatedUser, message: "User deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get available business roles for company admin
  app.get("/api/company-admin/roles", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      res.json({
        success: true,
        data: BUSINESS_ROLES,
        message: "Available roles retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // GENERIC USER ENDPOINTS (Backward compatibility)
  // =====================

  // Get all users (generic - redirects to super admin endpoint)
  app.get("/api/users", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.user.count();

      res.json({
        success: true,
        data: users,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single user (generic)
  app.get("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          status: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create user (generic - delegates to super admin logic)
  app.post("/api/users", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, email, username, role, status, companyId } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (!name || name.trim().length === 0) errors.name = "User name is required";
      if (!email || email.trim().length === 0) errors.email = "Email is required";
      else if (!isValidEmail(email)) errors.email = "Invalid email format";
      if (!username || username.trim().length === 0) errors.username = "Username is required";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      }).catch(() => null);

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: "Email already in use",
          code: "DUPLICATE_RECORD"
        });
      }

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          role: role || "user",
          status: status || "active",
          companyId: companyId || null,
          password: "temp-password-" + Math.random().toString(36).substr(2, 9)
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyId || null,
        action: "create",
        resourceType: "user",
        resourceId: user.id,
        changes: { created: user },
        ipAddress,
        userAgent
      });

      res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully"
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update user (generic)
  app.put("/api/users/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, email, username, role, status } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get existing user
      const existingUser = await prisma.user.findUnique({
        where: { id: req.params.id }
      });

      if (!existingUser) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (email !== undefined) updateData.email = email.toLowerCase();
      if (username !== undefined) updateData.username = username.toLowerCase();
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: existingUser.companyId || null,
        action: "update",
        resourceType: "user",
        resourceId: user.id,
        changes: { before: existingUser, after: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: user, message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete user (generic)
  app.delete("/api/users/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const user = await prisma.user.findUnique({
        where: { id: req.params.id }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const deactivatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { status: "inactive" }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: user.companyId || null,
        action: "delete",
        resourceType: "user",
        resourceId: user.id,
        changes: { deactivated: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: deactivatedUser, message: "User deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Consolidated User Management Module setup complete!");
};
