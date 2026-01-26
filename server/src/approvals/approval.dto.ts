import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';

export enum ApprovalEntityType {
  PURCHASE_ORDER = 'PurchaseOrder',
  SALE_ORDER = 'SaleOrder',
  PRODUCTION = 'Production',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class CreateApprovalDto {
  @IsEnum(ApprovalEntityType)
  entityType: ApprovalEntityType;

  @IsString()
  entityId: string;

  @IsString()
  tenantId: string;

  @IsString()
  requesterId: string;

  @IsOptional()
  @IsString()
  approverId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class ApproveRejectDto {
  @IsString()
  approverId: string;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class QueryApprovalsDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus;

  @IsOptional()
  @IsEnum(ApprovalEntityType)
  entityType?: ApprovalEntityType;

  @IsOptional()
  @IsString()
  requesterId?: string;

  @IsOptional()
  @IsString()
  approverId?: string;
}
