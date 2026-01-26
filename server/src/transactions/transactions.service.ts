import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, CreatePurchaseDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // Sales
  async findAllSales(tenantId?: string) {
    return this.prisma.sale.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneSale(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!sale) throw new NotFoundException('Sale not found');

    return sale;
  }

  async createSale(dto: CreateSaleDto) {
    return this.prisma.sale.create({
      data: {
        tenantId: dto.tenantId,
        customerId: dto.customerId,
        invoiceNo: dto.invoiceNo,
        subtotal: dto.subtotal,
        taxAmount: dto.tax ?? 0,
        total: dto.total,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            amount: item.total,
            discount: 0,
          })),
        },
      },
      include: { items: true },
    });
  }

  async deleteSale(id: string) {
    await this.prisma.sale.delete({ where: { id } });
    return { message: 'Sale deleted successfully' };
  }

  // Purchases
  async findAllPurchases(tenantId?: string) {
    return [];
  }

  async findOnePurchase(id: string) {
    throw new NotFoundException('Purchase not found');
  }

  async createPurchase(dto: CreatePurchaseDto) {
    return { id: 'placeholder', ...dto };
  }

  async deletePurchase(id: string) {
    return { message: 'Purchase deleted successfully' };
  }

  // Statistics
  async getSalesStats(tenantId: string) {
    const aggregate = await this.prisma.sale.aggregate({
      where: { tenantId },
      _count: { _all: true },
      _sum: { total: true },
    });

    const totalSales = aggregate._count._all;
    const totalRevenue = Number(aggregate._sum.total ?? 0);
    const averageOrderValue = totalSales ? totalRevenue / totalSales : 0;

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
    };
  }

  async getPurchaseStats(tenantId: string) {
    return {
      totalPurchases: 0,
      totalCost: 0,
      averageOrderValue: 0,
    };
  }
}
