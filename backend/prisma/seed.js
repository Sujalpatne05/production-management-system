import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Users
  const users = await prisma.user.createMany({
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
    skipDuplicates: true,
  });
  console.log(`✓ Created ${users.count} users`);

  // Seed Product Categories
  const categories = await prisma.productCategory.createMany({
    data: [
      { name: "Electronics", description: "Electronic products" },
      { name: "Furniture", description: "Furniture items" },
      { name: "Clothing", description: "Apparel and clothing" },
      { name: "Food", description: "Food and beverages" },
    ],
    skipDuplicates: true,
  });
  console.log(`✓ Created ${categories.count} product categories`);

  // Seed Units
  const units = await prisma.unit.createMany({
    data: [
      { name: "Piece", symbol: "pc" },
      { name: "Kilogram", symbol: "kg" },
      { name: "Liter", symbol: "L" },
      { name: "Meter", symbol: "m" },
      { name: "Box", symbol: "box" },
    ],
    skipDuplicates: true,
  });
  console.log(`✓ Created ${units.count} units`);

  // Seed Parties (Customers & Suppliers)
  const parties = await prisma.party.createMany({
    data: [
      { name: "ABC Corporation", type: "customer", phone: "555-0001", email: "abc@example.com" },
      { name: "XYZ Industries", type: "supplier", phone: "555-0002", email: "xyz@example.com" },
      { name: "Global Traders", type: "customer", phone: "555-0003", email: "global@example.com" },
      { name: "Local Suppliers", type: "supplier", phone: "555-0004", email: "local@example.com" },
    ],
    skipDuplicates: true,
  });
  console.log(`✓ Created ${parties.count} parties`);

  // Seed Outlets
  const outlets = await prisma.outlet.createMany({
    data: [
      { name: "Main Office", phone: "555-1000", email: "main@example.com", address: "123 Main St" },
      { name: "Branch Office", phone: "555-2000", email: "branch@example.com", address: "456 Branch Ave" },
    ],
    skipDuplicates: true,
  });
  console.log(`✓ Created ${outlets.count} outlets`);

  // Seed Accounts
  const accounts = await prisma.account.createMany({
    data: [
      { accountName: "Cash", accountCode: "1000", accountType: "Asset" },
      { accountName: "Bank", accountCode: "1010", accountType: "Asset" },
      { accountName: "Accounts Receivable", accountCode: "1200", accountType: "Asset" },
      { accountName: "Accounts Payable", accountCode: "2100", accountType: "Liability" },
      { accountName: "Sales Revenue", accountCode: "4000", accountType: "Revenue" },
      { accountName: "Cost of Goods Sold", accountCode: "5000", accountType: "Expense" },
    ],
    skipDuplicates: true,
  });
  console.log(`✓ Created ${accounts.count} accounts`);

  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
