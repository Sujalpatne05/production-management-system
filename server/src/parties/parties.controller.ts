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
import { PartiesService } from './parties.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from './dto/party.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private partiesService: PartiesService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.partiesService.findAllCustomers(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partiesService.findOneCustomer(id);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.partiesService.createCustomer(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.partiesService.updateCustomer(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.partiesService.deleteCustomer(id);
  }
}

@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private partiesService: PartiesService) {}

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.partiesService.findAllSuppliers(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partiesService.findOneSupplier(id);
  }

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.partiesService.createSupplier(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.partiesService.updateSupplier(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.partiesService.deleteSupplier(id);
  }
}
