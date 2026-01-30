import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested, IsUUID, IsNumber, Min, IsIn } from 'class-validator';

class PurchaseItemDto {
  @IsUUID()
  rawMaterialId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;
}

export class CreatePurchaseDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  supplierId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  poNo: string;

  @IsDateString()
  purchaseDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsIn(['draft', 'unpaid', 'partial', 'paid'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number;
}

export class UpdatePurchaseDto extends CreatePurchaseDto {}
