import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { GrnService, CreateGrnDto, CreateGrnLineItemDto } from './grn.service';

@Controller('api/grn')
export class GrnController {
  constructor(private grnService: GrnService) {}

  @Post()
  async createGrn(@Request() req, @Body() data: CreateGrnDto) {
    return this.grnService.createGrn(req.user.tenantId, data);
  }

  @Get()
  async getGrnList(@Request() req) {
    return this.grnService.getGrnList(req.user.tenantId);
  }

  @Get(':id')
  async getGrnById(@Request() req, @Param('id') id: string) {
    return this.grnService.getGrnById(req.user.tenantId, id);
  }

  @Post(':id/line-items')
  async addLineItem(@Request() req, @Param('id') grnId: string, @Body() data: CreateGrnLineItemDto) {
    return this.grnService.addLineItem(req.user.tenantId, grnId, data);
  }

  @Put(':id/status')
  async updateStatus(@Request() req, @Param('id') grnId: string, @Body() data: { status: string }) {
    return this.grnService.updateGrnStatus(req.user.tenantId, grnId, data.status);
  }

  @Put('line-items/:lineItemId/quality')
  async updateLineItemQuality(@Param('lineItemId') lineItemId: string, @Body() data: { qualityStatus: string }) {
    return this.grnService.updateLineItemQualityStatus(lineItemId, data.qualityStatus);
  }

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.grnService.getGrnDashboard(req.user.tenantId);
  }
}
