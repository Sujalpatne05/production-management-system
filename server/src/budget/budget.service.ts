import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateBudgetDto {
  name: string;
  description?: string;
  budgetPeriod: string;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  notes?: string;
}

export class CreateBudgetLineDto {
  costCenterId?: string;
  accountId?: string;
  description: string;
  budgetAmount: number;
}

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async createBudget(tenantId: string, data: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        budgetPeriod: data.budgetPeriod,
        startDate: data.startDate,
        endDate: data.endDate,
        totalBudget: new Decimal(data.totalBudget),
        notes: data.notes,
        status: 'draft',
      },
      include: { lines: true },
    });
  }

  async getBudgetList(tenantId: string) {
    return this.prisma.budget.findMany({
      where: { tenantId },
      include: { lines: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBudgetById(tenantId: string, budgetId: string) {
    return this.prisma.budget.findFirst({
      where: { tenantId, id: budgetId },
      include: { lines: true },
    });
  }

  async addBudgetLine(budgetId: string, data: CreateBudgetLineDto, lineNo: number) {
    return this.prisma.budgetLine.create({
      data: {
        budgetId,
        costCenterId: data.costCenterId,
        accountId: data.accountId,
        description: data.description,
        budgetAmount: new Decimal(data.budgetAmount),
        actualAmount: new Decimal(0),
        variance: new Decimal(0),
        variancePercent: new Decimal(0),
        lineNo,
      },
    });
  }

  async updateBudgetLine(lineId: string, data: Partial<CreateBudgetLineDto>) {
    const updateData: any = {};
    if (data.description) updateData.description = data.description;
    if (data.budgetAmount !== undefined) updateData.budgetAmount = new Decimal(data.budgetAmount);

    return this.prisma.budgetLine.update({
      where: { id: lineId },
      data: updateData,
    });
  }

  async updateBudgetStatus(tenantId: string, budgetId: string, status: string) {
    return this.prisma.budget.update({
      where: { id: budgetId },
      data: { status },
      include: { lines: true },
    });
  }

  async calculateVariance(budgetId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id: budgetId },
      include: { lines: true },
    });

    if (!budget) throw new Error('Budget not found');

    // Update each line with variance
    for (const line of budget.lines) {
      const variance = line.budgetAmount.minus(line.actualAmount);
      const variancePercent = line.budgetAmount.toNumber() !== 0 
        ? variance.dividedBy(line.budgetAmount).multipliedBy(100)
        : new Decimal(0);

      await this.prisma.budgetLine.update({
        where: { id: line.id },
        data: {
          variance,
          variancePercent,
        },
      });
    }

    return this.getBudgetById(budget.tenantId, budgetId);
  }

  async getBudgetDashboard(tenantId: string) {
    const activeBudgets = await this.prisma.budget.count({
      where: { tenantId, status: 'active' },
    });

    const totalBudgetAmount = await this.prisma.budget.aggregate({
      where: { tenantId, status: 'active' },
      _sum: { totalBudget: true },
    });

    const budgetVariances = await this.prisma.budgetLine.aggregate({
      where: { budget: { tenantId, status: 'active' } },
      _sum: { variance: true },
    });

    return {
      activeBudgets,
      totalBudgetAmount: totalBudgetAmount._sum.totalBudget || 0,
      totalVariance: budgetVariances._sum.variance || 0,
    };
  }
}
