import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BomService, CreateBomDto, CreateBomComponentDto, UpdateBomDto } from './bom.service';

@Controller('api/bom')
export class BomController {
  constructor(private bomService: BomService) {}

  @Post()
  async createBom(@Request() req, @Body() data: CreateBomDto) {
    return this.bomService.createBom(req.user.tenantId, data);
  }

  @Get()
  async getBomList(@Request() req, @Param('productId') productId?: string) {
    return this.bomService.getBomList(req.user.tenantId, productId);
  }

  @Get(':id')
  async getBomById(@Request() req, @Param('id') id: string) {
    return this.bomService.getBomById(req.user.tenantId, id);
  }

  @Put(':id')
  async updateBom(@Request() req, @Param('id') id: string, @Body() data: UpdateBomDto) {
    return this.bomService.updateBom(req.user.tenantId, id, data);
  }

  @Delete(':id')
  async deleteBom(@Request() req, @Param('id') id: string) {
    return this.bomService.deleteBom(req.user.tenantId, id);
  }

  @Post(':id/components')
  async addComponent(@Request() req, @Param('id') bomId: string, @Body() data: CreateBomComponentDto) {
    return this.bomService.addComponent(req.user.tenantId, bomId, data);
  }

  @Delete('components/:componentId')
  async removeComponent(@Request() req, @Param('componentId') componentId: string) {
    return this.bomService.removeComponent(req.user.tenantId, componentId);
  }

  @Put('components/:componentId')
  async updateComponent(@Param('componentId') componentId: string, @Body() data: Partial<CreateBomComponentDto>) {
    return this.bomService.updateComponent(componentId, data);
  }

  @Get('product/:productId')
  async getBomByProduct(@Request() req, @Param('productId') productId: string) {
    return this.bomService.getBomByProduct(req.user.tenantId, productId);
  }
}
