import { IsString, IsNumber, IsOptional, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductionDto {
  @IsString()
  referenceNo: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @Type(() => Date)
  startDate: string;

  @IsString()
  @IsOptional()
  @Type(() => Date)
  endDate?: string;

  @IsString()
  status: string;

  @IsString()
  stage: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  tenantId: string;
}

export class UpdateProductionDto {
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateProductionLossDto {
  @IsUUID()
  productionId: string;

  @IsString()
  reason: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  tenantId: string;
}

export class CreateProductionStageDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsUUID()
  tenantId: string;
}
