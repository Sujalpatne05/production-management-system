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

      // Create product category first
      const category = await this.prisma.productCategory.upsert({
        where: { name_tenantId: { name: 'Electronics', tenantId } },
        update: {},
        create: {
          id: uuidv4(),
          name: 'Electronics',
          tenantId,
          description: 'Electronic products',
        },
      });

      // Seed demo products
      const productIds: string[] = [];
      const products = [
        { name: 'Laptop Pro', sku: 'LAP-001', cost: '1200', sellingPrice: '1500' },
        { name: 'Desktop Computer', sku: 'DSK-001', cost: '1000', sellingPrice: '1200' },
        { name: 'Monitor 27"', sku: 'MON-001', cost: '250', sellingPrice: '300' },
        { name: 'Keyboard Mechanical', sku: 'KEY-001', cost: '100', sellingPrice: '120' },
        { name: 'Mouse Wireless', sku: 'MOU-001', cost: '40', sellingPrice: '50' },
      ];

      for (const prod of products) {
        const created = await this.prisma.product.create({
          data: {
            id: uuidv4(),
            name: prod.name,
            tenantId,
            categoryId: category.id,
            sku: prod.sku,
            description: `${prod.name} - Demo product`,
            unitOfMeasure: 'pcs',
            cost: prod.cost,
            sellingPrice: prod.sellingPrice,
            status: 'active',
          },
        }).catch(() => null);
        if (created) productIds.push(created.id);
      }
      this.logger.log(`✅ Demo products created (${productIds.length})`);

      // Seed demo orders
      const orders = [
        { tenantId, status: 'draft', total: '5000' },
        { tenantId, status: 'confirmed', total: '3500' },
        { tenantId, status: 'completed', total: '2500' },
      ];

      for (const ord of orders) {
        await this.prisma.order.create({
          data: {
            id: uuidv4(),
            tenantId: ord.tenantId,
            status: ord.status,
            total: ord.total,
            notes: 'Demo order',
          },
        }).catch(() => null);
      }
      this.logger.log('✅ Demo orders created (3)');

      // Seed demo customers
      const customerIds: string[] = [];
      const customers = [
        { name: 'ABC Corp', email: 'contact@abccorp.com', tenantId },
        { name: 'XYZ Ltd', email: 'contact@xyzltd.com', tenantId },
      ];

      for (const cust of customers) {
        const created = await this.prisma.customer.create({
          data: {
            id: uuidv4(),
            name: cust.name,
            email: cust.email,
            tenantId: cust.tenantId,
            status: 'active',
          },
        }).catch(() => null);
        if (created) customerIds.push(created.id);
      }
      this.logger.log(`✅ Demo customers created (${customerIds.length})`);

      // Seed demo sales
      if (customerIds.length > 0) {
        const sales = [
          { invoiceNo: 'INV-001', status: 'draft', subtotal: '4000', taxAmount: '500', total: '4500', customerId: customerIds[0], tenantId },
          { invoiceNo: 'INV-002', status: 'confirmed', subtotal: '3000', taxAmount: '200', total: '3200', customerId: customerIds[1], tenantId },
          { invoiceNo: 'INV-003', status: 'completed', subtotal: '6000', taxAmount: '800', total: '6800', customerId: customerIds[0], tenantId },
        ];

        for (const sale of sales) {
          await this.prisma.sale.create({
            data: {
              id: uuidv4(),
              invoiceNo: sale.invoiceNo,
              tenantId: sale.tenantId,
              customerId: sale.customerId,
              status: sale.status,
              subtotal: sale.subtotal,
              taxAmount: sale.taxAmount,
              total: sale.total,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          }).catch(() => null);
        }
        this.logger.log('✅ Demo sales created (3)');
      }

      this.logger.log('✅ Demo data seed complete!');
    } catch (error) {
      this.logger.error('Demo seed failed:', error.message);
    }
  }
}
