const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserPermissions() {
  try {
    const userRole = await prisma.role.findUnique({
      where: { name: 'User' },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    console.log('\n========== USER ROLE PERMISSIONS ==========\n');
    
    if (userRole) {
      console.log(`Role: ${userRole.name}`);
      console.log(`\nPermissions (${userRole.permissions.length}):\n`);
      
      userRole.permissions.forEach((rp, idx) => {
        console.log(`${idx + 1}. ${rp.permission.code} - ${rp.permission.description}`);
      });
    } else {
      console.log('User role not found!');
    }

    console.log('\n==========================================\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserPermissions();
