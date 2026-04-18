import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixFactoriesCompany() {
  try {
    console.log('🔧 Fixing factories company assignment...\n');

    // Get Zeptac company
    const company = await prisma.company.findFirst({
      where: { name: 'Zeptac Technologies' }
    });

    if (!company) {
      console.log('❌ Zeptac Technologies company not found');
      return;
    }

    console.log('✅ Found Zeptac Technologies company:', company.id);

    // Get all factories
    const allFactoriesInDb = await prisma.factory.findMany();
    console.log(`📦 Total factories in database: ${allFactoriesInDb.length}`);

    // Get factories already assigned to Zeptac
    const zeptacFactories = await prisma.factory.findMany({
      where: { companyId: company.id }
    });
    console.log(`✅ Factories already assigned to Zeptac: ${zeptacFactories.length}`);

    // Get factories without company
    const orphanFactories = allFactoriesInDb.filter(f => !f.companyId);
    console.log(`📦 Factories without company: ${orphanFactories.length}`);

    if (orphanFactories.length > 0) {
      // Update all orphan factories to belong to Zeptac
      for (const factory of orphanFactories) {
        await prisma.factory.update({
          where: { id: factory.id },
          data: { companyId: company.id }
        });
      }
      console.log(`✅ Updated ${orphanFactories.length} factories with Zeptac company ID`);
    }

    // Show all factories for Zeptac
    const allFactories = await prisma.factory.findMany({
      where: { companyId: company.id }
    });

    console.log(`\n📋 All factories for Zeptac Technologies:\n`);
    allFactories.forEach((factory, index) => {
      console.log(`${index + 1}. ${factory.name} (${factory.type})`);
      console.log(`   Location: ${factory.location}`);
      console.log(`   Manager: ${factory.manager}`);
      console.log(`   Employees: ${factory.employees}`);
      console.log(`   Production Lines: ${factory.productionLines}`);
      console.log(`   Storage: ${factory.storageCapacity} units`);
      console.log(`   Efficiency: ${factory.efficiency}%\n`);
    });

    console.log(`✅ Total factories: ${allFactories.length}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFactoriesCompany();
