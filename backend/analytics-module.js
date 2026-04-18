/**
 * CONSOLIDATED ANALYTICS MODULE
 * Consolidates all analytics endpoints from:
 * - additional-endpoints.js (/api/orders/stats, /api/productions/stats)
 * - free-enhancements.js (sales, purchase, inventory, user analytics)
 * - super-admin-module.js (/api/super-admin/analytics)
 * 
 * New consolidated endpoints:
 * - /api/super-admin/analytics (platform-wide)
 * - /api/company-admin/analytics (company-specific)
 * - /api/analytics/sales
 * - /api/analytics/purchases
 * - /api/analytics/inventory
 * - /api/analytics/production
 * - /api/analytics/orders
 * - /api/analytics/dashboard
 */

export const setupAnalyticsModule = (app, prisma, authenticateToken, authorize) => {
  console.log("📊 Setting up Consolidated Analytics Module...");

  // =====================
  // PLATFORM ANALYTICS (Super Admin)
  // =====================

  // Get platform-wide analytics
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

      // Sales metrics
      const sales = await prisma.sale.findMany();
      const totalSales = sales.reduce((sum, s) => sum + (s.total?.toNumber?.() || 0), 0);

      // Purchase metrics
      const purchases = await prisma.purchase.findMany();
      const totalPurchases = purchases.reduce((sum, p) => sum + (p.total?.toNumber?.() || 0), 0);

      // Inventory metrics
      const inventory = await prisma.inventory.findMany();
      const totalInventoryValue = inventory.reduce((sum, i) => sum + ((i.unitPrice?.toNumber?.() || 0) * (i.quantity || 0)), 0);

      // Production metrics
      const production = await prisma.production.findMany();
      const completedProduction = production.filter(p => p.status === "completed").length;

      const analytics = {
        companies: {
          total: totalCompanies,
          active: activeCompanies,
          inactive: totalCompanies - activeCompanies
        },
        users: {
          total: totalUsers
        },
        revenue: {
          total: totalRevenueResult._sum.total ? parseFloat(totalRevenueResult._sum.total) : 0
        },
        sales: {
          total: totalSales,
          count: sales.length,
          average: sales.length > 0 ? totalSales / sales.length : 0
        },
        purchases: {
          total: totalPurchases,
          count: purchases.length,
          average: purchases.length > 0 ? totalPurchases / purchases.length : 0
        },
        inventory: {
          totalValue: totalInventoryValue,
          totalItems: inventory.length,
          lowStockItems: inventory.filter(i => i.quantity < (i.reorderLevel || 10)).length
        },
        production: {
          total: production.length,
          completed: completedProduction,
          pending: production.filter(p => p.status === "in_progress").length
        },
        timestamp: new Date()
      };

      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // COMPANY ANALYTICS (Company Admin)
  // =====================

  // Get company-specific analytics
  app.get("/api/company-admin/analytics", authenticateToken, authorize(["admin"]), async (req, res) => {
    try {
      // Get company admin's company
      const companyAdmin = await prisma.companyAdmin.findFirst({
        where: { userId: req.user.id }
      });

      if (!companyAdmin) {
        return res.status(403).json({ success: false, error: "Not a company admin" });
      }

      const companyId = companyAdmin.companyId;
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

      // Sales metrics
      const sales = await prisma.sale.findMany({ where: { companyId } });
      const totalSales = sales.reduce((sum, s) => sum + (s.total?.toNumber?.() || 0), 0);

      // Purchase metrics
      const purchases = await prisma.purchase.findMany({ where: { companyId } });
      const totalPurchases = purchases.reduce((sum, p) => sum + (p.total?.toNumber?.() || 0), 0);

      // Inventory metrics
      const inventory = await prisma.inventory.findMany({ where: { companyId } });
      const totalInventoryValue = inventory.reduce((sum, i) => sum + ((i.unitPrice?.toNumber?.() || 0) * (i.quantity || 0)), 0);

      // Production metrics
      const production = await prisma.production.findMany({ where: { companyId } });
      const completedProduction = production.filter(p => p.status === "completed").length;

      // Order metrics
      const orders = await prisma.order.findMany({ where: { companyId } });
      const pendingOrders = orders.filter(o => o.status === "pending").length;

      const stats = {
        users: {
          total: await prisma.user.count({ where: { companyId } }),
          active: await prisma.user.count({ where: { companyId, status: "active" } })
        },
        sales: {
          total: totalSales,
          count: sales.length,
          average: sales.length > 0 ? totalSales / sales.length : 0,
          pending: sales.filter(s => s.status === "pending").length
        },
        purchases: {
          total: totalPurchases,
          count: purchases.length,
          average: purchases.length > 0 ? totalPurchases / purchases.length : 0,
          pending: purchases.filter(p => p.status === "pending").length
        },
        inventory: {
          totalValue: totalInventoryValue,
          totalItems: inventory.length,
          lowStockItems: inventory.filter(i => i.quantity < (i.reorderLevel || 10)).length
        },
        production: {
          total: production.length,
          completed: completedProduction,
          pending: production.filter(p => p.status === "in_progress").length
        },
        orders: {
          total: orders.length,
          pending: pendingOrders,
          completed: orders.filter(o => o.status === "completed").length
        }
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // SALES ANALYTICS
  // =====================

  // Sales summary
  app.get("/api/analytics/sales", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const sales = await prisma.sale.findMany({ where });
      const orders = await prisma.order.findMany({
        where: { ...where, status: { not: "quotation" } }
      });
      
      const totalSales = sales.reduce((sum, s) => sum + (s.total?.toNumber?.() || 0), 0);
      const totalOrders = orders.reduce((sum, o) => sum + (o.total?.toNumber?.() || 0), 0);
      const totalPaid = sales.reduce((sum, s) => sum + (s.paid?.toNumber?.() || 0), 0);
      const totalDue = sales.reduce((sum, s) => sum + (s.due?.toNumber?.() || 0), 0);
      
      res.json({
        success: true,
        data: {
          totalSales,
          totalOrders,
          totalPaid,
          totalDue,
          salesCount: sales.length,
          ordersCount: orders.length,
          averageOrderValue: orders.length > 0 ? totalOrders / orders.length : 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Sales by customer
  app.get("/api/analytics/sales/by-customer", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const sales = await prisma.sale.findMany({ where });
      
      const byCustomer = {};
      sales.forEach(sale => {
        const customer = sale.customer || "Unknown";
        if (!byCustomer[customer]) {
          byCustomer[customer] = { customer, total: 0, count: 0 };
        }
        byCustomer[customer].total += sale.total?.toNumber?.() || 0;
        byCustomer[customer].count += 1;
      });
      
      const data = Object.values(byCustomer).sort((a, b) => b.total - a.total);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // PURCHASE ANALYTICS
  // =====================

  // Purchase summary
  app.get("/api/analytics/purchases", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId, status: { not: "requisition" } } : { status: { not: "requisition" } };

      const purchases = await prisma.purchase.findMany({ where });
      
      const totalPurchases = purchases.reduce((sum, p) => sum + (p.total?.toNumber?.() || 0), 0);
      const totalPaid = purchases.reduce((sum, p) => sum + (p.paid?.toNumber?.() || 0), 0);
      const totalDue = purchases.reduce((sum, p) => sum + (p.due?.toNumber?.() || 0), 0);
      
      res.json({
        success: true,
        data: {
          totalPurchases,
          totalPaid,
          totalDue,
          purchaseCount: purchases.length,
          averagePurchaseValue: purchases.length > 0 ? totalPurchases / purchases.length : 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Purchase by supplier
  app.get("/api/analytics/purchases/by-supplier", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId, status: { not: "requisition" } } : { status: { not: "requisition" } };

      const purchases = await prisma.purchase.findMany({ where });
      
      const bySupplier = {};
      purchases.forEach(purchase => {
        const supplier = purchase.supplier || "Unknown";
        if (!bySupplier[supplier]) {
          bySupplier[supplier] = { supplier, total: 0, count: 0 };
        }
        bySupplier[supplier].total += purchase.total?.toNumber?.() || 0;
        bySupplier[supplier].count += 1;
      });
      
      const data = Object.values(bySupplier).sort((a, b) => b.total - a.total);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // INVENTORY ANALYTICS
  // =====================

  // Inventory summary
  app.get("/api/analytics/inventory", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const inventory = await prisma.inventory.findMany({ where });
      
      const totalItems = inventory.length;
      const totalQuantity = inventory.reduce((sum, i) => sum + (i.quantity || 0), 0);
      const totalValue = inventory.reduce((sum, i) => sum + ((i.unitPrice?.toNumber?.() || 0) * (i.quantity || 0)), 0);
      const lowStockItems = inventory.filter(i => i.quantity < (i.reorderLevel || 10)).length;
      
      res.json({
        success: true,
        data: {
          totalItems,
          totalQuantity,
          totalValue,
          lowStockItems,
          averageQuantity: totalItems > 0 ? totalQuantity / totalItems : 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Low stock items
  app.get("/api/analytics/inventory/low-stock", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const inventory = await prisma.inventory.findMany({ where });
      
      const lowStock = inventory.filter(i => i.quantity < (i.reorderLevel || 10));
      
      res.json({
        success: true,
        data: lowStock,
        total: lowStock.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // PRODUCTION ANALYTICS
  // =====================

  // Production summary
  app.get("/api/analytics/production", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const productions = await prisma.production.findMany({ where });
      
      const stats = {
        totalProductions: productions.length,
        inProgress: productions.filter(p => p.status === "in_progress").length,
        completed: productions.filter(p => p.status === "completed").length,
        totalQuantity: productions.reduce((sum, p) => sum + (p.quantity || 0), 0)
      };
      
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // ORDER ANALYTICS
  // =====================

  // Order stats
  app.get("/api/analytics/orders", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const orders = await prisma.order.findMany({ where });
      
      const stats = {
        totalOrders: orders.length,
        totalValue: orders.reduce((sum, o) => sum + (o.total?.toNumber?.() || 0), 0),
        pending: orders.filter(o => o.status === "pending").length,
        completed: orders.filter(o => o.status === "completed").length
      };
      
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // DASHBOARD METRICS
  // =====================

  // Complete dashboard metrics
  app.get("/api/analytics/dashboard", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      // Sales metrics
      const sales = await prisma.sale.findMany({ where });
      const totalSales = sales.reduce((sum, s) => sum + (s.total?.toNumber?.() || 0), 0);
      
      // Purchase metrics
      const purchases = await prisma.purchase.findMany({ where });
      const totalPurchases = purchases.reduce((sum, p) => sum + (p.total?.toNumber?.() || 0), 0);
      
      // Inventory metrics
      const inventory = await prisma.inventory.findMany({ where });
      const totalInventoryValue = inventory.reduce((sum, i) => sum + ((i.unitPrice?.toNumber?.() || 0) * (i.quantity || 0)), 0);
      
      // Production metrics
      const production = await prisma.production.findMany({ where });
      const completedProduction = production.filter(p => p.status === "completed").length;
      
      // Order metrics
      const orders = await prisma.order.findMany({ where });
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      
      res.json({
        success: true,
        data: {
          sales: {
            total: totalSales,
            count: sales.length,
            average: sales.length > 0 ? totalSales / sales.length : 0
          },
          purchases: {
            total: totalPurchases,
            count: purchases.length,
            average: purchases.length > 0 ? totalPurchases / purchases.length : 0
          },
          inventory: {
            totalValue: totalInventoryValue,
            totalItems: inventory.length,
            lowStockItems: inventory.filter(i => i.quantity < (i.reorderLevel || 10)).length
          },
          production: {
            total: production.length,
            completed: completedProduction,
            pending: production.filter(p => p.status === "in_progress").length
          },
          orders: {
            total: orders.length,
            pending: pendingOrders,
            completed: orders.filter(o => o.status === "completed").length
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Consolidated Analytics Module setup complete!");
};
