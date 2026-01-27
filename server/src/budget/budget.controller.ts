import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { BudgetService, CreateBudgetDto, CreateBudgetLineDto } from './budget.service';

@Controller('api/budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  async createBudget(@Request() req, @Body() data: CreateBudgetDto) {
    return this.budgetService.createBudget(req.user.tenantId, data);
  }

  @Get()
  async getBudgetList(@Request() req) {
    return this.budgetService.getBudgetList(req.user.tenantId);
  }

  @Get(':id')
  async getBudgetById(@Request() req, @Param('id') id: string) {
    return this.budgetService.getBudgetById(req.user.tenantId, id);
  }

  @Post(':id/lines')
  async addBudgetLine(@Param('id') budgetId: string, @Body() data: CreateBudgetLineDto & { lineNo: number }) {
    return this.budgetService.addBudgetLine(budgetId, data, data.lineNo);
  }

  @Put('lines/:lineId')
  async updateBudgetLine(@Param('lineId') lineId: string, @Body() data: Partial<CreateBudgetLineDto>) {
    return this.budgetService.updateBudgetLine(lineId, data);
  }

  @Put(':id/status')
  async updateStatus(@Request() req, @Param('id') budgetId: string, @Body() data: { status: string }) {
    return this.budgetService.updateBudgetStatus(req.user.tenantId, budgetId, data.status);
  }

  @Post(':id/calculate-variance')
  async calculateVariance(@Param('id') budgetId: string) {
    return this.budgetService.calculateVariance(budgetId);
  }

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.budgetService.getBudgetDashboard(req.user.tenantId);
  }
}
