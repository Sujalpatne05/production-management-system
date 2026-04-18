import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("🔄 Resetting database...");

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✓ Deleted ${deletedUsers.count} users`);

    // Reseed default users
    const createdUsers = await prisma.user.createMany({
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
    });
    console.log(`✓ Created ${createdUsers.count} default users`);

    console.log("✅ Database reset completed!");
    console.log("\n📝 Default credentials:");
    console.log("  - Username: admin, Password: password");
    console.log("  - Username: superadmin, Password: password");
    console.log("  - Username: user, Password: password");
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
