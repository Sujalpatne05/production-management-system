import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { setupAdditionalEndpoints } from "./additional-endpoints.js";
import { setupFreeEnhancements } from "./free-enhancements.js";
import { setupMissingModules } from "./missing-modules.js";
import { setupHRModule } from "./hr-module.js";
import { setupSupplyChainModule } from "./supply-chain-module.js";
import { setupMissingEndpointsFix } from "./missing-endpoints-fix.js";
import { setupSuperAdminModule } from "./super-admin-module.js";
import { setupAnalyticsModule } from "./analytics-module.js";
import { setupInventoryModule } from "./inventory-module.js";
import { setupUserModule } from "./user-module.js";
import { setupHRConsolidatedModule } from "./hr-consolidated-module.js";
import { setupCompanyModule } from "./company-module.js";
import { setupSubscriptionModule } from "./subscription-module.js";
import { setupAdminManagementModule } from "./admin-management-module.js";
import { setupAuditModule } from "./audit-module.js";
import { setupAPIKeysModule } from "./api-keys-module.js";
import { setupRoleManagementModule } from "./role-management-module.js";
import { setupDashboardMetricsModule } from "./dashboard-metrics-module.js";
import { setupCompanyIsolationModule, createCompanyIsolatedCrudEndpoints } from "./company-isolation-module.js";
import { setupFactoriesModule } from "./factories-module.js";
import { setupSeedModule } from "./seed-module.js";
import { setupPurchasesModule } from "./purchases-module.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://localhost:3000',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
    'https://production-management-system.onrender.com',
    'https://production-management-system-drab.vercel.app',
    /\.vercel\.app$/,
    /\.onrender\.com$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// =====================
// Auth & RBAC helpers
// =====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Missing or invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  if (roles.length > 0 && !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }
  next();
};

// Seed default users if none exist
const seedDefaultUsers = async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const now = new Date();
      await prisma.user.createMany({
        data: [
          {
            name: "Super Admin",
            username: "superadmin",
            email: "superadmin@example.com",
            role: "super_admin",
            status: "active",
            password: "password",
          },
          {
            name: "Admin User",
            username: "admin",
            email: "admin@example.com",
            role: "admin",
            status: "active",
            password: "password",
          },
          {
            name: "Regular User",
            username: "user",
            email: "user@example.com",
            role: "user",
            status: "active",
            password: "password",
          },
        ],
      });
      console.log("✓ Seeded default users");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Generic CRUD endpoints factory
