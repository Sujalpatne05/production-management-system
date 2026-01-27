import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService, PrismaService],
  exports: [BudgetService],
})
export class BudgetModule {}
