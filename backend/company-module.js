/**
 * COMPANY MANAGEMENT MODULE
 * Handles all company-related operations
 * Extracted from super-admin-module.js
 */

import bcrypt from "bcryptjs";

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  if (!phone) return true;
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createAuditLog = async (prisma, data) => {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

export const setupCompanyModule = (app, prisma, authenticateToken, authorize) => {
  console.log("🏢 Setting up Company Management Module...");

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

  // Create company with admin in one transaction
  app.post("/api/super-admin/companies-with-admin", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { company, admin } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      
      // Company validation
      if (!company.name || company.name.trim().length === 0) errors.name = "Company name is required";
      if (!company.email || company.email.trim().length === 0) errors.email = "Company email is required";
      else if (!isValidEmail(company.email)) errors.email = "Invalid company email format";
      if (company.phone && !isValidPhone(company.phone)) errors.phone = "Invalid phone format";
      if (company.website && !isValidUrl(company.website)) errors.website = "Invalid website URL";

      // Admin validation
      if (!admin.name || admin.name.trim().length === 0) errors.adminName = "Admin name is required";
      if (!admin.email || admin.email.trim().length === 0) errors.adminEmail = "Admin email is required";
      else if (!isValidEmail(admin.email)) errors.adminEmail = "Invalid admin email format";
      if (admin.phone && !isValidPhone(admin.phone)) errors.adminPhone = "Invalid admin phone format";
      if (!admin.password) errors.adminPassword = "Password is required";
      else if (admin.password.length < 6) errors.adminPassword = "Password must be at least 6 characters";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check if company email already exists
      const existingCompany = await prisma.company.findUnique({
        where: { email: company.email.toLowerCase() }
      }).catch(() => null);

      if (existingCompany) {
        return res.status(409).json({ success: false, error: "Company email already in use", code: "DUPLICATE_RECORD" });
      }

      // Check if admin email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: admin.email.toLowerCase() }
      }).catch(() => null);

      if (existingUser) {
        return res.status(409).json({ success: false, error: "Admin email already in use", code: "DUPLICATE_RECORD" });
      }

      // Get subscription plan
      let plan = null;
      if (company.subscriptionPlan) {
        plan = await prisma.subscriptionPlan.findUnique({
          where: { name: company.subscriptionPlan }
        });
        if (!plan) {
          return res.status(400).json({ success: false, error: "Subscription plan not found" });
        }
      }

      // Hash admin password
      const passwordHash = await bcrypt.hash(admin.password, 10);

      // Create company and admin in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create company
        const newCompany = await tx.company.create({
          data: {
            name: company.name.trim(),
            email: company.email.toLowerCase(),
            phone: company.phone || null,
            address: company.address || null,
            website: company.website || null,
            subscriptionPlan: company.subscriptionPlan || "starter",
            maxUsers: plan?.maxUsers || 10,
            maxStorage: plan?.maxStorage || 1000
          }
        });

        // Create admin user
        const adminUser = await tx.user.create({
          data: {
            name: admin.name.trim(),
            email: admin.email.toLowerCase(),
            username: admin.email.toLowerCase().split("@")[0],
            passwordHash,
            role: "admin",
            status: "active",
            companyId: newCompany.id
          }
        });

        // Create company admin record
        const companyAdmin = await tx.companyAdmin.create({
          data: {
            companyId: newCompany.id,
            userId: adminUser.id,
            role: "admin",
            status: "active"
          },
          include: {
            company: true,
            user: true
          }
        });

        return { company: newCompany, admin: companyAdmin };
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: result.company.id,
        action: "create",
        resourceType: "company_with_admin",
        resourceId: result.company.id,
        changes: { created: result },
        ipAddress,
        userAgent
      });

      res.status(201).json({ 
        success: true, 
        data: result, 
        message: "Company and admin created successfully" 
      });
    } catch (error) {
      console.error("Error creating company with admin:", error);
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

  console.log("✅ Company Management Module setup complete!");
};
