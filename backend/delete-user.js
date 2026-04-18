import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    console.log("🔄 Deleting user with email: sujalpatne583@gmail.com");

    // Delete user by email
    const deletedUser = await prisma.user.deleteMany({
      where: {
        email: "sujalpatne583@gmail.com",
      },
    });

    if (deletedUser.count > 0) {
      console.log(`✅ Deleted ${deletedUser.count} user(s) with email: sujalpatne583@gmail.com`);
    } else {
      console.log("ℹ️  No user found with email: sujalpatne583@gmail.com");
    }

    console.log("\n📝 Remaining users in database:");
    const remainingUsers = await prisma.user.findMany({
      select: { id: true, email: true, username: true, name: true, role: true },
    });
    
    if (remainingUsers.length > 0) {
      remainingUsers.forEach((user) => {
        console.log(`  - ${user.email} (${user.username}) - ${user.role}`);
      });
    } else {
      console.log("  No users in database");
    }

    console.log("\n✅ Done!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
