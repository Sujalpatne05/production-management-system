import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkZeptacFactories() {
  try {
    console.log("🔍 Checking Zeptac company and factories...\n");

    // Find Zeptac company
    const zeptacCompany = await prisma.company.findFirst({
      where: {
        name: {
          contains: "Zeptac",
          mode: "insensitive"
        }
      }
    });

    if (!zeptacCompany) {
      console.log("❌ Zeptac company not found");
      return;
    }

    console.log("✅ Found Zeptac Company:");
    console.log(`   ID: ${zeptacCompany.id}`);
    console.log(`   Name: ${zeptacCompany.name}`);
    console.log(`   Email: ${zeptacCompany.email}\n`);

    // Get all factories for Zeptac
    const factories = await prisma.factory.findMany({
      where: {
        companyId: zeptacCompany.id
      },
      orderBy: { createdAt: "desc" }
    });

    console.log(`📦 Found ${factories.length} factories for Zeptac:\n`);
    
    factories.forEach((factory, index) => {
      console.log(`${index + 1}. ${factory.name}`);
      console.log(`   Type: ${factory.type}`);
      console.log(`   Location: ${factory.location}`);
      console.log(`   Manager: ${factory.manager}`);
      console.log(`   Employees: ${factory.employees}`);
      console.log(`   Production Lines: ${factory.productionLines}`);
      console.log(`   Storage Capacity: ${factory.storageCapacity}`);
      console.log(`   Storage Used: ${factory.storageUsed}`);
      console.log(`   Efficiency: ${factory.efficiency}%`);
      console.log(`   Status: ${factory.status}`);
      console.log(`   Created: ${factory.createdAt}`);
      console.log();
    });

    // Check specifically for "Brain Oggic ABC"
    const brainOggic = factories.find(f => f.name.toLowerCase().includes("brain"));
    if (brainOggic) {
      console.log("✅ 'Brain Oggic ABC' factory FOUND!");
      console.log(`   Full Name: ${brainOggic.name}`);
      console.log(`   ID: ${brainOggic.id}`);
    } else {
      console.log("❌ 'Brain Oggic ABC' factory NOT FOUND");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkZeptacFactories();
