import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId?: string) {
    return this.prisma.order.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        tenant: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        tenant: true,
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: dto,
      include: {
        tenant: true,
        user: true,
      },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.findOne(id);

    return this.prisma.order.update({
      where: { id: order.id },
      data: dto,
      include: {
        tenant: true,
        user: true,
      },
    });
  }

  async delete(id: string) {
    const order = await this.findOne(id);

    await this.prisma.order.delete({
      where: { id: order.id },
    });

    return { message: 'Order deleted successfully' };
  }

  async getStatsByTenant(tenantId: string) {
    const totalOrders = await this.prisma.order.count({
      where: { tenantId },
    });

    const totalRevenue = await this.prisma.order.aggregate({
      where: { tenantId },
      _sum: {
        total: true,
      },
    });

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: {
        status: true,
      },
    });

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      ordersByStatus,
    };
  }
}
