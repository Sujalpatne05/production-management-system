/**
 * CONSOLIDATED INVENTORY MODULE
 * Consolidates all inventory endpoints from:
 * - server-prisma.js (/api/inventory)
 * - additional-endpoints.js (/api/stock-transactions)
 * - free-enhancements.js (/api/inventory/movements)
 * 
 * New consolidated endpoints:
 * - /api/inventory (inventory CRUD)
 * - /api/inventory/transactions (transaction tracking)
 * - /api/inventory/movements (movement history)
 */

export const setupInventoryModule = (app, prisma, authenticateToken, authorize) => {
  console.log("📦 Setting up Consolidated Inventory Module...");

  // =====================
  // INVENTORY CRUD
  // =====================

  // Get all inventory items
  app.get("/api/inventory", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId, category, lowStock } = req.query;
      const where = {};

      if (companyId) where.companyId = companyId;
      if (category) where.category = category;

      let inventory = await prisma.inventory.findMany({
        where,
        take: 100
      });

      // Filter low stock if requested
      if (lowStock === "true") {
        inventory = inventory.filter(i => i.quantity < (i.reorderLevel || 10));
      }

      res.json({
        success: true,
        data: inventory,
        total: inventory.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single inventory item
  app.get("/api/inventory/:id", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const item = await prisma.inventory.findUnique({
        where: { id: req.params.id }
      });

      if (!item) {
        return res.status(404).json({ success: false, error: "Inventory item not found" });
      }

      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create inventory item
  app.post("/api/inventory", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { sku, name, category, quantity, unitPrice, reorderLevel, supplier, companyId } = req.body;

      if (!sku || !name) {
        return res.status(400).json({ success: false, error: "SKU and name are required" });
      }

      const item = await prisma.inventory.create({
        data: {
          sku,
          name,
          category,
          quantity: parseInt(quantity) || 0,
          unitPrice: unitPrice ? parseFloat(unitPrice) : null,
          reorderLevel: reorderLevel ? parseInt(reorderLevel) : 10,
          supplier,
          companyId
        }
      });

      console.log(`✅ Inventory item created: ${name}`);
      res.status(201).json({
        success: true,
        data: item,
        message: "Inventory item created successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update inventory item
  app.put("/api/inventory/:id", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const item = await prisma.inventory.update({
        where: { id: req.params.id },
        data: req.body
      });

      console.log(`✅ Inventory item updated: ${req.params.id}`);
      res.json({
        success: true,
        data: item,
        message: "Inventory item updated successfully"
      });
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ success: false, error: "Inventory item not found" });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });

  // Delete inventory item
  app.delete("/api/inventory/:id", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const item = await prisma.inventory.delete({
        where: { id: req.params.id }
      });

      console.log(`✅ Inventory item deleted: ${req.params.id}`);
      res.json({
        success: true,
        data: item,
        message: "Inventory item deleted successfully"
      });
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ success: false, error: "Inventory item not found" });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });

  // =====================
  // STOCK TRANSACTIONS
  // =====================

  // Get all stock transactions
  app.get("/api/inventory/transactions", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId } = req.query;
      const where = companyId ? { companyId } : {};

      const transactions = await prisma.transaction.findMany({
        where,
        take: 100
      });

      res.json({
        success: true,
        data: transactions,
        total: transactions.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create stock transaction
  app.post("/api/inventory/transactions", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { transactionNo, date, accountId, debit, credit, description, reference, companyId } = req.body;

      const transaction = await prisma.transaction.create({
        data: {
          transactionNo: transactionNo || `TXN-${Date.now()}`,
          date: date ? new Date(date) : new Date(),
          accountId,
          debit: debit ? parseFloat(debit) : 0,
          credit: credit ? parseFloat(credit) : 0,
          description,
          reference,
          companyId
        }
      });

      console.log(`✅ Stock transaction created: ${transaction.transactionNo}`);
      res.status(201).json({
        success: true,
        data: transaction,
        message: "Stock transaction created successfully"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // STOCK MOVEMENTS
  // =====================

  // Record stock movement
  app.post("/api/inventory/movements", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    const { itemId, itemName, type, quantity, reference, notes, companyId } = req.body;
    
    try {
      if (!itemId || !type || !quantity) {
        return res.status(400).json({ success: false, error: "itemId, type, and quantity are required" });
      }

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
        newQuantity += parseInt(quantity);
      } else if (type === "out") {
        newQuantity -= parseInt(quantity);
      } else {
        return res.status(400).json({ success: false, error: "Type must be 'in' or 'out'" });
      }

      // Prevent negative inventory
      if (newQuantity < 0) {
        return res.status(400).json({ success: false, error: "Insufficient inventory" });
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
        quantity: parseInt(quantity),
        previousQuantity: inventory.quantity,
        newQuantity,
        reference,
        notes,
        companyId,
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

  // Get stock movement history
  app.get("/api/inventory/movements", authenticateToken, authorize(["user", "admin", "super_admin"]), async (req, res) => {
    try {
      const { companyId, itemId } = req.query;
      const where = {};

      if (companyId) where.companyId = companyId;

      const inventory = await prisma.inventory.findMany({
        where,
        take: 100
      });
      
      // Simulate movement history from inventory items
      let movements = inventory.map(item => ({
        id: `MOV-${item.id}`,
        itemId: item.id,
        itemName: item.name,
        type: "current",
        quantity: item.quantity,
        timestamp: item.updatedAt
      }));

      // Filter by itemId if provided
      if (itemId) {
        movements = movements.filter(m => m.itemId === itemId);
      }
      
      res.json({
        success: true,
        data: movements,
        total: movements.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Consolidated Inventory Module setup complete!");
};
