const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setDemoPasswords() {
  try {
    const password = await bcrypt.hash('Demo@123', 10);

    const demoUsers = [
      { email: 'superadmin@system.com', name: 'Superadmin' },
      { email: 'admin@demo.com', name: 'Admin' },
      { email: 'user@demo.com', name: 'Regular User' }
    ];

    console.log('\n========== SETTING DEMO USER PASSWORDS ==========\n');
    
    for (const demoUser of demoUsers) {
      await prisma.user.update({
        where: { email: demoUser.email },
        data: { password }
      });
      console.log(`✅ Password set for ${demoUser.name} (${demoUser.email})`);
    }

    console.log('\n================================================\n');
    console.log('Default password for all demo users: Demo@123');
    console.log('\nYou can now login with:');
    console.log('• superadmin@system.com / Demo@123');
    console.log('• admin@demo.com / Demo@123');
    console.log('• user@demo.com / Demo@123');
    console.log('\n================================================\n');

  } catch (error) {
    console.error('Error setting passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setDemoPasswords();
