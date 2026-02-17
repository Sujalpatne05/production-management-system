const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' }
    });
    console.log(JSON.stringify(suppliers, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
