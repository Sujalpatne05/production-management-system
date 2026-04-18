// Super Admin Module - Multi-Tenant Management
// This module handles all super admin operations

import { ROLES, isValidRole } from "./role-module-mapping.js";

// Helper function to create audit logs
async function createAuditLog(prisma, { userId, companyId, action, resourceType, resourceId, changes, ipAddress, userAgent, status = "success", errorMessage = null }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        companyId,
        action,
        resourceType,
        resourceId,
        changes,
        ipAddress,
        userAgent,
        status,
        errorMessage
      }
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
}

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone format
function isValidPhone(phone) {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
}

// Helper function to validate URL format
function isValidUrl(url) {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function setupSuperAdminModule(app, prisma, authenticateToken, authorize) {
  
  // =====================
  // COMPANY MANAGEMENT
  // =====================

  // Get all companies with pagination
  app.get("/api/super-admin/companies", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0, status } = req.query;
      const where = { deletedAt: null };
      
      if (status) {
        where.subscriptionStatus = status;
      }

      const companies = await prisma.company.findMany({
        where,
        include: {
          admins: { include: { user: true } },
          subscriptions: { include: { plan: true } },
          users: { select: { id: true } }
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.company.count({ where });

      res.json({ 
        success: true, 
        data: companies.map(c => ({
          ...c,
          userCount: c.users.length,
          users: undefined
        })), 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get company by ID with details
  app.get("/api/super-admin/companies/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const company = await prisma.company.findUnique({
        where: { id: req.params.id },
        include: {
          admins: { include: { user: true } },
          subscriptions: { include: { plan: true } },
          users: { select: { id: true, name: true, email: true, role: true, status: true } },
          auditLogs: { take: 10, orderBy: { createdAt: "desc" } }
        }
      });

      if (!company) {
        return res.status(404).json({ success: false, error: "Company not found" });
      }

      res.json({ 
        success: true, 
        data: {
          ...company,
          userCount: company.users.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create company
  app.post("/api/super-admin/companies", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, email, phone, address, website, subscriptionPlan } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");
      
      // Validation
      const errors = {};
      if (!name || name.trim().length === 0) errors.name = "Company name is required";
      if (!email || email.trim().length === 0) errors.email = "Email is required";
      else if (!isValidEmail(email)) errors.email = "Invalid email format";
      if (phone && !isValidPhone(phone)) errors.phone = "Invalid phone format";
      if (website && !isValidUrl(website)) errors.website = "Invalid website URL";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness
      const existingCompany = await prisma.company.findUnique({
        where: { email: email.toLowerCase() }
      }).catch(() => null);

      if (existingCompany) {
        return res.status(409).json({ success: false, error: "Email already in use", code: "DUPLICATE_RECORD" });
      }

      // Get subscription plan
      let plan = null;
      if (subscriptionPlan) {
        plan = await prisma.subscriptionPlan.findUnique({
          where: { name: subscriptionPlan }
        });
        if (!plan) {
          return res.status(400).json({ success: false, error: "Subscription plan not found" });
        }
      }

      const company = await prisma.company.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          phone,
          address,
          website,
          subscriptionPlan: subscriptionPlan || "starter",
          maxUsers: plan?.maxUsers || 10,
          maxStorage: plan?.maxStorage || 1000
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: company.id,
        action: "create",
        resourceType: "company",
        resourceId: company.id,
        changes: { created: company },
        ipAddress,
        userAgent
      });

      res.status(201).json({ success: true, data: company, message: "Company created successfully" });
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create company with admin in one transaction
  app.post("/api/super-admin/companies-with-admin", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { company: companyData, admin: adminData } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      
      // Company validation
      if (!companyData.name || companyData.name.trim().length === 0) errors.name = "Company name is required";
      if (!companyData.email || companyData.email.trim().length === 0) errors.email = "Company email is required";
      else if (!isValidEmail(companyData.email)) errors.email = "Invalid company email format";
      if (companyData.phone && !isValidPhone(companyData.phone)) errors.phone = "Invalid phone format";
      if (companyData.website && !isValidUrl(companyData.website)) errors.website = "Invalid website URL";

      // Admin validation
      if (!adminData.name || adminData.name.trim().length === 0) errors.adminName = "Admin name is required";
      if (!adminData.email || adminData.email.trim().length === 0) errors.adminEmail = "Admin email is required";
      else if (!isValidEmail(adminData.email)) errors.adminEmail = "Invalid admin email format";
      if (adminData.phone && !isValidPhone(adminData.phone)) errors.adminPhone = "Invalid admin phone format";
      if (!adminData.password || adminData.password.length < 8) errors.adminPassword = "Password must be at least 8 characters";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check if company email already exists
      const existingCompany = await prisma.company.findUnique({
        where: { email: companyData.email.toLowerCase() }
      }).catch(() => null);

      if (existingCompany) {
        return res.status(409).json({ success: false, error: "Company email already in use" });
      }

      // Check if admin email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: adminData.email.toLowerCase() }
      }).catch(() => null);

      if (existingUser) {
        return res.status(409).json({ success: false, error: "Admin email already in use" });
      }

      // Get subscription plan
      let plan = null;
      if (companyData.subscriptionPlan) {
        plan = await prisma.subscriptionPlan.findUnique({
          where: { name: companyData.subscriptionPlan }
        });
        if (!plan) {
          return res.status(400).json({ success: false, error: "Subscription plan not found" });
        }
      }

      // Hash password
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.default.hash(adminData.password, 10);

      // Create company and admin in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create company
        const newCompany = await tx.company.create({
          data: {
            name: companyData.name.trim(),
            email: companyData.email.toLowerCase(),
            phone: companyData.phone || null,
            address: companyData.address || null,
            website: companyData.website || null,
            subscriptionPlan: companyData.subscriptionPlan || "starter",
            maxUsers: plan?.maxUsers || 10,
            maxStorage: plan?.maxStorage || 1000
          }
        });

        // Create admin user
        const newUser = await tx.user.create({
          data: {
            name: adminData.name.trim(),
            email: adminData.email.toLowerCase(),
            username: adminData.email.toLowerCase().split("@")[0],
            password: hashedPassword,
            role: "admin",
            companyId: newCompany.id,
            status: "active"
          }
        });

        // Create admin assignment
        const adminAssignment = await tx.admin.create({
          data: {
            companyId: newCompany.id,
            userId: newUser.id,
            role: "admin",
            status: "active"
          }
        });

        return { company: newCompany, user: newUser, admin: adminAssignment };
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: result.company.id,
        action: "create",
        resourceType: "company_with_admin",
        resourceId: result.company.id,
        changes: { 
          company: result.company,
          admin: { name: result.user.name, email: result.user.email }
        },
        ipAddress,
        userAgent
      });

      res.status(201).json({ 
        success: true, 
        data: {
          company: result.company,
          admin: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            password: adminData.password // Return plain password for display only
          }
        },
        message: "Company and admin created successfully"
      });
    } catch (error) {
      console.error("Error creating company with admin:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update company
  app.put("/api/super-admin/companies/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, email, phone, address, website, subscriptionPlan } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get existing company
      const existingCompany = await prisma.company.findUnique({
        where: { id: req.params.id }
      });

      if (!existingCompany) {
        return res.status(404).json({ success: false, error: "Company not found" });
      }

      // Validation
      const errors = {};
      if (name !== undefined && name.trim().length === 0) errors.name = "Company name cannot be empty";
      if (email !== undefined && email.trim().length === 0) errors.email = "Email cannot be empty";
      else if (email !== undefined && !isValidEmail(email)) errors.email = "Invalid email format";
      if (phone !== undefined && phone && !isValidPhone(phone)) errors.phone = "Invalid phone format";
      if (website !== undefined && website && !isValidUrl(website)) errors.website = "Invalid website URL";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness if email is being changed
      if (email && email.toLowerCase() !== existingCompany.email) {
        const duplicateEmail = await prisma.company.findUnique({
          where: { email: email.toLowerCase() }
        }).catch(() => null);

        if (duplicateEmail) {
          return res.status(409).json({ success: false, error: "Email already in use", code: "DUPLICATE_RECORD" });
        }
      }

      // Get subscription plan if being changed
      let plan = null;
      if (subscriptionPlan && subscriptionPlan !== existingCompany.subscriptionPlan) {
        plan = await prisma.subscriptionPlan.findUnique({
          where: { name: subscriptionPlan }
        });
        if (!plan) {
          return res.status(400).json({ success: false, error: "Subscription plan not found" });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (email !== undefined) updateData.email = email.toLowerCase();
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (website !== undefined) updateData.website = website;
      if (subscriptionPlan !== undefined) {
        updateData.subscriptionPlan = subscriptionPlan;
        if (plan) {
          updateData.maxUsers = plan.maxUsers;
          updateData.maxStorage = plan.maxStorage;
        }
      }

      const company = await prisma.company.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: company.id,
        action: "update",
        resourceType: "company",
        resourceId: company.id,
        changes: { before: existingCompany, after: company },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: company, message: "Company updated successfully" });
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete company (soft delete)
  app.delete("/api/super-admin/companies/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const company = await prisma.company.findUnique({
        where: { id: req.params.id }
      });

      if (!company) {
        return res.status(404).json({ success: false, error: "Company not found" });
      }

      const deletedCompany = await prisma.company.update({
        where: { id: req.params.id },
        data: { deletedAt: new Date() }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: company.id,
        action: "delete",
        resourceType: "company",
        resourceId: company.id,
        changes: { deleted: company },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: deletedCompany, message: "Company deleted successfully" });
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

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

  // =====================
  // SUBSCRIPTION MANAGEMENT
  // =====================

  // Get all subscription plans
  app.get("/api/super-admin/plans", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const plans = await prisma.subscriptionPlan.findMany({
        where: { status: "active" },
        orderBy: { price: "asc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.subscriptionPlan.count({ where: { status: "active" } });

      res.json({ 
        success: true, 
        data: plans, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create subscription plan
  app.post("/api/super-admin/plans", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, description, price, billingCycle, maxUsers, maxStorage, features } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (!name || name.trim().length === 0) errors.name = "Plan name is required";
      if (price === undefined || price === null) errors.price = "Price is required";
      else if (isNaN(price) || parseFloat(price) < 0) errors.price = "Price must be a non-negative number";
      if (!maxUsers || maxUsers <= 0) errors.maxUsers = "Max users must be greater than 0";
      if (!maxStorage || maxStorage <= 0) errors.maxStorage = "Max storage must be greater than 0";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check name uniqueness
      const existingPlan = await prisma.subscriptionPlan.findUnique({
        where: { name: name.trim() }
      }).catch(() => null);

      if (existingPlan) {
        return res.status(409).json({ 
          success: false, 
          error: "Plan name already exists",
          code: "DUPLICATE_RECORD"
        });
      }

      const plan = await prisma.subscriptionPlan.create({
        data: {
          name: name.trim(),
          description,
          price: parseFloat(price),
          billingCycle: billingCycle || "monthly",
          maxUsers: parseInt(maxUsers),
          maxStorage: parseInt(maxStorage),
          features: features || [],
          status: "active"
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "create",
        resourceType: "subscription_plan",
        resourceId: plan.id,
        changes: { created: plan },
        ipAddress,
        userAgent
      });

      res.status(201).json({ success: true, data: plan, message: "Plan created successfully" });
    } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get company subscriptions
  app.get("/api/super-admin/subscriptions", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0, companyId, status } = req.query;
      const where = {};

      if (companyId) where.companyId = companyId;
      if (status) where.status = status;

      const subscriptions = await prisma.subscription.findMany({
        where,
        include: {
          company: true,
          plan: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.subscription.count({ where });

      res.json({ 
        success: true, 
        data: subscriptions, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update company subscription
  app.put("/api/super-admin/subscriptions/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { planId, status, autoRenew } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get existing subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: { id: req.params.id },
        include: { company: true, plan: true }
      });

      if (!existingSubscription) {
        return res.status(404).json({ success: false, error: "Subscription not found" });
      }

      // If changing plan, validate new plan exists
      let newPlan = null;
      if (planId && planId !== existingSubscription.planId) {
        newPlan = await prisma.subscriptionPlan.findUnique({
          where: { id: planId }
        });

        if (!newPlan) {
          return res.status(400).json({ success: false, error: "Subscription plan not found" });
        }

        // Check if downgrading would exceed user limit
        const userCount = await prisma.user.count({
          where: { companyId: existingSubscription.companyId }
        });

        if (userCount > newPlan.maxUsers) {
          return res.status(400).json({ 
            success: false, 
            error: `Cannot downgrade: company has ${userCount} users but new plan allows only ${newPlan.maxUsers}` 
          });
        }
      }

      const updateData = {};
      if (planId !== undefined) updateData.planId = planId;
      if (status !== undefined) updateData.status = status;
      if (autoRenew !== undefined) updateData.autoRenew = autoRenew;

      const subscription = await prisma.subscription.update({
        where: { id: req.params.id },
        data: updateData,
        include: { company: true, plan: true }
      });

      // Update company limits if plan changed
      if (newPlan) {
        await prisma.company.update({
          where: { id: existingSubscription.companyId },
          data: {
            maxUsers: newPlan.maxUsers,
            maxStorage: newPlan.maxStorage
          }
        });
      }

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: existingSubscription.companyId,
        action: "update",
        resourceType: "subscription",
        resourceId: subscription.id,
        changes: { before: existingSubscription, after: subscription },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: subscription, message: "Subscription updated successfully" });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

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

  // =====================
  // ANALYTICS & REPORTS
  // =====================

  // Get platform analytics
  app.get("/api/super-admin/analytics", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const where = { deletedAt: null };
      const dateFilter = {};

      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);

      const totalCompanies = await prisma.company.count({ where });
      const activeCompanies = await prisma.company.count({
        where: { ...where, subscriptionStatus: "active" }
      });
      const totalUsers = await prisma.user.count();
      
      const totalRevenueResult = await prisma.invoice.aggregate({
        where: { status: "paid" },
        _sum: { total: true }
      });

      const analytics = {
        totalCompanies,
        activeCompanies,
        inactiveCompanies: totalCompanies - activeCompanies,
        totalUsers,
        totalRevenue: totalRevenueResult._sum.total ? parseFloat(totalRevenueResult._sum.total) : 0,
        timestamp: new Date()
      };

      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get company statistics
  app.get("/api/super-admin/companies/:id/stats", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const companyId = req.params.id;
      const { startDate, endDate } = req.query;

      // Verify company exists
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });

      if (!company) {
        return res.status(404).json({ success: false, error: "Company not found" });
      }

      const dateFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);

      const stats = {
        totalUsers: await prisma.user.count({ where: { companyId } }),
        activeUsers: await prisma.user.count({ where: { companyId, status: "active" } }),
        totalOrders: await prisma.order.count({ where: { companyId } }),
        totalSales: await prisma.sale.count({ where: { companyId } }),
        totalExpenses: await prisma.expense.count({ where: { companyId } }),
        totalInventoryItems: await prisma.inventory.count({ where: { companyId } })
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Export analytics as CSV
  app.get("/api/super-admin/analytics/export", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const companies = await prisma.company.findMany({
        where: { deletedAt: null },
        include: {
          users: { select: { id: true } },
          subscriptions: { include: { plan: true } }
        }
      });

      // Generate CSV
      let csv = "Company Name,Email,Subscription Plan,User Count,Max Users,Status,Created At\n";
      
      companies.forEach(company => {
        const row = [
          `"${company.name}"`,
          company.email || "",
          company.subscriptionPlan,
          company.users.length,
          company.maxUsers,
          company.subscriptionStatus,
          company.createdAt.toISOString()
        ].join(",");
        csv += row + "\n";
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=analytics-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // USER PROVISIONING (Company Admin)
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
      const { name, email, role, phone, department } = req.body;
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
      else if (!isValidRole(role)) errors.role = `Invalid role. Valid roles are: ${Object.values(ROLES).join(", ")}`;
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

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          role: role || "user",
          status: "active",
          companyId: companyAdmin.companyId,
          password: "temp-password-" + Math.random().toString(36).substr(2, 9)
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

  // Update user
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

      // Validate role if provided
      if (role !== undefined && !isValidRole(role)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid role. Valid roles are: ${Object.values(ROLES).join(", ")}`
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

  // Deactivate user
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

  // =====================
  // COMPANY ADMIN SELF-SERVICE
  // =====================

  // Get company settings
  app.get("/api/company-admin/settings", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const company = await prisma.company.findUnique({
        where: { id: companyAdmin.companyId }
      });

      res.json({ success: true, data: company });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update company settings
  app.put("/api/company-admin/settings", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { name, email, phone, address, website } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const existingCompany = await prisma.company.findUnique({
        where: { id: companyAdmin.companyId }
      });

      // Validation
      const errors = {};
      if (email && !isValidEmail(email)) errors.email = "Invalid email format";
      if (phone && !isValidPhone(phone)) errors.phone = "Invalid phone format";
      if (website && !isValidUrl(website)) errors.website = "Invalid website URL";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness if email is being changed
      if (email && email.toLowerCase() !== existingCompany.email) {
        const duplicateEmail = await prisma.company.findUnique({
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

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email.toLowerCase();
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (website !== undefined) updateData.website = website;

      const company = await prisma.company.update({
        where: { id: companyAdmin.companyId },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: companyAdmin.companyId,
        action: "update",
        resourceType: "company_settings",
        resourceId: company.id,
        changes: { before: existingCompany, after: company },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: company, message: "Settings updated successfully" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get subscription details
  app.get("/api/company-admin/subscription", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const subscription = await prisma.subscription.findFirst({
        where: { companyId: companyAdmin.companyId },
        include: { plan: true }
      });

      const company = await prisma.company.findUnique({
        where: { id: companyAdmin.companyId }
      });

      const userCount = await prisma.user.count({
        where: { companyId: companyAdmin.companyId, status: "active" }
      });

      res.json({
        success: true,
        data: {
          subscription,
          company,
          userCount,
          maxUsers: company?.maxUsers || 10,
          availableSlots: (company?.maxUsers || 10) - userCount
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get admin profile
  app.get("/api/company-admin/profile", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update admin profile
  app.put("/api/company-admin/profile", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { name, email } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (email && !isValidEmail(email)) errors.email = "Invalid email format";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check email uniqueness if email is being changed
      const existingUser = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

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

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email.toLowerCase();

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "update",
        resourceType: "profile",
        resourceId: user.id,
        changes: { before: existingUser, after: user },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: user, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // SUPPORT TICKETS
  // =====================

  // Get all support tickets
  app.get("/api/super-admin/tickets", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const tickets = await prisma.supportTicket.findMany({
        include: { company: true, assignee: true },
        orderBy: { createdAt: "desc" }
      });
      res.json({ success: true, data: tickets, total: tickets.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update support ticket
  app.put("/api/super-admin/tickets/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ticket = await prisma.supportTicket.update({
        where: { id: req.params.id },
        data: req.body,
        include: { company: true, assignee: true }
      });
      res.json({ success: true, data: ticket, message: "Ticket updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // API KEYS
  // =====================

  // Get API keys
  app.get("/api/super-admin/api-keys", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const keys = await prisma.apiKey.findMany({
        select: {
          id: true,
          name: true,
          key: true,
          status: true,
          lastUsed: true,
          createdAt: true
        }
      });
      res.json({ success: true, data: keys });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create API key
  app.post("/api/super-admin/api-keys", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, companyId } = req.body;
      const key = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const secret = `secret_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const apiKey = await prisma.apiKey.create({
        data: { name, key, secret, companyId }
      });

      res.status(201).json({ success: true, data: apiKey, message: "API key created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Revoke API key
  app.delete("/api/super-admin/api-keys/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      await prisma.apiKey.update({
        where: { id: req.params.id },
        data: { status: "revoked" }
      });
      res.json({ success: true, message: "API key revoked successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Super Admin Module initialized with all endpoints");


  // =====================
  // PASSWORD MANAGEMENT
  // =====================

  // Change password (company admin)
  app.post("/api/company-admin/password-change", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (!currentPassword) errors.currentPassword = "Current password is required";
      if (!newPassword) errors.newPassword = "New password is required";
      if (newPassword && newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      // Verify current password (simple comparison for demo, use bcrypt in production)
      if (user.password !== currentPassword) {
        return res.status(401).json({ success: false, error: "Current password is incorrect" });
      }

      // Update password
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { password: newPassword }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "password_change",
        resourceType: "user",
        resourceId: user.id,
        changes: { passwordChanged: true },
        ipAddress,
        userAgent
      });

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Request password reset (public endpoint)
  app.post("/api/company-admin/password-reset", async (req, res) => {
    try {
      const { email } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ success: false, error: "Valid email is required" });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      }).catch(() => null);

      if (!user) {
        // Don't reveal if email exists (security best practice)
        return res.json({ success: true, message: "If email exists, password reset link has been sent" });
      }

      // Generate reset token (valid for 24 hours)
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Store reset token (in production, use a separate table)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: resetToken, // Temporary storage for demo
          updatedAt: resetTokenExpiry
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: user.id,
        action: "password_reset_requested",
        resourceType: "user",
        resourceId: user.id,
        changes: { resetTokenSent: true },
        ipAddress,
        userAgent
      });

      // In production, send email with reset link
      // For now, just return success
      res.json({ success: true, message: "Password reset link has been sent to your email" });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // SUBSCRIPTION PLAN DETAILS & DELETION
  // =====================

  // Get specific subscription plan details
  app.get("/api/super-admin/plans/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: req.params.id }
      });

      if (!plan) {
        return res.status(404).json({ success: false, error: "Plan not found" });
      }

      // Get companies using this plan
      const companies = await prisma.company.findMany({
        where: { subscriptionPlan: plan.name },
        select: { id: true, name: true, email: true, userCount: true }
      });

      res.json({ 
        success: true, 
        data: {
          ...plan,
          companiesUsing: companies,
          companiesCount: companies.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete subscription plan
  app.delete("/api/super-admin/plans/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: req.params.id }
      });

      if (!plan) {
        return res.status(404).json({ success: false, error: "Plan not found" });
      }

      // Check if any companies are using this plan
      const companiesUsingPlan = await prisma.company.count({
        where: { subscriptionPlan: plan.name }
      });

      if (companiesUsingPlan > 0) {
        return res.status(400).json({ 
          success: false, 
          error: `Cannot delete plan: ${companiesUsingPlan} companies are using this plan`,
          code: "PLAN_IN_USE"
        });
      }

      // Delete plan
      await prisma.subscriptionPlan.delete({
        where: { id: req.params.id }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "delete",
        resourceType: "subscription_plan",
        resourceId: plan.id,
        changes: { deleted: plan },
        ipAddress,
        userAgent
      });

      res.json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // PDF EXPORT
  // =====================

  // Export analytics as PDF (placeholder - requires PDF library)
  app.get("/api/super-admin/analytics/export-pdf", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      // This is a placeholder - in production use a library like pdfkit or puppeteer
      const companies = await prisma.company.findMany({
        where: { deletedAt: null },
        include: {
          users: { select: { id: true } },
          subscriptions: { include: { plan: true } }
        }
      });

      // For now, return JSON that can be converted to PDF on frontend
      const analyticsData = {
        generatedAt: new Date(),
        totalCompanies: companies.length,
        companies: companies.map(c => ({
          name: c.name,
          email: c.email,
          plan: c.subscriptionPlan,
          users: c.users.length,
          maxUsers: c.maxUsers,
          status: c.subscriptionStatus
        }))
      };

      res.json({ success: true, data: analyticsData, message: "PDF export data ready" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}