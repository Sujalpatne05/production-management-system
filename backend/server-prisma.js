import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'http://127.0.0.1:8081', 'http://127.0.0.1:3000'],
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
      const data = await prisma[model].findMany({
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
  { name: "users", model: "user" },
  { name: "attendance", model: "attendance" },
  { name: "orders", model: "order" },
  { name: "production", model: "production" },
  { name: "sales", model: "sale" },
  { name: "purchases", model: "purchase" },
  { name: "inventory", model: "inventory" },
  { name: "expenses", model: "expense" },
  { name: "payments", model: "payment" },
  { name: "payroll", model: "payroll" },
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
];

resources.forEach((resource) => {
  if (resource.name === "users") {
    const usersAccess = {
      getAll: [authenticateToken, authorize(["admin", "super_admin"])],
      getOne: [authenticateToken],
      create: [authenticateToken, authorize(["super_admin"])],
      update: [authenticateToken, authorize(["super_admin"])],
      delete: [authenticateToken, authorize(["super_admin"])],
    };
    createCrudEndpoints(resource.name, resource.model, usersAccess);
  } else {
    createCrudEndpoints(resource.name, resource.model, defaultAccess);
  }
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
  if (!password || (!email && !username)) {
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
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const hasHash = !!user.passwordHash;
    const ok = hasHash ? bcrypt.compareSync(password, user.passwordHash) : user.password === password;
    if (!ok) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    return res.json({
      success: true,
      token,
      user: { id: user.id, role: user.role, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

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
