/**
 * PURCHASES MODULE
 * Handles purchase orders and related operations
 */

export const setupPurchasesModule = (app, prisma, authenticateToken, authorize) => {
  console.log("📦 Setting up Purchases Module...");

  // Get all purchases
  app.get("/api/purchases", authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      const companyId = user.companyId;

      if (!companyId) {
        return res.status(400).json({ success: false, error: "Company ID required" });
      }

      const purchases = await prisma.purchase.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" }
      });

      res.json({
        success: true,
        data: purchases
      });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create purchase
  app.post("/api/purchases", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { poNo, poDate, supplierId, items, total, status } = req.body;
      const user = req.user;
      const companyId = user.companyId;

      if (!companyId) {
        return res.status(400).json({ success: false, error: "Company ID required" });
      }

      if (!poNo || !supplierId || !items || items.length === 0) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      // Get supplier info
      const supplier = await prisma.party.findUnique({
        where: { id: supplierId }
      });

      if (!supplier) {
        return res.status(404).json({ success: false, error: "Supplier not found" });
      }

      console.log(`📦 Supplier found: ${supplier.name} (ID: ${supplier.id})`);

      // Create purchase with correct field mapping
      const purchase = await prisma.purchase.create({
        data: {
          companyId,
          invoiceNo: poNo,
          supplierId: supplier.id,
          supplier: supplier.name,
          items: items,
          total: parseFloat(total) || 0,
          paid: 0,
          due: parseFloat(total) || 0,
          date: new Date(poDate),
          status: status || "draft"
        }
      });

      console.log(`✅ Purchase created: ${poNo} with supplier: ${supplier.name}`);
      res.status(201).json({
        success: true,
        data: purchase,
        message: "Purchase order created successfully"
      });
    } catch (error) {
      console.error("Error creating purchase:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single purchase
  app.get("/api/purchases/:id", authenticateToken, async (req, res) => {
    try {
      const purchase = await prisma.purchase.findUnique({
        where: { id: req.params.id }
      });

      if (!purchase) {
        return res.status(404).json({ success: false, error: "Purchase not found" });
      }

      res.json({ success: true, data: purchase });
    } catch (error) {
      console.error("Error fetching purchase:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update purchase (for status changes)
  app.put("/api/purchases/:id", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const { status } = req.body;
      const purchase = await prisma.purchase.update({
        where: { id: req.params.id },
        data: { status }
      });

      console.log(`✅ Purchase status updated: ${purchase.invoiceNo} → ${status}`);
      res.json({ success: true, data: purchase });
    } catch (error) {
      console.error("Error updating purchase:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete purchase
  app.delete("/api/purchases/:id", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      const purchase = await prisma.purchase.delete({
        where: { id: req.params.id }
      });

      console.log(`✅ Purchase deleted: ${purchase.invoiceNo}`);
      res.json({ success: true, data: purchase });
    } catch (error) {
      console.error("Error deleting purchase:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Purchases Module setup complete!");
};
