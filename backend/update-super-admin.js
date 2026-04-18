import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function updateSuperAdmin() {
  try {
    console.log("🔐 Updating Super Admin Credentials...\n");

    // Find existing super admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "super_admin" }
    });

    if (!existingAdmin) {
      console.log("❌ No super admin user found!");
      await prisma.$disconnect();
      return;
    }

    // Hash the new password
    const passwordHash = bcrypt.hashSync("Super@123", 10);
    
    // Update super admin user
    const updatedAdmin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: "superadmin@example.com",
        passwordHash,
        username: "superadmin"
      }
    });

    console.log("✅ Super Admin Credentials Updated Successfully!\n");
    console.log("📋 New Login Credentials:");
    console.log("   ================================");
    console.log("   Username: superadmin");
    console.log("   Email: superadmin@example.com");
    console.log("   Password: Super@123");
    console.log("   Role: super_admin");
    console.log("   ================================\n");
    console.log("🔗 Access Super Admin Dashboard:");
    console.log("   1. Go to http://localhost:8081/login");
    console.log("   2. Enter email: superadmin@example.com");
    console.log("   3. Enter password: Super@123");
    console.log("   4. Click 'Sign In'");
    console.log("   5. You will be redirected to /super-admin\n");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error updating super admin:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateSuperAdmin();
