import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  AssignPermissionsDto,
} from './dto/role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // Roles endpoints
  @Get()
  @Roles('Admin')
  findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @Roles('Admin')
  findOneRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOneRole(id);
  }

  @Post()
  @Roles('Admin')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Put(':id')
  @Roles('Admin')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }

  @Post('assign-permissions')
  @Roles('Admin')
  assignPermissions(@Body() dto: AssignPermissionsDto) {
    return this.rolesService.assignPermissions(dto);
  }
}

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @Roles('Admin')
  findAll() {
    return this.rolesService.findAllPermissions();
  }

  @Get(':id')
  @Roles('Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOnePermission(id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreatePermissionDto) {
    return this.rolesService.createPermission(dto);
  }

  @Put(':id')
  @Roles('Admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionDto) {
    return this.rolesService.updatePermission(id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deletePermission(id);
  }
}
