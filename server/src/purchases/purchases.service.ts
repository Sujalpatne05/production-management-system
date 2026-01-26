import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dto/purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId?: string) {
    return this.prisma.purchase.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { supplier: true, items: true, payments: true },
    });
  }

  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: { supplier: true, items: true, payments: true },
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  async create(dto: CreatePurchaseDto) {
    const { items, taxAmount = 0, ...rest } = dto;
    const prepared = this.prepareAmounts(items, taxAmount);

    try {
      return await this.prisma.purchase.create({
        data: {
          ...rest,
          status: dto.status ?? 'unpaid',
          purchaseDate: new Date(dto.purchaseDate),
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          subtotal: prepared.subtotal,
          taxAmount: prepared.taxAmount,
          total: prepared.total,
          items: {
            create: prepared.items,
          },
        },
        include: { supplier: true, items: true, payments: true },
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  async update(id: string, dto: UpdatePurchaseDto) {
    const { items, taxAmount = 0, ...rest } = dto;
    const existing = await this.prisma.purchase.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Purchase not found');

    const prepared = this.prepareAmounts(items, taxAmount);

    try {
      return await this.prisma.purchase.update({
        where: { id },
        data: {
          ...rest,
          status: dto.status ?? existing.status,
          purchaseDate: new Date(dto.purchaseDate),
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          subtotal: prepared.subtotal,
          taxAmount: prepared.taxAmount,
          total: prepared.total,
          items: {
            deleteMany: {},
            create: prepared.items,
          },
        },
        include: { supplier: true, items: true, payments: true },
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.purchase.delete({ where: { id } });
      return { message: 'Purchase deleted' };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Purchase not found');
      }
      throw err;
    }
  }

  private prepareAmounts(
    items: { rawMaterialId: string; quantity: number; unitPrice: number; discount?: number }[],
    taxAmount: number,
  ) {
    const normalizedItems = items.map((item) => {
      const amount = item.quantity * item.unitPrice - (item.discount ?? 0);
      return {
        rawMaterialId: item.rawMaterialId,
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.unitPrice),
        discount: new Prisma.Decimal(item.discount ?? 0),
        amount: new Prisma.Decimal(amount),
      };
    });

    const subtotalNumber = normalizedItems.reduce(
      (sum, i) => sum + Number(i.amount),
      0,
    );
    const subtotal = new Prisma.Decimal(subtotalNumber);
    const total = new Prisma.Decimal(subtotalNumber + taxAmount);

    return {
      items: normalizedItems,
      subtotal,
      taxAmount: new Prisma.Decimal(taxAmount),
      total,
    };
  }

  private handlePrismaError(err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new Error('Duplicate purchase number for tenant');
    }
    throw err;
  }
}
