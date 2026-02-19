import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dto/purchase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string, @Req() req?: any) {
    const resolvedTenantId = tenantId || req?.user?.tenants?.[0];
    return this.purchasesService.findAll(resolvedTenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePurchaseDto, @Req() req: any) {
    const resolvedTenantId = dto.tenantId || req?.user?.tenants?.[0];
    return this.purchasesService.create({
      ...dto,
      tenantId: resolvedTenantId,
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto) {
    return this.purchasesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.purchasesService.delete(id);
  }
}
