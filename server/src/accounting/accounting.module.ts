import { Module } from '@nestjs/common';
import {
  AccountsController,
  AccountingTransactionsController,
  AccountingReportsController,
} from './accounting.controller';
import { AccountingService } from './accounting.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    AccountsController,
    AccountingTransactionsController,
    AccountingReportsController,
  ],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}
