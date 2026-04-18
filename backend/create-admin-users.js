import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function createAdminUsers() {
  try {
    console.log("🔐 Creating Admin Users for Companies...\n");

    // Get all companies
    const companies = await prisma.company.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true }
    });

    if (companies.length === 0) {
      console.log("❌ No companies found. Please create companies first.");
      await prisma.$disconnect();
      return;
    }

    console.log(`📦 Found ${companies.length} company(ies)\n`);

    const adminCredentials = [];

    for (const company of companies) {
      // Check if admin already exists for this company
      const existingAdmin = await prisma.companyAdmin.findFirst({
        where: { companyId: company.id },
        include: { user: true }
      });

      if (existingAdmin) {
        console.log(`✅ Admin already exists for "${company.name}"`);
        console.log(`   Username: ${existingAdmin.user.username}`);
        console.log(`   Email: ${existingAdmin.user.email}\n`);
        adminCredentials.push({
          company: company.name,
          username: existingAdmin.user.username,
          email: existingAdmin.user.email,
          password: "N/A (existing user)"
        });
        continue;
      }

      // Create admin user for this company
      const adminUsername = `admin_${company.name.toLowerCase().replace(/\s+/g, "_")}`;
      const adminEmail = `admin@${company.name.toLowerCase().replace(/\s+/g, "")}.com`;
      const adminPassword = "admin123";
      const passwordHash = bcrypt.hashSync(adminPassword, 10);

      // Create user
      const adminUser = await prisma.user.create({
        data: {
          name: `${company.name} Administrator`,
          username: adminUsername,
          email: adminEmail,
          passwordHash,
          role: "admin",
          status: "active",
          companyId: company.id
        }
      });

      // Create company admin relationship
      await prisma.companyAdmin.create({
        data: {
          companyId: company.id,
          userId: adminUser.id,
          role: "admin",
          status: "active"
        }
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: adminUser.id,
          companyId: company.id,
          action: "create",
          resourceType: "admin",
          resourceId: adminUser.id,
          status: "success"
        }
      });

      console.log(`✅ Admin Created for "${company.name}"`);
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}\n`);

      adminCredentials.push({
        company: company.name,
        username: adminUsername,
        email: adminEmail,
        password: adminPassword
      });
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 ADMIN LOGIN CREDENTIALS SUMMARY");
    console.log("=".repeat(60) + "\n");

    adminCredentials.forEach((cred, index) => {
      console.log(`${index + 1}. ${cred.company}`);
      console.log(`   Username: ${cred.username}`);
      console.log(`   Email: ${cred.email}`);
      console.log(`   Password: ${cred.password}`);
      console.log("");
    });

    console.log("=".repeat(60));
    console.log("🔗 HOW TO LOGIN AS ADMIN");
    console.log("=".repeat(60) + "\n");
    console.log("1. Go to http://localhost:8081/login");
    console.log("2. Click 'Sign In'");
    console.log("3. Enter username (from above)");
    console.log("4. Enter password (from above)");
    console.log("5. Click 'Sign In'");
    console.log("6. You will be redirected to /dashboard");
    console.log("7. Navigate to /dashboard/admin/users to manage users\n");

    console.log("=".repeat(60));
    console.log("✨ Admin users created successfully!");
    console.log("=".repeat(60) + "\n");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error creating admin users:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdminUsers();
