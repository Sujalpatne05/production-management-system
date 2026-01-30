import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum PeriodStatus {
  OPEN = 'open',
  PENDING_CLOSE = 'pending_close',
  CLOSED = 'closed',
}

@Injectable()
export class AccountingPeriodsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new accounting period
   */
  async create(data: {
    tenantId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
  }) {
    // Check for overlapping periods
    const overlapping = await this.prisma.accountingPeriod.findFirst({
      where: {
        tenantId: data.tenantId,
        OR: [
          {
            AND: [
              { startDate: { lte: data.startDate } },
              { endDate: { gte: data.startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: data.endDate } },
              { endDate: { gte: data.endDate } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Period overlaps with existing period');
    }

    return this.prisma.accountingPeriod.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        status: PeriodStatus.OPEN,
      },
    });
  }

  /**
   * Get all periods for a tenant
   */
  async findAll(tenantId: string) {
    return this.prisma.accountingPeriod.findMany({
      where: { tenantId },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Get a specific period
   */
  async findOne(id: string) {
    const period = await this.prisma.accountingPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      throw new NotFoundException('Accounting period not found');
    }

    return period;
  }

  /**
   * Get active period for a date
   */
  async getActivePeriod(tenantId: string, date: Date) {
    return this.prisma.accountingPeriod.findFirst({
      where: {
        tenantId,
        startDate: { lte: date },
        endDate: { gte: date },
        status: PeriodStatus.OPEN,
      },
    });
  }

  /**
   * Check if a date falls in a closed period
   */
  async isDateInClosedPeriod(tenantId: string, date: Date): Promise<boolean> {
    const period = await this.prisma.accountingPeriod.findFirst({
      where: {
        tenantId,
        startDate: { lte: date },
        endDate: { gte: date },
        status: PeriodStatus.CLOSED,
      },
    });

    return !!period;
  }

  /**
   * Close an accounting period
   */
  async close(id: string, userId: string) {
    const period = await this.findOne(id);

    if (period.status === PeriodStatus.CLOSED) {
      throw new BadRequestException('Period is already closed');
    }

    // Check if there are any pending transactions
    // (You can add custom validation here)

    return this.prisma.accountingPeriod.update({
      where: { id },
      data: {
        status: PeriodStatus.CLOSED,
        closedBy: userId,
        closedAt: new Date(),
      },
    });
  }

  /**
   * Reopen a closed period (Admin only)
   */
  async reopen(id: string, userId: string) {
    const period = await this.findOne(id);

    if (period.status !== PeriodStatus.CLOSED) {
      throw new BadRequestException('Period is not closed');
    }

    return this.prisma.accountingPeriod.update({
      where: { id },
      data: {
        status: PeriodStatus.OPEN,
        reopenedBy: userId,
        reopenedAt: new Date(),
      },
    });
  }

  /**
   * Update period details
   */
  async update(id: string, data: { name?: string; notes?: string }) {
    const period = await this.findOne(id);

    if (period.status === PeriodStatus.CLOSED) {
      throw new BadRequestException('Cannot update a closed period');
    }

    return this.prisma.accountingPeriod.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a period (only if open and no transactions)
   */
  async delete(id: string) {
    const period = await this.findOne(id);

    if (period.status === PeriodStatus.CLOSED) {
      throw new BadRequestException('Cannot delete a closed period');
    }

    // Check for transactions in this period
    const transactionCount = await this.prisma.accountingTransaction.count({
      where: {
        tenantId: period.tenantId,
        transactionDate: {
          gte: period.startDate,
          lte: period.endDate,
        },
      },
    });

    if (transactionCount > 0) {
      throw new BadRequestException('Cannot delete period with transactions');
    }

    return this.prisma.accountingPeriod.delete({
      where: { id },
    });
  }
}
