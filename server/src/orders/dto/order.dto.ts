import { IsString, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  status: string;

  @IsNumber()
  total: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  total?: number;
}
