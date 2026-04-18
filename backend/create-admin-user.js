import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin users...\n');

    // Check if company exists
    let company = await prisma.company.findFirst();
    
    if (!company) {
      console.log('📦 Creating test company...');
      company = await prisma.company.create({
        data: {
          name: 'Test Company A',
          email: 'company-a@example.com',
          phone: '+1234567890',
          address: '123 Business St',
          website: 'https://company-a.com',
          subscriptionPlan: 'professional',
          subscriptionStatus: 'active',
          maxUsers: 50,
          maxStorage: 5000
        }
      });
      console.log('✅ Company created:', company.name);
    } else {
      console.log('✅ Using existing company:', company.name);
    }

    // Create admin user
    const adminPassword = 'Admin@123456';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    }).catch(() => null);

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          username: 'admin',
          password: adminPassword,
          passwordHash: adminPasswordHash,
          role: 'admin',
          status: 'active',
          companyId: company.id
        }
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create CompanyAdmin relationship
    let companyAdmin = await prisma.companyAdmin.findFirst({
      where: { userId: adminUser.id, companyId: company.id }
    }).catch(() => null);

    if (!companyAdmin) {
      companyAdmin = await prisma.companyAdmin.create({
        data: {
          userId: adminUser.id,
          companyId: company.id,
          role: 'admin',
          status: 'active'
        }
      });
      console.log('✅ CompanyAdmin relationship created');
    } else {
      console.log('✅ CompanyAdmin relationship already exists');
    }

    // Create regular users for testing
    const regularUsers = [
      { name: 'John Sales', email: 'john@example.com', role: 'Sales Manager' },
      { name: 'Jane Finance', email: 'jane@example.com', role: 'Finance Manager' },
      { name: 'Bob Production', email: 'bob@example.com', role: 'Production Manager' }
    ];

    for (const userData of regularUsers) {
      let user = await prisma.user.findUnique({
        where: { email: userData.email }
      }).catch(() => null);

      if (!user) {
        const userPassword = 'User@123456';
        const userPasswordHash = await bcrypt.hash(userPassword, 10);
        user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            username: userData.email.split('@')[0],
            password: userPassword,
            passwordHash: userPasswordHash,
            role: userData.role,
            status: 'active',
            companyId: company.id
          }
        });
        console.log(`✅ User created: ${userData.name}`);
      }
    }

    console.log('\n📋 LOGIN CREDENTIALS:\n');
    console.log('=== ADMIN PANEL ===');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123456');
    console.log('Company: Test Company A');
    console.log('\n=== TEST USERS ===');
    console.log('Email: john@example.com | Password: User@123456 | Role: Sales Manager');
    console.log('Email: jane@example.com | Password: User@123456 | Role: Finance Manager');
    console.log('Email: bob@example.com | Password: User@123456 | Role: Production Manager');
    console.log('\n✅ All users created successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
