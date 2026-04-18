import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAndFix() {
  try {
    console.log("🔍 Checking database...\n");

    // Check all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, username: true, name: true, role: true },
    });

    console.log("📋 Current users in database:");
    if (allUsers.length > 0) {
      allUsers.forEach((user) => {
        console.log(`  - ${user.email} (${user.username}) - ${user.role}`);
      });
    } else {
      console.log("  No users found");
    }

    console.log("\n🔄 Clearing all users...");
    const deleted = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} users\n`);

    console.log("🌱 Reseeding default users...");
    const created = await prisma.user.createMany({
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
    console.log(`✅ Created ${created.count} default users\n`);

    console.log("📋 New users in database:");
    const newUsers = await prisma.user.findMany({
      select: { id: true, email: true, username: true, name: true, role: true },
    });
    newUsers.forEach((user) => {
      console.log(`  - ${user.email} (${user.username}) - ${user.role}`);
    });

    console.log("\n✅ Database fixed and ready for testing!");
    console.log("\n📝 Default credentials:");
    console.log("  - Username: admin, Password: password");
    console.log("  - Username: superadmin, Password: password");
    console.log("  - Username: user, Password: password");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFix();
