import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('products')
  getProductStock(@Query('tenantId') tenantId?: string) {
    return this.stockService.getProductStock(tenantId);
  }

  @Get('raw-materials')
  getRawMaterialStock(@Query('tenantId') tenantId?: string) {
    return this.stockService.getRawMaterialStock(tenantId);
  }

  @Get('low-stock/:tenantId')
  getLowStockItems(@Param('tenantId') tenantId: string) {
    return this.stockService.getLowStockItems(tenantId);
  }

  @Post('products/:id/update')
  updateProductStock(
    @Param('id') id: string,
    @Body() body: { quantity: number; type: 'add' | 'remove' },
  ) {
    return this.stockService.updateProductStock(id, body.quantity, body.type);
  }

  @Post('raw-materials/:id/update')
  updateRawMaterialStock(
    @Param('id') id: string,
    @Body() body: { quantity: number; type: 'add' | 'remove' },
  ) {
    return this.stockService.updateRawMaterialStock(id, body.quantity, body.type);
  }
}
