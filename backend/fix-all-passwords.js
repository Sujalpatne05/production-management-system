import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        username: true,
        role: true
      }
    });

    console.log(`Found ${allUsers.length} users`);

    let updated = 0;
    let skipped = 0;

    for (const user of allUsers) {
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'))) {
        console.log(`✓ ${user.email} - already hashed`);
        skipped++;
        continue;
      }

      // If password is temp-password or plain text, hash it
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const username = user.username || user.email.split('@')[0];

        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            username: username
          }
        });

        console.log(`✓ ${user.email} - password hashed (was: ${user.password.substring(0, 20)}...)`);
        updated++;
      } else {
        console.log(`⚠ ${user.email} - no password found`);
        skipped++;
      }
    }

    console.log(`\n✅ Summary:`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${allUsers.length}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
