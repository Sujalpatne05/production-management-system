import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('seed')
export class SeedController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('demo')
  async seedDemo() {
    const tenantId = 'demo-tenant-id';

    try {
      // Create tenant
      const tenant = await this.prisma.tenant.upsert({
        where: { id: tenantId },
        update: {},
        create: {
          id: tenantId,
          name: 'Demo Company',
          plan: 'enterprise',
          status: 'active',
        },
      });

      // Create role
      const role = await this.prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin' },
      });

      // Create user
      const user = await this.prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
          email: 'admin@demo.com',
          fullName: 'Admin User',
          status: 'active',
        },
      });

      // Create user role
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

      // Create product category (global, not tenant-specific)
      const category = await this.prisma.productCategory.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
          id: uuidv4(),
          name: 'Electronics',
          description: 'Electronic products',
        },
      });

      // Create products
      const productIds: string[] = [];
      const products = [
        { name: 'Laptop Pro', sku: 'LAP-001', cost: '1200', sellingPrice: '1500' },
        { name: 'Desktop Computer', sku: 'DSK-001', cost: '1000', sellingPrice: '1200' },
        { name: 'Monitor 27"', sku: 'MON-001', cost: '250', sellingPrice: '300' },
        { name: 'Keyboard Mechanical', sku: 'KEY-001', cost: '100', sellingPrice: '120' },
        { name: 'Mouse Wireless', sku: 'MOU-001', cost: '40', sellingPrice: '50' },
      ];

      for (const prod of products) {
        const existing = await this.prisma.product.findFirst({
          where: { sku: prod.sku, tenantId },
        });
        if (!existing) {
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
          });
          productIds.push(created.id);
        }
      }

      // Create orders
      const orderCount = await this.prisma.order.count({ where: { tenantId } });
      if (orderCount === 0) {
        const orders = [
          { status: 'draft', total: '5000' },
          { status: 'confirmed', total: '3500' },
          { status: 'completed', total: '2500' },
        ];

        for (const ord of orders) {
          await this.prisma.order.create({
            data: {
              id: uuidv4(),
              tenantId,
              status: ord.status,
              total: ord.total,
              notes: 'Demo order',
            },
          });
        }
      }

      // Create customers
      const customerIds: string[] = [];
      const customers = [
        { name: 'ABC Corp', email: 'contact@abccorp.com' },
        { name: 'XYZ Ltd', email: 'contact@xyzltd.com' },
      ];

      for (const cust of customers) {
        const existing = await this.prisma.customer.findFirst({
          where: { email: cust.email, tenantId },
        });
        if (!existing) {
          const created = await this.prisma.customer.create({
            data: {
              id: uuidv4(),
              name: cust.name,
              email: cust.email,
              tenantId,
              status: 'active',
            },
          });
          customerIds.push(created.id);
        } else {
          customerIds.push(existing.id);
        }
      }

      // Create sales
      const saleCount = await this.prisma.sale.count({ where: { tenantId } });
      if (saleCount === 0 && customerIds.length > 0) {
        const sales = [
          { invoiceNo: 'INV-001', status: 'draft', subtotal: '4000', taxAmount: '500', total: '4500', customerId: customerIds[0] },
          { invoiceNo: 'INV-002', status: 'confirmed', subtotal: '3000', taxAmount: '200', total: '3200', customerId: customerIds[1 % customerIds.length] },
          { invoiceNo: 'INV-003', status: 'completed', subtotal: '6000', taxAmount: '800', total: '6800', customerId: customerIds[0] },
        ];

        for (const sale of sales) {
          await this.prisma.sale.create({
            data: {
              id: uuidv4(),
              invoiceNo: sale.invoiceNo,
              tenantId,
              customerId: sale.customerId,
              status: sale.status,
              subtotal: sale.subtotal,
              taxAmount: sale.taxAmount,
              total: sale.total,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }

      return {
        message: 'Demo data seeded successfully',
        counts: {
          products: await this.prisma.product.count({ where: { tenantId } }),
          orders: await this.prisma.order.count({ where: { tenantId } }),
          customers: await this.prisma.customer.count({ where: { tenantId } }),
          sales: await this.prisma.sale.count({ where: { tenantId } }),
        },
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Seeding failed',
      };
    }
  }
}
