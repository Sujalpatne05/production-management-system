import { IsOptional, IsString, IsBoolean, IsInt, IsDecimal, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTenantSettingsDto {
  // Fiscal Configuration
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalYearStart?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalYearEnd?: number;

  // Currency & Formatting
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  currencySymbol?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  decimalPrecision?: number;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsString()
  timeZone?: string;

  // Tax Settings
  @IsOptional()
  @Type(() => Number)
  defaultTaxRate?: number;

  @IsOptional()
  @IsString()
  taxCalculationMethod?: 'inclusive' | 'exclusive';

  @IsOptional()
  @IsBoolean()
  enableMultipleTaxes?: boolean;

  // Stock & Inventory Settings
  @IsOptional()
  @IsBoolean()
  preventNegativeStock?: boolean;

  @IsOptional()
  @IsString()
  stockValuationMethod?: 'FIFO' | 'LIFO' | 'Weighted Average';

  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

  @IsOptional()
  @IsBoolean()
  enableBatchTracking?: boolean;

  @IsOptional()
  @IsBoolean()
  enableSerialNumbers?: boolean;

  // Sales Settings
  @IsOptional()
  @IsBoolean()
  requireApprovalForSales?: boolean;

  @IsOptional()
  @Type(() => Number)
  salesApprovalThreshold?: number;

  @IsOptional()
  @IsBoolean()
  allowSalesEditing?: boolean;

  @IsOptional()
  @IsBoolean()
  preventDuplicateInvoice?: boolean;

  // Purchase Settings
  @IsOptional()
  @IsBoolean()
  requireApprovalForPurchases?: boolean;

  @IsOptional()
  @Type(() => Number)
  purchaseApprovalThreshold?: number;

  @IsOptional()
  @IsBoolean()
  allowPurchaseEditing?: boolean;

  // Production Settings
  @IsOptional()
  @IsBoolean()
  trackProductionWaste?: boolean;

  @IsOptional()
  @IsBoolean()
  requireProductionApproval?: boolean;

  // Accounting Settings
  @IsOptional()
  @IsBoolean()
  useDoubleEntry?: boolean;

  @IsOptional()
  @IsBoolean()
  lockPastPeriods?: boolean;

  @IsOptional()
  @IsBoolean()
  requireJournalApproval?: boolean;

  // Number Formats
  @IsOptional()
  @IsString()
  invoicePrefix?: string;

  @IsOptional()
  @IsInt()
  @Min(4)
  @Max(10)
  invoiceNumberLength?: number;

  @IsOptional()
  @IsString()
  purchaseOrderPrefix?: string;

  @IsOptional()
  @IsInt()
  @Min(4)
  @Max(10)
  poNumberLength?: number;

  // Feature Flags
  @IsOptional()
  @IsBoolean()
  enableAdvancedReporting?: boolean;

  @IsOptional()
  @IsBoolean()
  enableMultiWarehouse?: boolean;

  @IsOptional()
  @IsBoolean()
  enableProjectTracking?: boolean;

  @IsOptional()
  @IsBoolean()
  enableManufacturing?: boolean;

  @IsOptional()
  @IsBoolean()
  enableEcommerce?: boolean;
}

export class TenantSettingsResponseDto {
  id: string;
  tenantId: string;
  
  // All settings fields
  fiscalYearStart: number;
  fiscalYearEnd: number;
  currency: string;
  currencySymbol: string;
  decimalPrecision: number;
  dateFormat: string;
  timeZone: string;
  defaultTaxRate: number;
  taxCalculationMethod: string;
  enableMultipleTaxes: boolean;
  preventNegativeStock: boolean;
  stockValuationMethod: string;
  lowStockThreshold: number;
  enableBatchTracking: boolean;
  enableSerialNumbers: boolean;
  requireApprovalForSales: boolean;
  salesApprovalThreshold: number | null;
  allowSalesEditing: boolean;
  preventDuplicateInvoice: boolean;
  requireApprovalForPurchases: boolean;
  purchaseApprovalThreshold: number | null;
  allowPurchaseEditing: boolean;
  trackProductionWaste: boolean;
  requireProductionApproval: boolean;
  useDoubleEntry: boolean;
  lockPastPeriods: boolean;
  requireJournalApproval: boolean;
  invoicePrefix: string;
  invoiceNumberLength: number;
  purchaseOrderPrefix: string;
  poNumberLength: number;
  enableAdvancedReporting: boolean;
  enableMultiWarehouse: boolean;
  enableProjectTracking: boolean;
  enableManufacturing: boolean;
  enableEcommerce: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
