const { PrismaClient } = require('./node_modules/.prisma/client');

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      invoiceNo: true,
      total: true,
      saleDate: true,
      status: true,
      createdAt: true,
    },
  });

  console.log(JSON.stringify(rows, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });