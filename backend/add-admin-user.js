import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function addAdminUser() {
  try {
    console.log("🔐 Adding New Admin User...\n");

    // Get the first company
    const company = await prisma.company.findFirst({
      where: { deletedAt: null }
    });

    if (!company) {
      console.log("❌ No companies found. Please create a company first.");
      await prisma.$disconnect();
      return;
    }

    // Admin credentials
    const adminUsername = "admin";
    const adminEmail = "admin@example.com";
    const adminPassword = "password";

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { username: adminUsername },
          { email: adminEmail }
        ]
      }
    });

    if (existingUser) {
      console.log("⚠️  User already exists!");
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}\n`);
      await prisma.$disconnect();
      return;
    }

    // Create password hash
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Company Administrator",
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

    console.log("✅ Admin User Created Successfully!\n");
    console.log("📋 LOGIN CREDENTIALS:");
    console.log("   ================================");
    console.log(`   Company: ${company.name}`);
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: admin`);
    console.log("   ================================\n");

    console.log("🔗 HOW TO LOGIN:");
    console.log("   1. Go to http://localhost:8081/login");
    console.log("   2. Click 'Sign In'");
    console.log(`   3. Enter username: ${adminUsername}`);
    console.log(`   4. Enter password: ${adminPassword}`);
    console.log("   5. Click 'Sign In'");
    console.log("   6. You will be redirected to /dashboard");
    console.log("   7. Navigate to /dashboard/admin/users to manage users\n");

    console.log("📊 ADMIN PANEL FEATURES:");
    console.log("   • View all users in your company");
    console.log("   • Add new users with role assignment");
    console.log("   • Edit user information and roles");
    console.log("   • Delete users from the company");
    console.log("   • View user count and available slots");
    console.log("   • Assign from 9 available roles\n");

    console.log("✨ Ready to use!\n");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error adding admin user:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

addAdminUser();
