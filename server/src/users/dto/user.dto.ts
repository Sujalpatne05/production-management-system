import { IsEmail, IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class AssignRoleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  tenantId: string;

  @IsArray()
  roleIds: number[];
}
