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
    return this.prisma.customer.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneCustomer(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async createCustomer(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        email: dto.email ?? `${Date.now()}@customer.local`,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        country: dto.country,
      },
    });
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    await this.findOneCustomer(id);
    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCustomer(id: string) {
    await this.findOneCustomer(id);
    await this.prisma.customer.delete({ where: { id } });
    return { message: 'Customer deleted successfully' };
  }

  // Suppliers
  async findAllSuppliers(tenantId?: string) {
    return this.prisma.supplier.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneSupplier(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async createSupplier(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        email: dto.email ?? `${Date.now()}@supplier.local`,
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        country: dto.country,
      },
    });
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto) {
    await this.findOneSupplier(id);
    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSupplier(id: string) {
    await this.findOneSupplier(id);
    await this.prisma.supplier.delete({ where: { id } });
    return { message: 'Supplier deleted successfully' };
  }
}
