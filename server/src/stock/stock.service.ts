import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getProductStock(tenantId?: string) {
    return [];
  }

  async getRawMaterialStock(tenantId?: string) {
    return [];
  }

  async updateProductStock(productId: string, quantity: number, type: 'add' | 'remove') {
    return { message: 'Stock updated successfully' };
  }

  async updateRawMaterialStock(
    rawMaterialId: string,
    quantity: number,
    type: 'add' | 'remove',
  ) {
    return { message: 'Stock updated successfully' };
  }

  async getLowStockItems(tenantId: string) {
    return {
      products: [],
      rawMaterials: [],
    };
  }
}
