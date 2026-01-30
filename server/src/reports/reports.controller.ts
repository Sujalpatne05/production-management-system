import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('sales/:tenantId')
  getSalesReport(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getSalesReport(tenantId, startDate, endDate);
  }

  @Get('purchases/:tenantId')
  getPurchaseReport(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getPurchaseReport(tenantId, startDate, endDate);
  }

  @Get('production/:tenantId')
  getProductionReport(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getProductionReport(tenantId, startDate, endDate);
  }

  @Get('expenses/:tenantId')
  getExpenseReport(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getExpenseReport(tenantId, startDate, endDate);
  }

  @Get('inventory/:tenantId')
  getInventoryReport(@Param('tenantId') tenantId: string) {
    return this.reportsService.getInventoryReport(tenantId);
  }

  @Get('production-efficiency/:tenantId')
  getProductionEfficiencyReport(@Param('tenantId') tenantId: string) {
    return this.reportsService.getProductionEfficiencyReport(tenantId);
  }

  @Get('customers/:tenantId')
  getCustomerReport(@Param('tenantId') tenantId: string) {
    return this.reportsService.getCustomerReport(tenantId);
  }

  @Get('suppliers/:tenantId')
  getSupplierReport(@Param('tenantId') tenantId: string) {
    return this.reportsService.getSupplierReport(tenantId);
  }

  @Get('dashboard/:tenantId')
  getDashboardStats(@Param('tenantId') tenantId: string) {
    return this.reportsService.getDashboardStats(tenantId);
  }
}
