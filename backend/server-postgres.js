import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import pg from "pg";

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'iproduction',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Pass@123',
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✓ Database connected at:', res.rows[0].now);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(result.rows[0].count) === 0) {
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
        },
        {
          id: generateId(),
          name: "Admin User",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          password: "password",
        },
        {
          id: generateId(),
          name: "Regular User",
          username: "user",
          email: "user@example.com",
          role: "user",
          status: "active",
          password: "password",
        },
      ];

      for (const user of defaults) {
        await pool.query(
          'INSERT INTO users (id, name, username, email, role, status, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [user.id, user.name, user.username, user.email, user.role, user.status, user.password, now, now]
        );
      }
      console.log("✓ Seeded default users (dev only)");
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Generic CRUD endpoints factory
const createCrudEndpoints = (resource, tableName, access = {}) => {
  // GET all records
  app.get(`/api/${resource}`, ...(access.getAll || []), async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
      res.json({
        success: true,
        data: result.rows,
        total: result.rows.length,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET single record by ID
  app.get(`/api/${resource}/:id`, ...(access.getOne || []), async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
      
      if (result.rows.length > 0) {
        res.json({ success: true, data: result.rows[0] });
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
      const newRecord = {
        id: generateId(),
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const keys = Object.keys(newRecord);
      const values = Object.values(newRecord);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

      const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const result = await pool.query(query, values);

      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: `${resource.slice(0, -1)} created successfully`,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PUT - Update existing record
  app.put(`/api/${resource}/:id`, ...(access.update || []), async (req, res) => {
    try {
      const updates = { ...req.body, updated_at: new Date().toISOString() };
      delete updates.id; // Don't update ID
      
      const keys = Object.keys(updates);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const values = [...Object.values(updates), req.params.id];

      const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        res.json({
          success: true,
          data: result.rows[0],
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
      const result = await pool.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);

      if (result.rows.length > 0) {
        res.json({
          success: true,
          data: result.rows[0],
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

// Resource mappings
const resources = [
  { name: 'users', table: 'users' },
  { name: 'attendance', table: 'attendance' },
  { name: 'orders', table: 'orders' },
  { name: 'production', table: 'production' },
  { name: 'sales', table: 'sales' },
  { name: 'purchases', table: 'purchases' },
  { name: 'inventory', table: 'inventory' },
  { name: 'expenses', table: 'expenses' },
  { name: 'payments', table: 'payments' },
  { name: 'payroll', table: 'payroll' },
  { name: 'outlets', table: 'outlets' },
  { name: 'parties', table: 'parties' },
  { name: 'quotations', table: 'quotations' },
  { name: 'wastes', table: 'wastes' },
  { name: 'settings', table: 'settings' },
  { name: 'reports', table: 'reports' },
  { name: 'accounting', table: 'accounting' },
  // Additional resources for frontend integration
  { name: 'product-categories', table: 'product_categories' },
  { name: 'rm-categories', table: 'rm_categories' },
  { name: 'expense-categories', table: 'expense_categories' },
  { name: 'non-inventory-items', table: 'non_inventory_items' },
  { name: 'accounts', table: 'accounts' },
  { name: 'transactions', table: 'transactions' },
  { name: 'units', table: 'units' },
];

// Default access: reads require login; writes require admin/super_admin
const defaultAccess = {
  getAll: [authenticateToken, authorize(["user", "admin", "super_admin"])],
  getOne: [authenticateToken, authorize(["user", "admin", "super_admin"])],
  create: [authenticateToken, authorize(["admin", "super_admin"])],
  update: [authenticateToken, authorize(["admin", "super_admin"])],
  delete: [authenticateToken, authorize(["admin", "super_admin"])],
};

// Create CRUD endpoints
resources.forEach((resource) => {
  if (resource.name === "users") {
    const usersAccess = {
      getAll: [authenticateToken, authorize(["admin", "super_admin"])],
      getOne: [authenticateToken, authorizeSelfOrRoles(["admin", "super_admin"])],
      create: [authenticateToken, authorize(["super_admin"])],
      update: [authenticateToken, authorize(["super_admin"])],
      delete: [authenticateToken, authorize(["super_admin"])],
    };
    createCrudEndpoints(resource.name, resource.table, usersAccess);
  } else {
    createCrudEndpoints(resource.name, resource.table, defaultAccess);
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "PostgreSQL",
  });
});

// Get all data (for viewing everything at once)
app.get("/api/all-data", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
  try {
    const allData = {};

    for (const resource of resources) {
      const result = await pool.query(`SELECT * FROM ${resource.table}`);
      allData[resource.name] = {
        data: result.rows,
        lastUpdated: new Date().toISOString(),
      };
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
      const result = await pool.query(`SELECT * FROM ${resource.table}`);
      backup[resource.name] = {
        data: result.rows,
        lastUpdated: new Date().toISOString(),
      };
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
      if (resource.name !== 'users') { // Don't delete users
        await pool.query(`DELETE FROM ${resource.table}`);
      }
    }

    res.json({
      success: true,
      message: "All data cleared successfully (except users)",
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
    let query = 'SELECT * FROM users WHERE ';
    let params = [];
    
    if (email) {
      query += 'email = $1';
      params = [email];
    } else {
      query += 'username = $1';
      params = [username];
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const hasHash = !!user.password_hash;
    const ok = hasHash ? bcrypt.compareSync(password, user.password_hash) : user.password === password;
    
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
      user: { id: user.id, role: user.role, name: user.name, email: user.email, username: user.username } 
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

// Start server with port conflict handling
const startServer = async (port = PORT) => {
  await seedDefaultUsers();

  const server = app
    .listen(port, () => {
      console.log("\n🚀 ================================");
      console.log(`   Backend Server Running!`);
      console.log("   ================================");
      console.log(`   📡 URL: http://localhost:${port}`);
      console.log(`   📊 API: http://localhost:${port}/api`);
      console.log(`   ❤️  Health: http://localhost:${port}/api/health`);
      console.log(`   🐘 Database: PostgreSQL`);
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
