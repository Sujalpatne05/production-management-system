import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AccountingPeriodsService } from './accounting-periods.service';

@Controller('accounting-periods')
export class AccountingPeriodsController {
  constructor(private readonly service: AccountingPeriodsService) {}

  /**
   * Create a new period
   * POST /api/accounting-periods
   */
  @Post()
  async create(
    @Body()
    body: {
      tenantId: string;
      name: string;
      startDate: string;
      endDate: string;
      notes?: string;
    },
  ) {
    return this.service.create({
      tenantId: body.tenantId,
      name: body.name,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      notes: body.notes,
    });
  }

  /**
   * Get all periods for tenant
   * GET /api/accounting-periods
   */
  @Get()
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }

  /**
   * Get a specific period
   * GET /api/accounting-periods/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Get active period for a date
   * GET /api/accounting-periods/active/:tenantId/:date
   */
  @Get('active/:tenantId/:date')
  async getActivePeriod(
    @Param('tenantId') tenantId: string,
    @Param('date') date: string,
  ) {
    return this.service.getActivePeriod(tenantId, new Date(date));
  }

  /**
   * Check if date is in closed period
   * GET /api/accounting-periods/check-closed/:tenantId/:date
   */
  @Get('check-closed/:tenantId/:date')
  async isDateInClosedPeriod(
    @Param('tenantId') tenantId: string,
    @Param('date') date: string,
  ) {
    const isClosed = await this.service.isDateInClosedPeriod(
      tenantId,
      new Date(date),
    );
    return { isClosed };
  }

  /**
   * Close a period
   * POST /api/accounting-periods/:id/close
   */
  @Post(':id/close')
  async close(@Param('id') id: string, @Body('userId') userId: string) {
    return this.service.close(id, userId);
  }

  /**
   * Reopen a period
   * POST /api/accounting-periods/:id/reopen
   */
  @Post(':id/reopen')
  async reopen(@Param('id') id: string, @Body('userId') userId: string) {
    return this.service.reopen(id, userId);
  }

  /**
   * Update period
   * PUT /api/accounting-periods/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; notes?: string },
  ) {
    return this.service.update(id, body);
  }

  /**
   * Delete period
   * DELETE /api/accounting-periods/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
