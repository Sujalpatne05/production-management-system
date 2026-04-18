/**
 * Reset all users and setup proper company hierarchy
 * Super Admin → Admin → Users
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function resetAndSetup() {
  try {
    console.log("🔄 Starting reset and setup...\n");

    // Step 1: Delete all existing data
    console.log("📋 Step 1: Deleting all existing data...");
    await prisma.user.deleteMany({});
    await prisma.companyAdmin.deleteMany({});
    await prisma.company.deleteMany({});
    console.log("✅ All data deleted\n");

    // Step 2: Create Super Admin User
    console.log("📋 Step 2: Creating Super Admin...");
    const superAdminPassword = await bcrypt.hash("SuperAdmin@123", 10);
    const superAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@example.com",
        username: "superadmin",
        role: "super_admin",
        status: "active",
        passwordHash: superAdminPassword,
      },
    });
    console.log(`✅ Super Admin created: ${superAdmin.email}\n`);

    // Step 3: Create Company
    console.log("📋 Step 3: Creating Company...");
    const company = await prisma.company.create({
      data: {
        name: "Test Company",
        email: "company@example.com",
        phone: "+1234567890",
        address: "123 Business St, City, Country",
        subscriptionPlan: "professional",
        subscriptionStatus: "active",
        maxUsers: 50,
        maxStorage: 5000,
      },
    });
    console.log(`✅ Company created: ${company.name}\n`);

    // Step 4: Create Admin User
    console.log("📋 Step 4: Creating Admin User...");
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await prisma.user.create({
      data: {
        name: "Company Admin",
        email: "admin@example.com",
        username: "admin",
        role: "admin",
        status: "active",
        companyId: company.id,
        passwordHash: adminPassword,
      },
    });
    console.log(`✅ Admin created: ${admin.email}\n`);

    // Step 5: Link Admin to Company
    console.log("📋 Step 5: Linking Admin to Company...");
    await prisma.companyAdmin.create({
      data: {
        companyId: company.id,
        userId: admin.id,
        role: "admin",
        status: "active",
      },
    });
    console.log(`✅ Admin linked to company\n`);

    // Step 6: Create Regular Users
    console.log("📋 Step 6: Creating Regular Users...");
    const businessRoles = [
      "CEO",
      "Finance Manager",
      "Sales Manager",
      "Procurement Manager",
      "Production Manager",
      "Quality Manager",
      "Warehouse Manager",
      "HR Manager",
      "System Administrator",
    ];

    const users = [];
    for (let i = 0; i < businessRoles.length; i++) {
      const role = businessRoles[i];
      const email = `${role.toLowerCase().replace(/\s+/g, "")}@example.com`;
      const password = await bcrypt.hash("User@123456", 10);

      const user = await prisma.user.create({
        data: {
          name: role,
          email: email,
          username: email.split("@")[0],
          role: role,
          status: "active",
          companyId: company.id,
          passwordHash: password,
        },
      });

      users.push(user);
      console.log(`  ✅ Created: ${role} (${email})`);
    }
    console.log();

    // Step 7: Summary
    console.log("📊 Setup Complete!\n");
    console.log("=".repeat(60));
    console.log("SUPER ADMIN");
    console.log("=".repeat(60));
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Password: SuperAdmin@123`);
    console.log(`Role: ${superAdmin.role}\n`);

    console.log("=".repeat(60));
    console.log("COMPANY");
    console.log("=".repeat(60));
    console.log(`Name: ${company.name}`);
    console.log(`Max Users: ${company.maxUsers}`);
    console.log(`Current Users: ${users.length + 1} (1 admin + ${users.length} employees)\n`);

    console.log("=".repeat(60));
    console.log("ADMIN");
    console.log("=".repeat(60));
    console.log(`Email: ${admin.email}`);
    console.log(`Password: Admin@123`);
    console.log(`Role: ${admin.role}`);
    console.log(`Company: ${company.name}\n`);

    console.log("=".repeat(60));
    console.log("USERS (9 Business Roles)");
    console.log("=".repeat(60));
    users.forEach((user) => {
      console.log(`${user.name.padEnd(25)} | ${user.email.padEnd(35)} | Password: User@123456`);
    });
    console.log();

    console.log("=".repeat(60));
    console.log("HIERARCHY");
    console.log("=".repeat(60));
    console.log("Super Admin (superadmin@example.com)");
    console.log("  └── Company: Test Company");
    console.log("      ├── Admin (admin@example.com)");
    console.log("      └── Users (9 business roles)");
    console.log("          ├── CEO");
    console.log("          ├── Finance Manager");
    console.log("          ├── Sales Manager");
    console.log("          ├── Procurement Manager");
    console.log("          ├── Production Manager");
    console.log("          ├── Quality Manager");
    console.log("          ├── Warehouse Manager");
    console.log("          ├── HR Manager");
    console.log("          └── System Administrator");
    console.log();

    console.log("✅ Setup complete! Ready to use.\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSetup();
