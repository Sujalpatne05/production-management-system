import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getProductStock(tenantId?: string) {
    return this.prisma.product.findMany({
      where: tenantId ? { tenantId } : undefined,
      select: {
        id: true,
        name: true,
        tenantId: true,
        stocks: {
          select: { quantity: true, warehouseLocation: true, lastUpdated: true },
        },
      },
    });
  }

  async getRawMaterialStock(tenantId?: string) {
    return this.prisma.rawMaterial.findMany({
      where: tenantId ? { tenantId } : undefined,
      select: {
        id: true,
        name: true,
        tenantId: true,
        sku: true,
        unitOfMeasure: true,
        cost: true,
        reorderLevel: true,
        stocks: {
          select: { quantity: true, warehouseLocation: true, lastUpdated: true },
        },
      },
    });
  }

  async updateProductStock(productId: string, quantity: number, type: 'add' | 'remove') {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.stock.findFirst({
      where: { tenantId: product.tenantId, productId },
    });

    const currentQty = existing?.quantity ?? 0;
    const newQty = type === 'add' ? currentQty + quantity : Math.max(0, currentQty - quantity);

    if (existing) {
      await this.prisma.stock.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.stock.create({
        data: {
          tenantId: product.tenantId,
          productId,
          quantity: newQty,
        },
      });
    }

    return { message: 'Stock updated successfully' };
  }

  async updateRawMaterialStock(
    rawMaterialId: string,
    quantity: number,
    type: 'add' | 'remove',
  ) {
    const rawMaterial = await this.prisma.rawMaterial.findUnique({ where: { id: rawMaterialId } });
    if (!rawMaterial) {
      throw new NotFoundException('Raw material not found');
    }

    const existing = await this.prisma.stock.findFirst({
      where: { tenantId: rawMaterial.tenantId, rawMaterialId },
    });

    const currentQty = existing?.quantity ?? 0;
    const newQty = type === 'add' ? currentQty + quantity : Math.max(0, currentQty - quantity);

    if (existing) {
      await this.prisma.stock.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.stock.create({
        data: {
          tenantId: rawMaterial.tenantId,
          rawMaterialId,
          quantity: newQty,
        },
      });
    }

    return { message: 'Stock updated successfully' };
  }

  async getLowStockItems(tenantId: string) {
    const products = await this.prisma.product.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        reorderLevel: true,
        stocks: { select: { quantity: true } },
      },
    });

    const rawMaterials = await this.prisma.rawMaterial.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        reorderLevel: true,
        stocks: { select: { quantity: true } },
      },
    });

    return {
      products: products.filter((p) => (p.stocks[0]?.quantity ?? 0) <= p.reorderLevel),
      rawMaterials: rawMaterials.filter((m) => (m.stocks[0]?.quantity ?? 0) <= m.reorderLevel),
    };
  }
}
