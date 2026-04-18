import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlans() {
  try {
    const plans = [
      { name: 'starter', description: 'Starter Plan', price: 99, billingCycle: 'monthly', maxUsers: 10, maxStorage: 1000, features: ['basic'] },
      { name: 'professional', description: 'Professional Plan', price: 299, billingCycle: 'monthly', maxUsers: 50, maxStorage: 5000, features: ['advanced'] },
      { name: 'enterprise', description: 'Enterprise Plan', price: 999, billingCycle: 'monthly', maxUsers: 500, maxStorage: 50000, features: ['premium'] }
    ];

    for (const plan of plans) {
      const existing = await prisma.subscriptionPlan.findUnique({ where: { name: plan.name } });
      if (!existing) {
        await prisma.subscriptionPlan.create({ data: plan });
        console.log('✅ Created plan:', plan.name);
      } else {
        console.log('⏭️  Plan already exists:', plan.name);
      }
    }
    console.log('✅ Subscription plans seeded');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedPlans();
