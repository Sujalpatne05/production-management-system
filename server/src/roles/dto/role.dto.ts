import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreatePermissionDto {
  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignPermissionsDto {
  @IsInt()
  roleId: number;

  @IsArray()
  @IsInt({ each: true })
  permissionIds: number[];
}
