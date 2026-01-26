import { Module } from '@nestjs/common';
import { SalesController, PurchasesController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SalesController, PurchasesController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
