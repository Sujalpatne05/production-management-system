/**
 * SEED MODULE
 * Provides endpoints to seed master data for procurement
 */

export const setupSeedModule = (app, prisma, authenticateToken, authorize) => {
  console.log("🌱 Setting up Seed Module...");

  // Seed tenant master data
  app.post("/api/seed/tenant-master-data", authenticateToken, authorize(["admin", "super_admin"]), async (req, res) => {
    try {
      console.log("🌱 Seeding tenant master data...");
      const user = req.user;
      const companyId = user.companyId;

      if (!companyId) {
        return res.status(400).json({ success: false, error: "Company ID required" });
      }

      // Check if data already exists
      const existingParties = await prisma.party.count({
        where: { companyId }
      });

      if (existingParties > 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Master data already seeded for this company" 
        });
      }

      // Create suppliers
      const supplier1 = await prisma.party.create({
        data: {
          name: "Global Supplies Inc",
          type: "supplier",
          email: "contact@globalsupplies.com",
          phone: "+1-800-123-4567",
          address: "123 Supply Street, New York, NY 10001",
          companyId
        }
      });

      const supplier2 = await prisma.party.create({
        data: {
          name: "Premium Materials Ltd",
          type: "supplier",
          email: "sales@premiummat.com",
          phone: "+44-20-7946-0958",
          address: "456 Material Lane, London, UK",
          companyId
        }
      });

      console.log(`✅ Created 2 suppliers`);

      // Create customers
      const customer1 = await prisma.party.create({
        data: {
          name: "Walk-in Customer",
          type: "customer",
          email: "walkin@example.com",
          phone: "N/A",
          address: "Various Locations",
          companyId
        }
      });

      const customer2 = await prisma.party.create({
        data: {
          name: "Retail Customer",
          type: "customer",
          email: "retail@example.com",
          phone: "+1-800-RETAIL-1",
          address: "789 Retail Plaza, Chicago, IL 60601",
          companyId
        }
      });

      console.log(`✅ Created 2 customers`);

      // Create product categories
      const steelCategory = await prisma.productCategory.create({
        data: {
          name: "Steel Products",
          description: "Various steel items and materials",
          companyId
        }
      });

      const plasticCategory = await prisma.productCategory.create({
        data: {
          name: "Plastic Materials",
          description: "Plastic pellets and compounds",
          companyId
        }
      });

      console.log(`✅ Created 2 product categories`);

      // Create inventory entries
      const inv1 = await prisma.inventory.create({
        data: {
          companyId,
          sku: "PROD-001",
          name: "MS ANGLE 50x50x5 MM",
          category: "Steel Products",
          quantity: 100,
          unitPrice: 150,
          reorderLevel: 20,
          supplier: "Global Supplies Inc"
        }
      });

      const inv2 = await prisma.inventory.create({
        data: {
          companyId,
          sku: "PROD-002",
          name: "Steel Rod 12mm",
          category: "Steel Products",
          quantity: 100,
          unitPrice: 50,
          reorderLevel: 20,
          supplier: "Global Supplies Inc"
        }
      });

      console.log(`✅ Created 2 inventory entries`);

      res.json({
        success: true,
        message: "Master data seeded successfully",
        data: {
          suppliers: 2,
          customers: 2,
          categories: 2,
          inventoryEntries: 2
        }
      });

    } catch (error) {
      console.error("❌ Error seeding data:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to seed database" 
      });
    }
  });

  console.log("✅ Seed Module setup complete!");
};
