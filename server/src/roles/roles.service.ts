import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  AssignPermissionsDto,
} from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  // Roles
  async findAllRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findOneRole(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async createRole(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: dto,
    });
  }

  async updateRole(id: number, dto: UpdateRoleDto) {
    const role = await this.findOneRole(id);

    return this.prisma.role.update({
      where: { id: role.id },
      data: dto,
    });
  }

  async deleteRole(id: number) {
    const role = await this.findOneRole(id);

    await this.prisma.role.delete({
      where: { id: role.id },
    });

    return { message: 'Role deleted successfully' };
  }

  // Permissions
  async findAllPermissions() {
    return this.prisma.permission.findMany();
  }

  async findOnePermission(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: dto,
    });
  }

  async updatePermission(id: number, dto: UpdatePermissionDto) {
    const permission = await this.findOnePermission(id);

    return this.prisma.permission.update({
      where: { id: permission.id },
      data: dto,
    });
  }

  async deletePermission(id: number) {
    const permission = await this.findOnePermission(id);

    await this.prisma.permission.delete({
      where: { id: permission.id },
    });

    return { message: 'Permission deleted successfully' };
  }

  // Assign permissions to role
  async assignPermissions(dto: AssignPermissionsDto) {
    // Remove existing permissions
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: dto.roleId },
    });

    // Assign new permissions
    const rolePermissions = dto.permissionIds.map(permissionId => ({
      roleId: dto.roleId,
      permissionId,
    }));

    await this.prisma.rolePermission.createMany({
      data: rolePermissions,
    });

    return this.findOneRole(dto.roleId);
  }
}
