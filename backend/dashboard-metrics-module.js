/**
 * DASHBOARD METRICS MODULE
 * Handles dashboard metrics and analytics with company-level data isolation
 */

const createAuditLog = async (prisma, data) => {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

export const setupDashboardMetricsModule = (app, prisma, authenticateToken, authorize) => {
  console.log("📊 Setting up Dashboard Metrics Module...");

  // =====================
  // DASHBOARD METRICS
  // =====================

  // Get dashboard metrics for a company
  app.get("/api/dashboard/metrics", authenticateToken, async (req, res) => {
    try {
      const companyId = req.query.companyId;
      
      if (!companyId) {
        return res.status(400).json({ success: false, error: "companyId is required" });
      }

      console.log("Fetching metrics for company:", companyId);

      // Verify user has access to this company
      const user = req.user;
      if (user.role !== 'super_admin' && user.companyId !== companyId) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }

      // Get all sales for this company
      const sales = await prisma.sale.findMany({
        where: { companyId },
      });

      // Get all purchases for this company
      const purchases = await prisma.purchase.findMany({
        where: { companyId },
      });

      // Get all inventory for this company
      const inventory = await prisma.inventory.findMany({
        where: { companyId },
      });

      // Calculate metrics
      const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);
      const totalPurchase = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
      const pendingPayments = sales
        .filter(s => s.status === 'unpaid' || s.status === 'partial')
        .reduce((sum, s) => sum + (s.due || 0), 0);
      const profitMargin = totalSales - totalPurchase;

      // Calculate percentage changes (mock for now)
      const salesChange = sales.length > 0 ? "+12.5%" : "+0%";
      const purchaseChange = purchases.length > 0 ? "+8.2%" : "+0%";
      const paymentChange = pendingPayments > 0 ? "-3.1%" : "+0%";
      const profitChange = profitMargin > 0 ? "+15.3%" : "+0%";

      // Get monthly sales data (last 6 months)
      const monthlySalesData = generateMonthlySalesData(sales, purchases);

      // Get payment status data
      const paymentStatusData = generatePaymentStatusData(sales);

      // Get stock status data
      const stockStatusData = generateStockStatusData(inventory);

      // Get low stock products
      const lowStockProducts = inventory
        .filter(item => item.stock <= (item.minStock || 20))
        .map(item => ({
          name: item.name || `Product ${item.id}`,
          current: item.stock,
          min: item.minStock || 20,
          status: item.stock === 0 ? "Critical" : "Low",
        }))
        .slice(0, 5);

      res.json({
        success: true,
        data: {
          totalSales,
          totalPurchase,
          pendingPayments,
          profitMargin,
          salesChange,
          purchaseChange,
          paymentChange,
          profitChange,
          monthlySalesData,
          paymentStatusData,
          stockStatusData,
          lowStockProducts,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Dashboard Metrics Module setup complete!");
};

// Helper function to generate monthly sales data
function generateMonthlySalesData(sales, purchases) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data = [];

  for (let i = 0; i < 6; i++) {
    const monthSales = sales
      .filter(s => {
        const saleDate = new Date(s.date);
        const currentDate = new Date();
        const monthDiff = (currentDate.getFullYear() - saleDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - saleDate.getMonth());
        return monthDiff === i;
      })
      .reduce((sum, s) => sum + (s.total || 0), 0);

    const monthPurchase = purchases
      .filter(p => {
        const purchaseDate = new Date(p.date);
        const currentDate = new Date();
        const monthDiff = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - purchaseDate.getMonth());
        return monthDiff === i;
      })
      .reduce((sum, p) => sum + (p.total || 0), 0);

    data.push({
      month: months[i],
      sales: monthSales,
      purchase: monthPurchase,
      profit: monthSales - monthPurchase,
    });
  }

  return data.reverse();
}

// Helper function to generate payment status data
function generatePaymentStatusData(sales) {
  const paid = sales.filter(s => s.status === 'paid').length;
  const pending = sales.filter(s => s.status === 'partial' || s.status === 'unpaid').length;
  const total = sales.length || 1;

  return [
    { name: "Paid", value: Math.round((paid / total) * 100), fill: "#10b981" },
    { name: "Pending", value: Math.round((pending / total) * 100), fill: "#f59e0b" },
    { name: "Overdue", value: Math.round(((total - paid - pending) / total) * 100), fill: "#ef4444" },
  ];
}

// Helper function to generate stock status data
function generateStockStatusData(inventory) {
  const inStock = inventory.filter(i => i.stock > (i.minStock || 20)).length;
  const lowStock = inventory.filter(i => i.stock > 0 && i.stock <= (i.minStock || 20)).length;
  const outOfStock = inventory.filter(i => i.stock === 0).length;

  return [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ];
}
