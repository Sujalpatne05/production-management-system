import { IsString, IsNumber, IsArray, IsUUID, IsOptional } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  invoiceNo: string;

  @IsUUID()
  customerId: string;

  @IsArray()
  items: SaleItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  tenantId: string;
}

export class SaleItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}

export class CreatePurchaseDto {
  @IsString()
  invoiceNo: string;

  @IsUUID()
  supplierId: string;

  @IsArray()
  items: PurchaseItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  tenantId: string;
}

export class PurchaseItemDto {
  @IsUUID()
  rawMaterialId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}