const createCrudEndpoints = (resource, model, access = {}) => {
  // GET all records
  app.get(`/api/${resource}`, ...(access.getAll || []), async (req, res) => {
    try {
      const { type } = req.query;
      const where = type ? { type } : {};
      
      const data = await prisma[model].findMany({
        where,
        take: 100, // Limit to 100 records
      });
      res.json({
        success: true,
        data,
        total: data.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET single record by ID
  app.get(`/api/${resource}/:id`, ...(access.getOne || []), async (req, res) => {
    try {
      const record = await prisma[model].findUnique({
        where: { id: req.params.id },
      });

      if (record) {
        res.json({ success: true, data: record });
      } else {
        res.status(404).json({ success: false, error: "Record not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST - Create new record
  app.post(`/api/${resource}`, ...(access.create || []), async (req, res) => {
    try {
      const newRecord = await prisma[model].create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: newRecord,
        message: `${resource.slice(0, -1)} created successfully`,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PUT - Update existing record
  app.put(`/api/${resource}/:id`, ...(access.update || []), async (req, res) => {
    try {
      const updated = await prisma[model].update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({
        success: true,
        data: updated,
        message: `${resource.slice(0, -1)} updated successfully`,
      });
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ success: false, error: "Record not found" });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });

  // DELETE - Delete record
  app.delete(`/api/${resource}/:id`, ...(access.delete || []), async (req, res) => {
    try {
      const deleted = await prisma[model].delete({
        where: { id: req.params.id },
      });

      res.json({
        success: true,
        data: deleted,
        message: `${resource.slice(0, -1)} deleted successfully`,
      });
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ success: false, error: "Record not found" });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });
};

// Default access: reads require login; writes require admin/super_admin
const defaultAccess = {
  getAll: [authenticateToken, authorize(["user", "admin", "super_admin"])],
  getOne: [authenticateToken, authorize(["user", "admin", "super_admin"])],
  create: [authenticateToken, authorize(["admin", "super_admin"])],
  update: [authenticateToken, authorize(["admin", "super_admin"])],
  delete: [authenticateToken, authorize(["admin", "super_admin"])],
};

// Create CRUD endpoints for all resources
const resources = [
  // { name: "users", model: "user" }, // CONSOLIDATED in user-module.js
  // { name: "attendance", model: "attendance" }, // CONSOLIDATED in hr-consolidated-module.js
  { name: "orders", model: "order" },
  { name: "production", model: "production" },
  { name: "sales", model: "sale" },
  // { name: "purchases", model: "purchase" }, // CONSOLIDATED in purchases-module.js
  // { name: "inventory", model: "inventory" }, // CONSOLIDATED in inventory-module.js
  { name: "expenses", model: "expense" },
  { name: "payments", model: "payment" },
  // { name: "payroll", model: "payroll" }, // CONSOLIDATED in hr-consolidated-module.js
  { name: "outlets", model: "outlet" },
  { name: "parties", model: "party" },
  { name: "quotations", model: "quotation" },
  { name: "wastes", model: "waste" },
  { name: "settings", model: "setting" },
  { name: "reports", model: "report" },
  { name: "accounting", model: "accounting" },
  { name: "product-categories", model: "productCategory" },
  { name: "rm-categories", model: "rMCategory" },
  { name: "expense-categories", model: "expenseCategory" },
  { name: "non-inventory-items", model: "nonInventoryItem" },
  { name: "accounts", model: "account" },
  { name: "transactions", model: "transaction" },
  { name: "units", model: "unit" },
  { name: "factories", model: "factory" },
];

resources.forEach((resource) => {
  createCompanyIsolatedCrudEndpoints(app, prisma, resource.name, resource.model, defaultAccess, authenticateToken, authorize);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "PostgreSQL (Neon)",
  });
});

// Get all data (for viewing everything at once)
app.get("/api/all-data", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
  try {
    const allData = {};

    for (const resource of resources) {
      allData[resource.name] = await prisma[resource.model].findMany({ take: 100 });
    }

    res.json({
      success: true,
      data: allData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  const { email, username, password } = req.body || {};
  console.log("🔐 Login attempt:", { email, username, password: password ? "***" : "missing" });
  
  if (!password || (!email && !username)) {
    console.log("❌ Missing credentials");
    return res.status(400).json({ success: false, error: "Email or username and password are required" });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { username: username || undefined },
        ],
      },
    });

    if (!user) {
      console.log("❌ User not found:", { email, username });
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    console.log("✅ User found:", { id: user.id, username: user.username, role: user.role, companyId: user.companyId });

    const hasHash = !!user.passwordHash;
    const ok = hasHash ? bcrypt.compareSync(password, user.passwordHash) : user.password === password;
    if (!ok) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    console.log("✅ Password verified");

    // Get company information if user has a company
    let company = null;
    if (user.companyId) {
      company = await prisma.company.findUnique({
        where: { id: user.companyId },
        select: { id: true, name: true, email: true, phone: true, address: true }
      });
      console.log("✅ Company found:", { id: company?.id, name: company?.name });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email, username: user.username, companyId: user.companyId },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    console.log("✅ Token generated");
    return res.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        role: user.role, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        companyId: user.companyId
      },
      company: company || null
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, username, password, fullName } = req.body || {};
  
  console.log("📝 Registration attempt:", { email, username, fullName });
  
  if (!email || !username || !password || !fullName) {
    return res.status(400).json({ success: false, error: "Email, username, password, and fullName are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
  }

  try {
    const emailLower = email.toLowerCase().trim();
    const usernameLower = username.toLowerCase().trim();
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: emailLower },
    }).catch(() => null);

    if (existingEmail) {
      console.log("❌ Email already exists:", emailLower);
      return res.status(400).json({ success: false, error: "Email already in use" });
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: usernameLower },
    }).catch(() => null);

    if (existingUsername) {
      console.log("❌ Username already exists:", usernameLower);
      return res.status(400).json({ success: false, error: "Username already in use" });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email: emailLower,
        username: usernameLower,
        password, // In production, hash this with bcrypt
        role: "user",
        status: "active",
      },
    });

    console.log("✅ User registered successfully:", newUser.id);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email, username: newUser.username },
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    console.error("Error details:", err);
    return res.status(500).json({ success: false, error: err.message || "Registration failed" });
  }
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Admin endpoint to clear all users (for testing only)
app.post("/api/admin/reset-users", async (req, res) => {
  try {
    // Delete all users
    await prisma.user.deleteMany({});
    console.log("🔄 All users deleted");
    
    // Reseed default users
    await prisma.user.createMany({
      data: [
        {
          name: "Super Admin",
          username: "superadmin",
          email: "superadmin@example.com",
          role: "super_admin",
          status: "active",
          password: "password",
        },
        {
          name: "Admin User",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          password: "password",
        },
        {
          name: "Regular User",
          username: "user",
          email: "user@example.com",
          role: "user",
          status: "active",
          password: "password",
        },
      ],
    });
    console.log("✅ Default users reseeded");
    
    return res.json({ success: true, message: "Users reset successfully" });
  } catch (err) {
    console.error("❌ Reset error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Setup consolidated modules
setupAnalyticsModule(app, prisma, authenticateToken, authorize);
setupInventoryModule(app, prisma, authenticateToken, authorize);
setupUserModule(app, prisma, authenticateToken, authorize);
setupHRConsolidatedModule(app, prisma, authenticateToken, authorize);
setupCompanyModule(app, prisma, authenticateToken, authorize);
setupSubscriptionModule(app, prisma, authenticateToken, authorize);
setupAdminManagementModule(app, prisma, authenticateToken, authorize);
setupAuditModule(app, prisma, authenticateToken, authorize);
setupAPIKeysModule(app, prisma, authenticateToken, authorize);

// Setup additional endpoints (Critical & Important)
setupAdditionalEndpoints(app, prisma, authenticateToken, authorize, JWT_SECRET);

// Setup FREE enhancements (Reusing existing code)
setupFreeEnhancements(app, prisma, authenticateToken, authorize);

// Setup MISSING MODULES (Complete ERP)
setupMissingModules(app, prisma, authenticateToken, authorize);

// Setup HR/Payroll Module
setupHRModule(app, prisma, authenticateToken, authorize);

// Setup Supply Chain Module
setupSupplyChainModule(app, prisma, authenticateToken, authorize);

// Setup Missing Endpoints Fix (for existing modules)
setupMissingEndpointsFix(app, prisma, authenticateToken, authorize);

// Setup Super Admin Module (Multi-Tenant Management)
setupSuperAdminModule(app, prisma, authenticateToken, authorize);

// Setup Role Management Module (Role-Based Access Control)
setupRoleManagementModule(app, prisma, authenticateToken, authorize);

// Setup Dashboard Metrics Module (Company-Level Analytics)
setupDashboardMetricsModule(app, prisma, authenticateToken, authorize);

// Setup Company Isolation Module (Multi-Tenant Data Isolation)
setupCompanyIsolationModule(app, prisma, authenticateToken, authorize);

// Setup Factories Module (Production Facilities Management)
setupFactoriesModule(app, prisma, authenticateToken, authorize);

// Setup Seed Module (Master Data Seeding)
setupSeedModule(app, prisma, authenticateToken, authorize);

// Setup Purchases Module (Purchase Orders)
setupPurchasesModule(app, prisma, authenticateToken, authorize);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.url,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connected successfully");

    // Seed default users
    await seedDefaultUsers();

    app.listen(PORT, () => {
      console.log("\n🚀 ================================");
      console.log(`   Backend Server Running!`);
      console.log("   ================================");
      console.log(`   📡 URL: http://localhost:${PORT}`);
      console.log(`   📊 API: http://localhost:${PORT}/api`);
      console.log(`   ❤️  Health: http://localhost:${PORT}/api/health`);
      console.log(`   🐘 Database: PostgreSQL (Neon)`);
      console.log("   ================================\n");
      console.log("   Available Resources:");
      resources.forEach((resource) => {
        console.log(`   - /api/${resource.name}`);
      });
      console.log("\n   Auth Endpoints:");
      console.log("   - POST /api/auth/login (get JWT token)");
      console.log("   - GET  /api/auth/me (current user)");
      console.log("   ================================\n");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
