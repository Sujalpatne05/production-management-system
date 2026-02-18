const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        otp: true,
        otpExpiry: true,
        roles: {
          include: {
            role: true,
            tenant: true
          }
        }
      }
    });

    console.log('\n========== USERS IN DATABASE ==========\n');
    console.log(`Total users found: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName || 'No Name'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   OTP: ${user.otp || 'None'}`);
      console.log(`   OTP Expiry: ${user.otpExpiry || 'None'}`);
      console.log(`   Roles: ${user.roles.length > 0 ? user.roles.map(r => r.role.name).join(', ') : 'No roles assigned'}`);
      console.log('');
    });

    console.log('========================================\n');
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
