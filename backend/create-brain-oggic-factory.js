import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createBrainOggicFactory() {
  try {
    console.log("🏭 Creating 'Brain Oggic ABC' factory for Zeptac...\n");

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

    console.log(`✅ Found Zeptac Company: ${zeptacCompany.id}\n`);

    // Create the factory
    const factory = await prisma.factory.create({
      data: {
        name: "Brain Oggic ABC",
        type: "Branch Office",
        location: "Mumbai",
        manager: "Sujal Patne",
        employees: 15,
        productionLines: 5,
        storageCapacity: 500,
        storageUsed: 0,
        efficiency: 60,
        status: "active",
        companyId: zeptacCompany.id
      }
    });

    console.log("✅ Factory created successfully!");
    console.log(`   Name: ${factory.name}`);
    console.log(`   ID: ${factory.id}`);
    console.log(`   Type: ${factory.type}`);
    console.log(`   Location: ${factory.location}`);
    console.log(`   Manager: ${factory.manager}`);
    console.log(`   Employees: ${factory.employees}`);
    console.log(`   Production Lines: ${factory.productionLines}`);
    console.log(`   Storage Capacity: ${factory.storageCapacity}`);
    console.log(`   Efficiency: ${factory.efficiency}%`);
    console.log(`   Created: ${factory.createdAt}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createBrainOggicFactory();
