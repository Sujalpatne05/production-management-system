import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateSaleDto, CreatePurchaseDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.transactionsService.findAllSales(tenantId);
  }

  @Get('stats/:tenantId')
  getStats(@Param('tenantId') tenantId: string) {
    return this.transactionsService.getSalesStats(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOneSale(id);
  }

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.transactionsService.createSale(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionsService.deleteSale(id);
  }
}

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.transactionsService.findAllPurchases(tenantId);
  }

  @Get('stats/:tenantId')
  getStats(@Param('tenantId') tenantId: string) {
    return this.transactionsService.getPurchaseStats(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOnePurchase(id);
  }

  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.transactionsService.createPurchase(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionsService.deletePurchase(id);
  }
}
