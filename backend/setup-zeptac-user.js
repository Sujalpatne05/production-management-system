import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupZeptacUser() {
  try {
    console.log('🔧 Setting up Zeptac user with company...\n');

    // Create or get Zeptac company
    let company = await prisma.company.findFirst({
      where: { name: 'Zeptac Technologies' }
    });

    if (!company) {
      console.log('📦 Creating Zeptac Technologies company...');
      company = await prisma.company.create({
        data: {
          name: 'Zeptac Technologies',
          email: 'admin@zeptac.com',
          phone: '+91-9876543210',
          address: 'Panvel, Raigad, Maharashtra',
          website: 'https://zeptac.com',
          subscriptionPlan: 'professional',
          subscriptionStatus: 'active',
          maxUsers: 100,
          maxStorage: 10000
        }
      });
      console.log('✅ Zeptac Technologies company created:', company.id);
    } else {
      console.log('✅ Using existing Zeptac Technologies company:', company.id);
    }

    // Update or create the Sujal user
    let user = await prisma.user.findUnique({
      where: { email: 'sujalpatne583@gmail.com' }
    }).catch(() => null);

    if (!user) {
      console.log('📝 Creating Sujal user...');
      const password = 'Sujal@123';
      const passwordHash = await bcrypt.hash(password, 10);
      
      user = await prisma.user.create({
        data: {
          name: 'Sujal Patne',
          email: 'sujalpatne583@gmail.com',
          username: 'sujal',
          password: password,
          passwordHash: passwordHash,
          role: 'admin',
          status: 'active',
          companyId: company.id
        }
      });
      console.log('✅ Sujal user created with companyId:', company.id);
    } else {
      console.log('📝 Updating existing Sujal user...');
      user = await prisma.user.update({
        where: { email: 'sujalpatne583@gmail.com' },
        data: {
          companyId: company.id,
          role: 'admin',
          status: 'active'
        }
      });
      console.log('✅ Sujal user updated with companyId:', company.id);
    }

    // Create CompanyAdmin relationship
    let companyAdmin = await prisma.companyAdmin.findFirst({
      where: { userId: user.id, companyId: company.id }
    }).catch(() => null);

    if (!companyAdmin) {
      companyAdmin = await prisma.companyAdmin.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'admin',
          status: 'active'
        }
      });
      console.log('✅ CompanyAdmin relationship created');
    } else {
      console.log('✅ CompanyAdmin relationship already exists');
    }

    console.log('\n📋 LOGIN CREDENTIALS:\n');
    console.log('=== ZEPTAC ADMIN ===');
    console.log('Email: sujalpatne583@gmail.com');
    console.log('Password: Sujal@123');
    console.log('Company: Zeptac Technologies');
    console.log('Company ID:', company.id);
    console.log('\n✅ Setup complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

setupZeptacUser();
