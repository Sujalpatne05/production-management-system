import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
            tenant: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
      include: {
        roles: {
          include: {
            role: true,
            tenant: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { id: user.id },
      data: dto,
      include: {
        roles: {
          include: {
            role: true,
            tenant: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const user = await this.findOne(id);

    await this.prisma.user.delete({
      where: { id: user.id },
    });

    return { message: 'User deleted successfully' };
  }

  async assignRoles(dto: AssignRoleDto) {
    // Remove existing roles for this user in this tenant
    await this.prisma.userRole.deleteMany({
      where: {
        userId: dto.userId,
        tenantId: dto.tenantId,
      },
    });

    // Assign new roles
    const userRoles = dto.roleIds.map(roleId => ({
      userId: dto.userId,
      tenantId: dto.tenantId,
      roleId,
    }));

    await this.prisma.userRole.createMany({
      data: userRoles,
    });

    return this.findOne(dto.userId);
  }
}
