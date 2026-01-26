import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({
      include: {
        users: {
          include: {
            user: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true,
            role: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async create(dto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.findOne(id);

    return this.prisma.tenant.update({
      where: { id: tenant.id },
      data: dto,
    });
  }

  async delete(id: string) {
    const tenant = await this.findOne(id);

    await this.prisma.tenant.delete({
      where: { id: tenant.id },
    });

    return { message: 'Tenant deleted successfully' };
  }
}
