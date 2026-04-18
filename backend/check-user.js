import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if sujal user exists
    const sujalUser = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: "sujal", mode: "insensitive" } },
          { name: { contains: "sujal", mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
        createdAt: true
      }
    });

    console.log("Sujal user(s):", JSON.stringify(sujalUser, null, 2));

    // Check total users
    const totalUsers = await prisma.user.count();
    console.log("Total users in database:", totalUsers);

    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 15
    });

    console.log("Last 15 users:", JSON.stringify(allUsers, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
