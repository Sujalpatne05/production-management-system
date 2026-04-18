import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function fixPassword() {
  try {
    console.log("🔐 Fixing super admin password...\n");

    const newPassword = "superadmin123";
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    const user = await prisma.user.update({
      where: { username: "superadmin" },
      data: {
        password: newPassword,
        passwordHash: passwordHash
      }
    });

    console.log("✅ Password updated successfully!");
    console.log("\n📋 Updated User:");
    console.log("   Username:", user.username);
    console.log("   Email:", user.email);
    console.log("   Role:", user.role);
    console.log("   Password: superadmin123");
    console.log("   PasswordHash: Set");

    // Verify
    console.log("\n🧪 Verifying password...");
    const isValid = bcrypt.compareSync(newPassword, passwordHash);
    console.log("   Password hash match:", isValid ? "✅ YES" : "❌ NO");

    console.log("\n✅ You can now login with:");
    console.log("   Username: superadmin");
    console.log("   Password: superadmin123");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixPassword();
