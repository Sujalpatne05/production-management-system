/**
 * FACTORIES & PRODUCTION FACILITIES MODULE
 * Manages multiple factory locations with company isolation
 */

export const setupFactoriesModule = (app, prisma, authenticateToken, authorize) => {
  console.log("🏭 Setting up Factories & Production Facilities Module...");
  console.log("🏭 Registering GET /api/factories endpoint");

  // Test endpoint
  app.get("/api/factories-test", (req, res) => {
    res.json({ success: true, message: "Factories module is loaded!" });
  });

  // Logging middleware for factories endpoint
  app.use("/api/factories", (req, res, next) => {
    console.log("🏭 [MIDDLEWARE] GET /api/factories called");
    next();
  });

  // =====================
  // FACTORIES CRUD
  // =====================

  // Get all factories for a company
  app.get("/api/factories", authenticateToken, async (req, res) => {
    try {
      console.log("🏭🏭🏭 GET /api/factories called!");
      console.log("🏭 User object:", req.user);
      const { companyId } = req.query;
      const user = req.user;

      console.log("🏭 GET /api/factories - User:", { id: user.id, role: user.role, companyId: user.companyId });

      // Determine which company to query
      let queryCompanyId = companyId;
      if (user.role !== 'super_admin') {
        // Regular users can only see their company's factories
        queryCompanyId = user.companyId;
      }

      if (!queryCompanyId) {
        console.log("❌ No company ID found");
        return res.status(400).json({ success: false, error: "Company ID required" });
      }

      // Verify access
      if (user.role !== 'super_admin' && user.companyId !== queryCompanyId) {
        console.log("❌ Access denied - company mismatch");
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      const factories = await prisma.factory.findMany({
        where: { companyId: queryCompanyId },
        orderBy: { createdAt: "desc" }
      });

      console.log(`📦 Found ${factories.length} factories for company ${queryCompanyId}`);
      console.log(`📦 Factories data:`, factories);

      // Calculate metrics for each factory
      const factoriesWithMetrics = await Promise.all(
        factories.map(async (factory) => {
          const employees = await prisma.user.count({
            where: { companyId: queryCompanyId, department: factory.name }
          });

          return {
            ...factory,
            employeeCount: employees
          };
        })
      );

      console.log(`✅ Returning ${factoriesWithMetrics.length} factories`);
      res.json({
        success: true,
        data: factoriesWithMetrics,
        total: factoriesWithMetrics.length,
        _source: "factories-module"
      });
    } catch (error) {
      console.error("❌ Error fetching factories:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single factory
  app.get("/api/factories/:id", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const factory = await prisma.factory.findUnique({
        where: { id: req.params.id }
      });

      if (!factory) {
        return res.status(404).json({ success: false, error: "Factory not found" });
      }

      // Verify access
      if (req.user.role !== 'super_admin' && req.user.companyId !== factory.companyId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Get employees count
      const employees = await prisma.user.count({
        where: { companyId: factory.companyId, department: factory.name }
      });

      res.json({
        success: true,
        data: {
          ...factory,
          employeeCount: employees
        }
      });
    } catch (error) {
      console.error("Error fetching factory:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create factory
  app.post("/api/factories", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { name, type, location, manager, employees, productionLines, storageCapacity, efficiency, companyId } = req.body;
      const user = req.user;

      // Validation
      if (!name || !type || !location) {
        return res.status(400).json({ success: false, error: "Name, type, and location are required" });
      }

      if (!["Main Office", "Branch Office"].includes(type)) {
        return res.status(400).json({ success: false, error: "Type must be 'Main Office' or 'Branch Office'" });
      }

      // Determine company
      let factoryCompanyId = companyId;
      if (user.role !== 'super_admin') {
        factoryCompanyId = user.companyId;
      }

      if (!factoryCompanyId) {
        return res.status(400).json({ success: false, error: "Company ID required" });
      }

      // Verify access
      if (user.role !== 'super_admin' && user.companyId !== factoryCompanyId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Check if main office already exists for this company
      if (type === "Main Office") {
        const existingMainOffice = await prisma.factory.findFirst({
          where: {
            companyId: factoryCompanyId,
            type: "Main Office"
          }
        });

        if (existingMainOffice) {
          return res.status(400).json({ success: false, error: "Company can only have one Main Office" });
        }
      }

      const factory = await prisma.factory.create({
        data: {
          name,
          type,
          location,
          manager: manager || "Not Assigned",
          employees: parseInt(employees) || 0,
          productionLines: parseInt(productionLines) || 0,
          storageCapacity: parseFloat(storageCapacity) || 0,
          storageUsed: 0,
          efficiency: parseFloat(efficiency) || 0,
          companyId: factoryCompanyId,
          status: "active"
        }
      });

      console.log(`✅ Factory created: ${name} (${type})`);
      res.status(201).json({
        success: true,
        data: factory,
        message: "Factory created successfully"
      });
    } catch (error) {
      console.error("Error creating factory:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update factory
  app.put("/api/factories/:id", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { name, type, location, manager, employees, productionLines, storageCapacity, efficiency } = req.body;
      const user = req.user;

      // Get existing factory
      const existingFactory = await prisma.factory.findUnique({
        where: { id: req.params.id }
      });

      if (!existingFactory) {
        return res.status(404).json({ success: false, error: "Factory not found" });
      }

      // Verify access
      if (user.role !== 'super_admin' && user.companyId !== existingFactory.companyId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Check type change
      if (type && type !== existingFactory.type && type === "Main Office") {
        const existingMainOffice = await prisma.factory.findFirst({
          where: {
            companyId: existingFactory.companyId,
            type: "Main Office",
            id: { not: req.params.id }
          }
        });

        if (existingMainOffice) {
          return res.status(400).json({ success: false, error: "Company can only have one Main Office" });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (location !== undefined) updateData.location = location;
      if (manager !== undefined) updateData.manager = manager;
      if (employees !== undefined) updateData.employees = parseInt(employees);
      if (productionLines !== undefined) updateData.productionLines = parseInt(productionLines);
      if (storageCapacity !== undefined) updateData.storageCapacity = parseFloat(storageCapacity);
      if (efficiency !== undefined) updateData.efficiency = parseFloat(efficiency);

      const factory = await prisma.factory.update({
        where: { id: req.params.id },
        data: updateData
      });

      console.log(`✅ Factory updated: ${factory.name}`);
      res.json({
        success: true,
        data: factory,
        message: "Factory updated successfully"
      });
    } catch (error) {
      console.error("Error updating factory:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete factory
  app.delete("/api/factories/:id", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const user = req.user;

      // Get existing factory
      const existingFactory = await prisma.factory.findUnique({
        where: { id: req.params.id }
      });

      if (!existingFactory) {
        return res.status(404).json({ success: false, error: "Factory not found" });
      }

      // Verify access
      if (user.role !== 'super_admin' && user.companyId !== existingFactory.companyId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Prevent deleting main office if it's the only factory
      if (existingFactory.type === "Main Office") {
        const factoryCount = await prisma.factory.count({
          where: { companyId: existingFactory.companyId }
        });

        if (factoryCount === 1) {
          return res.status(400).json({ success: false, error: "Cannot delete the only factory. Company must have at least one Main Office." });
        }
      }

      const factory = await prisma.factory.delete({
        where: { id: req.params.id }
      });

      console.log(`✅ Factory deleted: ${factory.name}`);
      res.json({
        success: true,
        data: factory,
        message: "Factory deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting factory:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // FACTORY STATISTICS
  // =====================

  // Get factory statistics
  app.get("/api/factories/:id/statistics", authenticateToken, async (req, res) => {
    try {
      const factory = await prisma.factory.findUnique({
        where: { id: req.params.id }
      });

      if (!factory) {
        return res.status(404).json({ success: false, error: "Factory not found" });
      }

      // Verify access
      if (req.user.role !== 'super_admin' && req.user.companyId !== factory.companyId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Get employees
      const employees = await prisma.user.count({
        where: { companyId: factory.companyId, department: factory.name }
      });

      // Get production data
      const productionOrders = await prisma.production.count({
        where: { companyId: factory.companyId }
      });

      res.json({
        success: true,
        data: {
          factoryId: factory.id,
          factoryName: factory.name,
          type: factory.type,
          location: factory.location,
          manager: factory.manager,
          employees,
          productionLines: factory.productionLines,
          storageCapacity: factory.storageCapacity,
          storageUsed: factory.storageUsed,
          storagePercentage: factory.storageCapacity > 0 ? ((factory.storageUsed / factory.storageCapacity) * 100).toFixed(2) : 0,
          efficiency: factory.efficiency,
          productionOrders,
          status: factory.status
        }
      });
    } catch (error) {
      console.error("Error fetching factory statistics:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get company factory summary
  app.get("/api/factories/company/summary", authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const companyId = user.role === 'super_admin' ? req.query.companyId : user.companyId;

      if (!companyId) {
        return res.status(400).json({ success: false, error: "Company ID required" });
      }

      const factories = await prisma.factory.findMany({
        where: { companyId }
      });

      const totalEmployees = await prisma.user.count({
        where: { companyId }
      });

      const totalProductionLines = factories.reduce((sum, f) => sum + f.productionLines, 0);
      const totalStorageCapacity = factories.reduce((sum, f) => sum + f.storageCapacity, 0);
      const totalStorageUsed = factories.reduce((sum, f) => sum + f.storageUsed, 0);
      const avgEfficiency = factories.length > 0 
        ? (factories.reduce((sum, f) => sum + f.efficiency, 0) / factories.length).toFixed(2)
        : 0;

      res.json({
        success: true,
        data: {
          totalFactories: factories.length,
          mainOffices: factories.filter(f => f.type === "Main Office").length,
          branchOffices: factories.filter(f => f.type === "Branch Office").length,
          totalEmployees,
          totalProductionLines,
          totalStorageCapacity,
          totalStorageUsed,
          storagePercentage: totalStorageCapacity > 0 ? ((totalStorageUsed / totalStorageCapacity) * 100).toFixed(2) : 0,
          averageEfficiency: avgEfficiency,
          factories: factories.map(f => ({
            id: f.id,
            name: f.name,
            type: f.type,
            location: f.location,
            manager: f.manager,
            employees: f.employees,
            productionLines: f.productionLines,
            efficiency: f.efficiency,
            status: f.status
          }))
        }
      });
    } catch (error) {
      console.error("Error fetching factory summary:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Factories & Production Facilities Module setup complete!");
};
