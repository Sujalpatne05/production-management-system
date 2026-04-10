import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, "data");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

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

// Initialize data directory and files
const initializeDataFiles = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    const dataFiles = [
      "users.json",
      "attendance.json",
      "orders.json",
      "production.json",
      "sales.json",
      "purchases.json",
      "inventory.json",
      "expenses.json",
      "payments.json",
      "payroll.json",
      "outlets.json",
      "parties.json",
      "quotations.json",
      "wastes.json",
      "settings.json",
      "reports.json",
      "accounting.json",
    ];

    for (const file of dataFiles) {
      const filePath = path.join(DATA_DIR, file);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(
          filePath,
          JSON.stringify(
            { data: [], lastUpdated: new Date().toISOString() },
            null,
            2,
          ),
        );
        console.log(`✓ Created ${file}`);
      }
    }

    console.log("✓ Data files initialized");
  } catch (error) {
    console.error("Error initializing data files:", error);
  }
};

// Helper function to read data from file
const readData = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return { data: [], lastUpdated: new Date().toISOString() };
  }
};

// Helper function to write data to file
const writeData = async (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = {
      data,
      lastUpdated: new Date().toISOString(),
      totalRecords: data.length,
    };
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Helper function to generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

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

const authorizeSelfOrRoles = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  if (req.params?.id && req.params.id === req.user.id) {
    return next();
  }
  if (roles.length > 0 && roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ success: false, error: "Forbidden" });
};

