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
import { ProductionsService } from './productions.service';
import {
  CreateProductionDto,
  UpdateProductionDto,
  CreateProductionLossDto,
  CreateProductionStageDto,
} from './dto/production.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('productions')
@UseGuards(JwtAuthGuard)
export class ProductionsController {
  constructor(private productionsService: ProductionsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.productionsService.findAllProductions(tenantId);
  }

  @Get('stats/:tenantId')
  getStats(@Param('tenantId') tenantId: string) {
    return this.productionsService.getProductionStats(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionsService.findOneProduction(id);
  }

  @Post()
  create(@Body() dto: CreateProductionDto) {
    return this.productionsService.createProduction(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductionDto) {
    return this.productionsService.updateProduction(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productionsService.deleteProduction(id);
  }
}

@Controller('production-losses')
@UseGuards(JwtAuthGuard)
export class ProductionLossesController {
  constructor(private productionsService: ProductionsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.productionsService.findAllLosses(tenantId);
  }

  @Post()
  create(@Body() dto: CreateProductionLossDto) {
    return this.productionsService.createLoss(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productionsService.deleteLoss(id);
  }
}

@Controller('production-stages')
@UseGuards(JwtAuthGuard)
export class ProductionStagesController {
  constructor(private productionsService: ProductionsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.productionsService.findAllStages(tenantId);
  }

  @Post()
  create(@Body() dto: CreateProductionStageDto) {
    return this.productionsService.createStage(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productionsService.deleteStage(id);
  }
}
