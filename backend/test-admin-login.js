import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    console.log('🔍 Checking users in database...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        password: true
      }
    });

    console.log('📋 Users found:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) | Username: ${user.username} | Role: ${user.role} | Status: ${user.status}`);
      if (user.password) {
        console.log(`    Password: ${user.password}`);
      }
    });

    console.log('\n🔐 Testing admin login...');
    
    // Try to find admin user
    const adminUser = users.find(u => u.username === 'admin' || u.email === 'admin@example.com');
    
    if (adminUser) {
      console.log(`✅ Admin user found: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Password: ${adminUser.password}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Status: ${adminUser.status}`);
    } else {
      console.log('❌ Admin user NOT found');
      console.log('\n📝 Available users:');
      users.forEach(u => console.log(`   - ${u.username} (${u.email})`));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
