import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DemoSeedService implements OnModuleInit {
  private readonly logger = new Logger(DemoSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      // Check if database is already seeded
      const existingTenant = await this.prisma.tenant.findFirst({
        where: { id: 'demo-tenant-id' },
      });

      // If tenant exists and has products/orders/sales, skip seeding
      if (existingTenant) {
        const productCount = await this.prisma.product.count({ where: { tenantId: 'demo-tenant-id' } });
        if (productCount > 0) {
          this.logger.log('✅ Demo data already seeded, skipping.');
          return;
        }
      }
    } catch {
      // DB not ready yet, continue to seed
    }

    const enabled = this.config.get<string>('SEED_DEMO');
    const shouldSeed = !enabled || ['1', 'true', 'yes', 'on', 'undefined'].includes(enabled?.toLowerCase() ?? 'true');
    
    if (!shouldSeed) {
      return;
    }

    const tenantId = this.config.get<string>('DEMO_TENANT_ID') ?? 'demo-tenant-id';
    const tenantName = this.config.get<string>('DEMO_TENANT_NAME') ?? 'Demo Company';
    const adminEmail = this.config.get<string>('DEMO_ADMIN_EMAIL') ?? 'admin@demo.com';
    const adminName = this.config.get<string>('DEMO_ADMIN_NAME') ?? 'Admin User';

    this.logger.log('🌱 Seeding demo data...');

    try {
      const tenant = await this.prisma.tenant.upsert({
        where: { id: tenantId },
        update: {},
        create: {
          id: tenantId,
          name: tenantName,
          plan: 'enterprise',
          status: 'active',
        },
      });

      const role = await this.prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin' },
      });

      const user = await this.prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          email: adminEmail,
          fullName: adminName,
          status: 'active',
        },
      });

      await this.prisma.userRole.upsert({
        where: {
          userId_tenantId_roleId: {
            userId: user.id,
            tenantId: tenant.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          tenantId: tenant.id,
          roleId: role.id,
        },
      });

      this.logger.log('✅ Demo tenant/user created');

      // Seed demo products
      const products = [
        { name: 'Laptop Pro', tenantId, price: 1500, quantity: 10 },
        { name: 'Desktop Computer', tenantId, price: 1200, quantity: 15 },
        { name: 'Monitor 27"', tenantId, price: 300, quantity: 25 },
        { name: 'Keyboard Mechanical', tenantId, price: 120, quantity: 40 },
        { name: 'Mouse Wireless', tenantId, price: 50, quantity: 60 },
      ];

      for (const prod of products) {
        await this.prisma.product.upsert({
          where: { name_tenantId: { name: prod.name, tenantId: prod.tenantId } },
          update: {},
          create: { ...prod, id: uuidv4() },
        });
      }
      this.logger.log('✅ Demo products created');

      // Seed demo orders
      const orders = [
        { orderNo: 'ORD-001', tenantId, status: 'draft', total: 5000 },
        { orderNo: 'ORD-002', tenantId, status: 'confirmed', total: 3500 },
        { orderNo: 'ORD-003', tenantId, status: 'completed', total: 2500 },
      ];

      for (const ord of orders) {
        await this.prisma.order.upsert({
          where: { orderNo_tenantId: { orderNo: ord.orderNo, tenantId: ord.tenantId } },
          update: {},
          create: { ...ord, id: uuidv4() },
        });
      }
      this.logger.log('✅ Demo orders created');

      // Seed demo sales
      const sales = [
        { status: 'draft', totalAmount: 4500, tenantId },
        { status: 'confirmed', totalAmount: 3200, tenantId },
        { status: 'completed', totalAmount: 6800, tenantId },
      ];

      for (let i = 0; i < sales.length; i++) {
        const sale = sales[i];
        await this.prisma.sale.upsert({
          where: { id: `sale-${i + 1}` },
          update: {},
          create: { ...sale, id: `sale-${i + 1}` },
        });
      }
      this.logger.log('✅ Demo sales created');

      this.logger.log('✅ Demo data seed complete!');
    } catch (error) {
      this.logger.error('Demo seed failed:', error.message);
    }
  }
}
