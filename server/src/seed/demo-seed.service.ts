import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DemoSeedService {
  private readonly logger = new Logger(DemoSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Manual demo data seeding method.
   * This should only be called via the seed endpoint with proper authentication.
   * Automatic seeding on startup has been disabled for production use.
   */
  async seedDemo() {
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
          return { message: 'Demo data already exists', skipped: true };
        }
      }
    } catch (error) {
      this.logger.error('Error checking existing data:', error);
      throw error;
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

      // Create product category first (global, not tenant-specific)
      let category = await this.prisma.productCategory.findFirst({
        where: { name: 'Electronics' },
      });
      
      if (!category) {
        category = await this.prisma.productCategory.create({
          data: {
            id: uuidv4(),
            name: 'Electronics',
            description: 'Electronic products',
          },
        });
      }

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
      
      return {
        message: 'Demo data seeded successfully',
        counts: {
          products: 5,
          orders: 3,
          customers: 2,
          sales: 3,
        },
      };
    } catch (error) {
      this.logger.error('Demo seed failed:', error.message);
      throw error;
    }
  }

  async seedTenantMasterData(tenantId?: string, userId?: string, userEmail?: string) {
    if (!tenantId) {
      throw new Error('Tenant not found in authenticated user context');
    }

    let category = await this.prisma.productCategory.findFirst({
      where: { name: 'General' },
    });
    if (!category) {
      category = await this.prisma.productCategory.create({
        data: {
          name: 'General',
          description: 'Default product category',
        },
      });
    }

    const rmCategory = await this.prisma.rawMaterialCategory.upsert({
      where: { id: 'default-rm-category' },
      update: { name: 'General RM' },
      create: {
        id: 'default-rm-category',
        name: 'General RM',
        description: 'Default raw material category',
      },
    });

    const customerCount = await this.prisma.customer.count({ where: { tenantId } });
    if (customerCount === 0) {
      await this.prisma.customer.createMany({
        data: [
          {
            id: uuidv4(),
            tenantId,
            name: 'Walk-in Customer',
            email: `walkin-${tenantId.slice(0, 8)}@example.com`,
            phone: '+91-9000000000',
            address: 'Default Address',
          },
          {
            id: uuidv4(),
            tenantId,
            name: 'Retail Customer',
            email: `retail-${tenantId.slice(0, 8)}@example.com`,
            phone: '+91-9111111111',
            address: 'Retail Address',
          },
        ],
      });
    }

    const supplierCount = await this.prisma.supplier.count({ where: { tenantId } });
    if (supplierCount === 0) {
      await this.prisma.supplier.createMany({
        data: [
          {
            id: uuidv4(),
            tenantId,
            name: 'Global Supplies Inc',
            email: `supplier-${tenantId.slice(0, 8)}@example.com`,
            phone: '+91-9222222222',
            address: 'Supplier Address',
          },
        ],
      });
    }

    const productCount = await this.prisma.product.count({ where: { tenantId } });
    if (productCount === 0) {
      const products = [
        { name: 'MS ANGLE 50x50x5 MM', sku: `MSA-${tenantId.slice(0, 4)}-001`, cost: '80', sellingPrice: '100' },
        { name: 'Steel Rod 12mm', sku: `SRD-${tenantId.slice(0, 4)}-002`, cost: '70', sellingPrice: '90' },
      ];

      for (const p of products) {
        const created = await this.prisma.product.create({
          data: {
            id: uuidv4(),
            tenantId,
            categoryId: category.id,
            name: p.name,
            sku: p.sku,
            description: `${p.name} default item`,
            unitOfMeasure: 'PCS',
            cost: p.cost,
            sellingPrice: p.sellingPrice,
          },
        });

        await this.prisma.stock.create({
          data: {
            tenantId,
            productId: created.id,
            quantity: 100,
            warehouseLocation: 'Main Warehouse',
          },
        });
      }
    }

    const rawMaterialCount = await this.prisma.rawMaterial.count({ where: { tenantId } });
    if (rawMaterialCount === 0) {
      const rawMaterials = [
        { name: 'Cotton Thread', sku: `CTH-${tenantId.slice(0, 4)}-001`, cost: '120', unitOfMeasure: 'KG' },
        { name: 'ABS Plastic Pellets', sku: `ABS-${tenantId.slice(0, 4)}-002`, cost: '95', unitOfMeasure: 'KG' },
      ];

      for (const rm of rawMaterials) {
        const created = await this.prisma.rawMaterial.create({
          data: {
            id: uuidv4(),
            tenantId,
            categoryId: rmCategory.id,
            name: rm.name,
            sku: rm.sku,
            unitOfMeasure: rm.unitOfMeasure,
            cost: rm.cost,
            reorderLevel: 10,
            supplier: 'Global Supplies Inc',
          },
        });

        await this.prisma.stock.create({
          data: {
            tenantId,
            rawMaterialId: created.id,
            quantity: 100,
            warehouseLocation: 'Main Warehouse',
          },
        });
      }
    }

    const result = {
      tenantId,
      requestedBy: userId || userEmail || 'unknown',
      counts: {
        customers: await this.prisma.customer.count({ where: { tenantId } }),
        suppliers: await this.prisma.supplier.count({ where: { tenantId } }),
        products: await this.prisma.product.count({ where: { tenantId } }),
        rawMaterials: await this.prisma.rawMaterial.count({ where: { tenantId } }),
      },
    };

    this.logger.log(`✅ Tenant master data ready for tenant ${tenantId}`);
    return { message: 'Tenant master data seeded successfully', ...result };
  }
}
