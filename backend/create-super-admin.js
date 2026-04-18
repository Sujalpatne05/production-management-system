import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log("🔐 Creating Super Admin User...\n");

    // Check if super admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { username: "superadmin" }
    });

    if (existingAdmin) {
      console.log("✅ Super Admin already exists!");
      console.log(`   Username: superadmin`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      await prisma.$disconnect();
      return;
    }

    // Create super admin user
    const passwordHash = bcrypt.hashSync("superadmin123", 10);
    
    const superAdmin = await prisma.user.create({
      data: {
        name: "Super Administrator",
        username: "superadmin",
        email: "superadmin@iproduction.com",
        passwordHash,
        role: "super_admin",
        status: "active"
      }
    });

    console.log("✅ Super Admin Created Successfully!\n");
    console.log("📋 Login Credentials:");
    console.log("   ================================");
    console.log("   Username: superadmin");
    console.log("   Password: superadmin123");
    console.log("   Email: superadmin@iproduction.com");
    console.log("   Role: super_admin");
    console.log("   ================================\n");
    console.log("🔗 Access Super Admin Dashboard:");
    console.log("   1. Go to http://localhost:8081/login");
    console.log("   2. Click 'Sign In'");
    console.log("   3. Enter username: superadmin");
    console.log("   4. Enter password: superadmin123");
    console.log("   5. Click 'Sign In'");
    console.log("   6. You will be redirected to /super-admin\n");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error creating super admin:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createSuperAdmin();