// Seed default users if none exist
const seedDefaultUsers = async () => {
  const users = await readData("users.json");
  if (Array.isArray(users.data) && users.data.length === 0) {
    const now = new Date().toISOString();
    const defaults = [
      {
        id: generateId(),
        name: "Super Admin",
        username: "superadmin",
        email: "superadmin@example.com",
        role: "super_admin",
        status: "active",
        password: "password",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Admin User",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        password: "password",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Regular User",
        username: "user",
        email: "user@example.com",
        role: "user",
        status: "active",
        password: "password",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await writeData("users.json", defaults);
    console.log("✓ Seeded default users (dev only)");
  }
};

// Generic CRUD endpoints factory
const createCrudEndpoints = (resource, filename, access = {}) => {
  // GET all records
  app.get(`/api/${resource}`, ...(access.getAll || []), async (req, res) => {
    try {
      const result = await readData(filename);
      res.json({
        success: true,
        data: result.data,
        total: result.data.length,
        lastUpdated: result.lastUpdated,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET single record by ID
  app.get(`/api/${resource}/:id`, ...(access.getOne || []), async (req, res) => {
    try {
      const result = await readData(filename);
      const record = result.data.find((item) => item.id === req.params.id);

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
      const result = await readData(filename);
      const newRecord = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      result.data.push(newRecord);
      await writeData(filename, result.data);

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
      const result = await readData(filename);
      const index = result.data.findIndex((item) => item.id === req.params.id);

      if (index !== -1) {
        result.data[index] = {
          ...result.data[index],
          ...req.body,
          id: req.params.id,
          updatedAt: new Date().toISOString(),
        };

        await writeData(filename, result.data);

        res.json({
          success: true,
          data: result.data[index],
          message: `${resource.slice(0, -1)} updated successfully`,
        });
      } else {
        res.status(404).json({ success: false, error: "Record not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // DELETE - Delete record
  app.delete(`/api/${resource}/:id`, ...(access.delete || []), async (req, res) => {
    try {
      const result = await readData(filename);
      const index = result.data.findIndex((item) => item.id === req.params.id);

      if (index !== -1) {
        const deleted = result.data.splice(index, 1)[0];
        await writeData(filename, result.data);

        res.json({
          success: true,
          data: deleted,
          message: `${resource.slice(0, -1)} deleted successfully`,
        });
      } else {
        res.status(404).json({ success: false, error: "Record not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// Create CRUD endpoints for all resources
const resources = [
  { name: "users", file: "users.json" },
  { name: "attendance", file: "attendance.json" },
  { name: "orders", file: "orders.json" },
  { name: "production", file: "production.json" },
  { name: "sales", file: "sales.json" },
  { name: "purchases", file: "purchases.json" },
  { name: "inventory", file: "inventory.json" },
  { name: "expenses", file: "expenses.json" },
  { name: "payments", file: "payments.json" },
  { name: "payroll", file: "payroll.json" },
  { name: "outlets", file: "outlets.json" },
  { name: "parties", file: "parties.json" },
  { name: "quotations", file: "quotations.json" },
  { name: "wastes", file: "wastes.json" },
  { name: "settings", file: "settings.json" },
  { name: "reports", file: "reports.json" },
  { name: "accounting", file: "accounting.json" },
  // Additional resources for frontend integration
  { name: "product-categories", file: "product-categories.json" },
  { name: "rm-categories", file: "rm-categories.json" },
  { name: "expense-categories", file: "expense-categories.json" },
  { name: "non-inventory-items", file: "non-inventory-items.json" },
  { name: "accounts", file: "accounts.json" },
  { name: "transactions", file: "transactions.json" },
  { name: "units", file: "units.json" },
];

// Default access: reads require login; writes require admin/super_admin
const defaultAccess = {
  getAll: [authenticateToken, authorize(["user", "admin", "super_admin"])],
  getOne: [authenticateToken, authorize(["user", "admin", "super_admin"])],
  create: [authenticateToken, authorize(["admin", "super_admin"])],
  update: [authenticateToken, authorize(["admin", "super_admin"])],
  delete: [authenticateToken, authorize(["admin", "super_admin"])],
};

resources.forEach((resource) => {
  if (resource.name === "users") {
    const usersAccess = {
      getAll: [authenticateToken, authorize(["admin", "super_admin"])],
      getOne: [authenticateToken, authorizeSelfOrRoles(["admin", "super_admin"])],
      create: [authenticateToken, authorize(["super_admin"])],
      update: [authenticateToken, authorize(["super_admin"])],
      delete: [authenticateToken, authorize(["super_admin"])],
    };
    createCrudEndpoints(resource.name, resource.file, usersAccess);
  } else {
    createCrudEndpoints(resource.name, resource.file, defaultAccess);
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Get all data (for viewing everything at once)
app.get("/api/all-data", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
  try {
    const allData = {};

    for (const resource of resources) {
      allData[resource.name] = await readData(resource.file);
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

// Export all data as backup
app.get("/api/backup", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
  try {
    const backup = {};

    for (const resource of resources) {
      backup[resource.name] = await readData(resource.file);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=backup-${Date.now()}.json`,
    );
    res.json({
      backup,
      createdAt: new Date().toISOString(),
      version: "1.0.0",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all data (use with caution!)
app.post("/api/clear-all", authenticateToken, authorize(["super_admin"]), async (req, res) => {
  try {
    for (const resource of resources) {
      await writeData(resource.file, []);
    }

    res.json({
      success: true,
      message: "All data cleared successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auth routes (MUST be before 404 handler)
app.post("/api/auth/login", async (req, res) => {
  const { email, username, password } = req.body || {};
  if (!password || (!email && !username)) {
    return res.status(400).json({ success: false, error: "Email or username and password are required" });
  }
  try {
    const users = await readData("users.json");
    const user = users.data.find(
      (u) => (email && u.email === email) || (username && u.username === username)
    );
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
    return res.json({ success: true, token, user: { id: user.id, role: user.role, name: user.name, email: user.email, username: user.username } });
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

// Start server with port conflict handling

const startServer = async (port = PORT) => {
  await initializeDataFiles();
  await seedDefaultUsers();

  const server = app
    .listen(port, () => {
      console.log("\n🚀 ================================");
      console.log(`   Backend Server Running!`);
      console.log("   ================================");
      console.log(`   📡 URL: http://localhost:${port}`);
      console.log(`   📊 API: http://localhost:${port}/api`);
      console.log(`   ❤️  Health: http://localhost:${port}/api/health`);
      console.log(`   📁 Data: ${DATA_DIR}`);
      console.log("   ================================\n");
      console.log("   Available Resources:");
      resources.forEach((resource) => {
        console.log(`   - /api/${resource.name}`);
      });
      console.log("\n   Special Endpoints:");
      console.log("   - GET  /api/all-data (view all data)");
      console.log("   - GET  /api/backup (download backup)");
      console.log("   - POST /api/clear-all (clear all data)");
      console.log("\n   Auth Endpoints:");
      console.log("   - POST /api/auth/login (get JWT token)");
      console.log("   - GET  /api/auth/me (current user)");
      console.log("   ================================\n");
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`\n⚠️  Port ${port} is already in use.`);
        const newPort = port + 1;
        console.log(`   Trying port ${newPort}...\n`);
        startServer(newPort);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
};

startServer();
