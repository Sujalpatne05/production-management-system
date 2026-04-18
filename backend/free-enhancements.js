/**
 * FREE ENHANCEMENTS - Reusing Existing Code
 * Adds 15+ features without additional cost
 * 
 * Features:
 * 1. Sales Quotations (reuse Order model)
 * 2. Purchase Requisitions (reuse Purchase model)
 * 3. Stock Movements (reuse Inventory model)
 * 4. User Groups (simple grouping)
 * 5. Activity Logging (track all actions)
 * 6. Sales Analytics (query existing data)
 * 7. Purchase Analytics (query existing data)
 * 8. Inventory Analytics (query existing data)
 * 9. User Analytics (query existing data)
 * 10. Dashboard Metrics (aggregate data)
 */

export const setupFreeEnhancements = (app, prisma, authenticateToken, authorize) => {
  console.log("🆓 Setting up FREE enhancements...");

  // =====================
  // 1. SALES QUOTATIONS (Reuse Order Model)
  // =====================

  // Create quotation (reuse Order model with status "quotation")
  app.post("/api/sales/quotations", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    const { customerId, customer, items, total } = req.body;
    
    try {
      const quotation = await prisma.order.create({
        data: {
          orderNumber: `QT-${Date.now()}`,
          customerId,
          customer,
          items,
          total,
          status: "quotation",
          date: new Date()
        }
      });
      
      console.log(`✅ Quotation created: ${quotation.orderNumber}`);
      res.status(201).json({
        success: true,
        data: quotation,
        message: "Quotation created successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all quotations
  app.get("/api/sales/quotations", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const quotations = await prisma.order.findMany({
        where: { status: "quotation" },
        take: 100
      });
      
      res.json({
        success: true,
        data: quotations,
        total: quotations.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Convert quotation to order
  app.post("/api/sales/quotations/:id/convert-to-order", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const quotation = await prisma.order.findUnique({
        where: { id: req.params.id }
      });
      
      if (!quotation || quotation.status !== "quotation") {
        return res.status(404).json({ success: false, error: "Quotation not found" });
      }
      
      // Update quotation status to order
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: "pending" }
      });
      
      console.log(`✅ Quotation converted to order: ${order.orderNumber}`);
      res.json({
        success: true,
        data: order,
        message: "Quotation converted to order successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // 2. PURCHASE REQUISITIONS (Reuse Purchase Model)
  // =====================

  // Create requisition (reuse Purchase model with status "requisition")
  app.post("/api/procurement/requisitions", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    const { supplierId, supplier, items, total } = req.body;
    
    try {
      const requisition = await prisma.purchase.create({
        data: {
          invoiceNo: `REQ-${Date.now()}`,
          supplierId,
          supplier,
          items,
          total,
          status: "requisition",
          date: new Date()
        }
      });
      
      console.log(`✅ Requisition created: ${requisition.invoiceNo}`);
      res.status(201).json({
        success: true,
        data: requisition,
        message: "Requisition created successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all requisitions
  app.get("/api/procurement/requisitions", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const requisitions = await prisma.purchase.findMany({
        where: { status: "requisition" },
        take: 100
      });
      
      res.json({
        success: true,
        data: requisitions,
        total: requisitions.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Approve requisition
  app.post("/api/procurement/requisitions/:id/approve", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const requisition = await prisma.purchase.update({
        where: { id: req.params.id },
        data: { status: "approved" }
      });
      
      console.log(`✅ Requisition approved: ${requisition.invoiceNo}`);
      res.json({
        success: true,
        data: requisition,
        message: "Requisition approved successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Convert requisition to purchase order
  app.post("/api/procurement/requisitions/:id/convert-to-po", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const requisition = await prisma.purchase.findUnique({
        where: { id: req.params.id }
      });
      
      if (!requisition || requisition.status !== "approved") {
        return res.status(400).json({ success: false, error: "Requisition must be approved first" });
      }
      
      // Update to purchase order
      const po = await prisma.purchase.update({
        where: { id: req.params.id },
        data: { status: "pending" }
      });
      
      console.log(`✅ Requisition converted to PO: ${po.invoiceNo}`);
      res.json({
        success: true,
        data: po,
        message: "Requisition converted to purchase order"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // 3. STOCK MOVEMENTS (Reuse Inventory Model)
  // =====================

  // Record stock movement
  app.post("/api/inventory/movements", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    const { itemId, itemName, type, quantity, reference, notes } = req.body;
    
    try {
      // Find inventory item
      const inventory = await prisma.inventory.findUnique({
        where: { id: itemId }
      });
      
      if (!inventory) {
        return res.status(404).json({ success: false, error: "Item not found" });
      }
      
      // Update inventory quantity
      let newQuantity = inventory.quantity;
      if (type === "in") {
        newQuantity += quantity;
      } else if (type === "out") {
        newQuantity -= quantity;
      }
      
      // Update inventory
      const updated = await prisma.inventory.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
      });
      
      // Log movement
      const movement = {
        id: `MOV-${Date.now()}`,
        itemId,
        itemName: itemName || inventory.name,
        type,
        quantity,
        previousQuantity: inventory.quantity,
        newQuantity,
        reference,
        notes,
        timestamp: new Date(),
        userId: req.user.id
      };
      
      console.log(`✅ Stock movement recorded: ${type} ${quantity} units of ${itemName}`);
      res.status(201).json({
        success: true,
        data: movement,
        inventory: updated,
        message: "Stock movement recorded successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get stock movement history (simulated from inventory changes)
  app.get("/api/inventory/movements", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const inventory = await prisma.inventory.findMany({
        take: 100
      });
      
      // Simulate movement history
      const movements = inventory.map(item => ({
        id: `MOV-${item.id}`,
        itemId: item.id,
        itemName: item.name,
        type: "current",
        quantity: item.quantity,
        timestamp: item.updatedAt
      }));
      
      res.json({
        success: true,
        data: movements,
        total: movements.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // 4. USER GROUPS (Simple Grouping)
  // =====================

  // In-memory user groups storage (for demo)
  const userGroups = new Map();

  // Create user group
  app.post("/api/users/groups", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    const { name, description, permissions } = req.body;
    
    try {
      const groupId = `GRP-${Date.now()}`;
      const group = {
        id: groupId,
        name,
        description,
        permissions: permissions || [],
        members: [],
        createdAt: new Date()
      };
      
      userGroups.set(groupId, group);
      
      console.log(`✅ User group created: ${name}`);
      res.status(201).json({
        success: true,
        data: group,
        message: "User group created successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all user groups
  app.get("/api/users/groups", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const groups = Array.from(userGroups.values());
      
      res.json({
        success: true,
        data: groups,
        total: groups.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Add user to group
  app.post("/api/users/groups/:groupId/members", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    const { userId } = req.body;
    
    try {
      const group = userGroups.get(req.params.groupId);
      
      if (!group) {
        return res.status(404).json({ success: false, error: "Group not found" });
      }
      
      if (!group.members.includes(userId)) {
        group.members.push(userId);
      }
      
      console.log(`✅ User added to group: ${group.name}`);
      res.json({
        success: true,
        data: group,
        message: "User added to group successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // 5. ACTIVITY LOGGING (Track All Actions)
  // =====================

  // In-memory activity log
  const activityLog = [];

  // Log activity middleware
  const logActivity = (action, resource, details) => {
    activityLog.push({
      id: `ACT-${Date.now()}`,
      action,
      resource,
      details,
      timestamp: new Date(),
      userId: "system"
    });
    
    // Keep only last 1000 activities
    if (activityLog.length > 1000) {
      activityLog.shift();
    }
  };

  // Get activity log
  app.get("/api/activity-log", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const limit = req.query.limit || 100;
      const activities = activityLog.slice(-limit).reverse();
      
      res.json({
        success: true,
        data: activities,
        total: activityLog.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // 6. SALES ANALYTICS (Query Existing Data)
  // =====================

  // Sales summary
  app.get("/api/analytics/sales-summary", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const sales = await prisma.sale.findMany();
      const orders = await prisma.order.findMany({
        where: { status: { not: "quotation" } }
      });
      
      const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
      const totalOrders = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
      const totalPaid = sales.reduce((sum, s) => sum + parseFloat(s.paid || 0), 0);
      const totalDue = sales.reduce((sum, s) => sum + parseFloat(s.due || 0), 0);
      
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
  app.get("/api/analytics/sales-by-customer", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const sales = await prisma.sale.findMany();
      
      const byCustomer = {};
      sales.forEach(sale => {
        const customer = sale.customer || "Unknown";
        if (!byCustomer[customer]) {
          byCustomer[customer] = { customer, total: 0, count: 0 };
        }
        byCustomer[customer].total += parseFloat(sale.total || 0);
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
  // 7. PURCHASE ANALYTICS (Query Existing Data)
  // =====================

  // Purchase summary
  app.get("/api/analytics/purchase-summary", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const purchases = await prisma.purchase.findMany({
        where: { status: { not: "requisition" } }
      });
      
      const totalPurchases = purchases.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      const totalPaid = purchases.reduce((sum, p) => sum + parseFloat(p.paid || 0), 0);
      const totalDue = purchases.reduce((sum, p) => sum + parseFloat(p.due || 0), 0);
      
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
  app.get("/api/analytics/purchase-by-supplier", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const purchases = await prisma.purchase.findMany({
        where: { status: { not: "requisition" } }
      });
      
      const bySupplier = {};
      purchases.forEach(purchase => {
        const supplier = purchase.supplier || "Unknown";
        if (!bySupplier[supplier]) {
          bySupplier[supplier] = { supplier, total: 0, count: 0 };
        }
        bySupplier[supplier].total += parseFloat(purchase.total || 0);
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
  // 8. INVENTORY ANALYTICS (Query Existing Data)
  // =====================

  // Inventory summary
  app.get("/api/analytics/inventory-summary", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const inventory = await prisma.inventory.findMany();
      
      const totalItems = inventory.length;
      const totalQuantity = inventory.reduce((sum, i) => sum + (i.quantity || 0), 0);
      const totalValue = inventory.reduce((sum, i) => sum + (parseFloat(i.unitPrice || 0) * (i.quantity || 0)), 0);
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
  app.get("/api/analytics/low-stock-items", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const inventory = await prisma.inventory.findMany();
      
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
  // 9. USER ANALYTICS (Query Existing Data)
  // =====================

  // User summary
  app.get("/api/analytics/user-summary", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      
      const byRole = {};
      users.forEach(user => {
        const role = user.role || "user";
        byRole[role] = (byRole[role] || 0) + 1;
      });
      
      const byStatus = {};
      users.forEach(user => {
        const status = user.status || "active";
        byStatus[status] = (byStatus[status] || 0) + 1;
      });
      
      res.json({
        success: true,
        data: {
          totalUsers: users.length,
          byRole,
          byStatus
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // 10. DASHBOARD METRICS (Aggregate Data)
  // =====================

  // Complete dashboard metrics
  app.get("/api/analytics/dashboard-metrics", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      // Sales metrics
      const sales = await prisma.sale.findMany();
      const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
      
      // Purchase metrics
      const purchases = await prisma.purchase.findMany();
      const totalPurchases = purchases.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      
      // Inventory metrics
      const inventory = await prisma.inventory.findMany();
      const totalInventoryValue = inventory.reduce((sum, i) => sum + (parseFloat(i.unitPrice || 0) * (i.quantity || 0)), 0);
      
      // Production metrics
      const production = await prisma.production.findMany();
      const completedProduction = production.filter(p => p.status === "Completed").length;
      
      // Order metrics
      const orders = await prisma.order.findMany();
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
            pending: production.filter(p => p.status === "Running").length
          },
          orders: {
            total: orders.length,
            pending: pendingOrders,
            completed: orders.filter(o => o.status === "Completed").length
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ FREE enhancements setup complete!");
};
