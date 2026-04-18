import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFactories() {
  try {
    console.log('🏭 Checking all factories in database...\n');

    const factories = await prisma.factory.findMany();
    console.log(`Total factories: ${factories.length}\n`);

    factories.forEach((f, index) => {
      console.log(`${index + 1}. ${f.name} (${f.type})`);
      console.log(`   ID: ${f.id}`);
      console.log(`   Company ID: ${f.companyId}`);
      console.log(`   Location: ${f.location}`);
      console.log(`   Manager: ${f.manager}`);
      console.log(`   Created: ${f.createdAt}\n`);
    });

    // Check by company
    console.log('\n🏢 Factories by company:\n');
    const companies = await prisma.company.findMany();
    for (const company of companies) {
      const companyFactories = await prisma.factory.findMany({
        where: { companyId: company.id }
      });
      console.log(`${company.name} (${company.id}): ${companyFactories.length} factories`);
      companyFactories.forEach(f => {
        console.log(`  - ${f.name} (${f.type})`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkFactories();
