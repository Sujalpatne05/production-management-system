import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountingService: AccountingService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.accountingService.findAllAccounts(tenantId);
  }

  @Post()
  create(@Body() data: any) {
    return this.accountingService.createAccount(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.accountingService.updateAccount(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.accountingService.deleteAccount(id);
  }
}

@Controller('accounting-transactions')
@UseGuards(JwtAuthGuard)
export class AccountingTransactionsController {
  constructor(private accountingService: AccountingService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.accountingService.findAllTransactions(tenantId);
  }

  @Post()
  create(@Body() data: any) {
    return this.accountingService.createTransaction(data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.accountingService.deleteTransaction(id);
  }
}

@Controller('accounting/reports')
@UseGuards(JwtAuthGuard)
export class AccountingReportsController {
  constructor(private accountingService: AccountingService) {}

  @Get('trial-balance/:tenantId')
  getTrialBalance(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.accountingService.getTrialBalance(tenantId, startDate, endDate);
  }

  @Get('balance-sheet/:tenantId')
  getBalanceSheet(
    @Param('tenantId') tenantId: string,
    @Query('date') date?: string,
  ) {
    return this.accountingService.getBalanceSheet(tenantId, date);
  }

  @Get('profit-loss/:tenantId')
  getProfitLoss(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.accountingService.getProfitLoss(tenantId, startDate, endDate);
  }
}
