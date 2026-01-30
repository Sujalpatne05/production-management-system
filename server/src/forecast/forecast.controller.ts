import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { ForecastService, CreateForecastDto, CreateForecastLineItemDto } from './forecast.service';

@Controller('api/forecast')
export class ForecastController {
  constructor(private forecastService: ForecastService) {}

  @Post()
  async createForecast(@Request() req, @Body() data: CreateForecastDto) {
    return this.forecastService.createForecast(req.user.tenantId, data);
  }

  @Get()
  async getForecastList(@Request() req) {
    return this.forecastService.getForecastList(req.user.tenantId);
  }

  @Get(':id')
  async getForecastById(@Request() req, @Param('id') id: string) {
    return this.forecastService.getForecastById(req.user.tenantId, id);
  }

  @Post(':id/line-items')
  async addLineItem(@Param('id') forecastId: string, @Body() data: CreateForecastLineItemDto) {
    return this.forecastService.addForecastLineItem(forecastId, data);
  }

  @Put('line-items/:lineItemId')
  async updateLineItem(@Param('lineItemId') lineItemId: string, @Body() data: Partial<CreateForecastLineItemDto>) {
    return this.forecastService.updateForecastLineItem(lineItemId, data);
  }

  @Put(':id/status')
  async updateStatus(@Request() req, @Param('id') forecastId: string, @Body() data: { status: string }) {
    return this.forecastService.updateForecastStatus(req.user.tenantId, forecastId, data.status);
  }

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.forecastService.getForecastDashboard(req.user.tenantId);
  }

  @Post('calculate-historical/:productId')
  async calculateHistorical(@Request() req, @Param('productId') productId: string) {
    return this.forecastService.calculateHistoricalAverage(req.user.tenantId, productId);
  }

  @Post('seasonal/:productId')
  async forecastSeasonal(@Request() req, @Param('productId') productId: string, @Body() data: { seasonFactor: number }) {
    return this.forecastService.forecastBySeason(req.user.tenantId, productId, data.seasonFactor);
  }
}
