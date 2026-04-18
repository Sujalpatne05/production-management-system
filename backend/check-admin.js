import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check company admins
    const admins = await prisma.companyAdmin.findMany({
      include: {
        user: true,
        company: true
      }
    });

    console.log("Company Admins:", JSON.stringify(admins, null, 2));

    // Check the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
      include: {
        companyAdmin: true
      }
    });

    console.log("Admin User with companyAdmin:", JSON.stringify(adminUser, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
