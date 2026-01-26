import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from './dto/party.dto';

@Injectable()
export class PartiesService {
  constructor(private prisma: PrismaService) {}

  // Customers
  async findAllCustomers(tenantId?: string) {
    return [];
  }

  async findOneCustomer(id: string) {
    throw new NotFoundException('Customer not found');
  }

  async createCustomer(dto: CreateCustomerDto) {
    return { id: 'placeholder', ...dto };
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    return { id, ...dto };
  }

  async deleteCustomer(id: string) {
    return { message: 'Customer deleted successfully' };
  }

  // Suppliers
  async findAllSuppliers(tenantId?: string) {
    return [];
  }

  async findOneSupplier(id: string) {
    throw new NotFoundException('Supplier not found');
  }

  async createSupplier(dto: CreateSupplierDto) {
    return { id: 'placeholder', ...dto };
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto) {
    return { id, ...dto };
  }

  async deleteSupplier(id: string) {
    return { message: 'Supplier deleted successfully' };
  }
}
