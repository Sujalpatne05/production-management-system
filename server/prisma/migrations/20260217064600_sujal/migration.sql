-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "approvalId" TEXT,
ADD COLUMN     "approvalStatus" TEXT DEFAULT 'draft',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "approvalId" TEXT,
ADD COLUMN     "approvalStatus" TEXT DEFAULT 'draft',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "approvalId" TEXT,
ADD COLUMN     "approvalStatus" TEXT DEFAULT 'draft',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT;

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "approverId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "comments" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOM" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOMComponent" (
    "id" TEXT NOT NULL,
    "bomId" TEXT NOT NULL,
    "productId" TEXT,
    "rawMaterialId" TEXT,
    "quantity" DECIMAL(12,4) NOT NULL,
    "uom" TEXT NOT NULL,
    "wasteFactor" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "leadTime" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "sequenceNo" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOMComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QCTemplate" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QCInspection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "productionId" TEXT,
    "purchaseId" TEXT,
    "saleId" TEXT,
    "batchNo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "results" JSONB NOT NULL,
    "defectCount" INTEGER NOT NULL DEFAULT 0,
    "defectNotes" TEXT,
    "passedQuantity" DECIMAL(12,4) NOT NULL,
    "rejectedQuantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "nonConformanceId" TEXT,
    "inspectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonConformanceReport" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "reportNo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "rootCause" TEXT,
    "correctionActions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "closedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NonConformanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GRN" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "grnNo" TEXT NOT NULL,
    "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalQuantity" DECIMAL(12,4) NOT NULL,
    "acceptedQuantity" DECIMAL(12,4) NOT NULL,
    "rejectedQuantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "warehouseLocation" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GRN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GRNLineItem" (
    "id" TEXT NOT NULL,
    "grnId" TEXT NOT NULL,
    "purchaseItemId" TEXT,
    "productId" TEXT,
    "rawMaterialId" TEXT,
    "quantity" DECIMAL(12,4) NOT NULL,
    "receivedQuantity" DECIMAL(12,4) NOT NULL,
    "acceptedQuantity" DECIMAL(12,4) NOT NULL,
    "rejectedQuantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "batchNo" TEXT,
    "expiryDate" TIMESTAMP(3),
    "qualityStatus" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,

    CONSTRAINT "GRNLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "budgetPeriod" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalBudget" DECIMAL(15,2) NOT NULL,
    "totalActual" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetLine" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "costCenterId" TEXT,
    "accountId" TEXT,
    "description" TEXT NOT NULL,
    "budgetAmount" DECIMAL(15,2) NOT NULL,
    "actualAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "variance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "variancePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lineNo" INTEGER NOT NULL,

    CONSTRAINT "BudgetLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forecast" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "forecastMethod" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastLineItem" (
    "id" TEXT NOT NULL,
    "forecastId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "forecastedQuantity" DECIMAL(12,4) NOT NULL,
    "historicalAvg" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "lastYearQuantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "confidence" DECIMAL(5,2) NOT NULL DEFAULT 90,
    "notes" TEXT,

    CONSTRAINT "ForecastLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "tenantId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingPeriod" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "closedBy" TEXT,
    "closedAt" TIMESTAMP(3),
    "reopenedBy" TEXT,
    "reopenedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
    "fiscalYearEnd" INTEGER NOT NULL DEFAULT 12,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currencySymbol" TEXT NOT NULL DEFAULT '$',
    "decimalPrecision" INTEGER NOT NULL DEFAULT 2,
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "timeZone" TEXT NOT NULL DEFAULT 'UTC',
    "defaultTaxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "taxCalculationMethod" TEXT NOT NULL DEFAULT 'exclusive',
    "enableMultipleTaxes" BOOLEAN NOT NULL DEFAULT false,
    "preventNegativeStock" BOOLEAN NOT NULL DEFAULT true,
    "stockValuationMethod" TEXT NOT NULL DEFAULT 'FIFO',
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "enableBatchTracking" BOOLEAN NOT NULL DEFAULT false,
    "enableSerialNumbers" BOOLEAN NOT NULL DEFAULT false,
    "requireApprovalForSales" BOOLEAN NOT NULL DEFAULT false,
    "salesApprovalThreshold" DECIMAL(15,2),
    "allowSalesEditing" BOOLEAN NOT NULL DEFAULT true,
    "preventDuplicateInvoice" BOOLEAN NOT NULL DEFAULT true,
    "requireApprovalForPurchases" BOOLEAN NOT NULL DEFAULT false,
    "purchaseApprovalThreshold" DECIMAL(15,2),
    "allowPurchaseEditing" BOOLEAN NOT NULL DEFAULT true,
    "trackProductionWaste" BOOLEAN NOT NULL DEFAULT true,
    "requireProductionApproval" BOOLEAN NOT NULL DEFAULT false,
    "useDoubleEntry" BOOLEAN NOT NULL DEFAULT true,
    "lockPastPeriods" BOOLEAN NOT NULL DEFAULT true,
    "requireJournalApproval" BOOLEAN NOT NULL DEFAULT false,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "invoiceNumberLength" INTEGER NOT NULL DEFAULT 6,
    "purchaseOrderPrefix" TEXT NOT NULL DEFAULT 'PO',
    "poNumberLength" INTEGER NOT NULL DEFAULT 6,
    "enableAdvancedReporting" BOOLEAN NOT NULL DEFAULT false,
    "enableMultiWarehouse" BOOLEAN NOT NULL DEFAULT false,
    "enableProjectTracking" BOOLEAN NOT NULL DEFAULT false,
    "enableManufacturing" BOOLEAN NOT NULL DEFAULT true,
    "enableEcommerce" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Approval_tenantId_idx" ON "Approval"("tenantId");

-- CreateIndex
CREATE INDEX "Approval_entityType_entityId_idx" ON "Approval"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Approval_status_idx" ON "Approval"("status");

-- CreateIndex
CREATE INDEX "Approval_requesterId_idx" ON "Approval"("requesterId");

-- CreateIndex
CREATE INDEX "Approval_approverId_idx" ON "Approval"("approverId");

-- CreateIndex
CREATE INDEX "BOM_tenantId_idx" ON "BOM"("tenantId");

-- CreateIndex
CREATE INDEX "BOM_productId_idx" ON "BOM"("productId");

-- CreateIndex
CREATE INDEX "BOM_status_idx" ON "BOM"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BOM_tenantId_productId_version_key" ON "BOM"("tenantId", "productId", "version");

-- CreateIndex
CREATE INDEX "BOMComponent_bomId_idx" ON "BOMComponent"("bomId");

-- CreateIndex
CREATE INDEX "BOMComponent_productId_idx" ON "BOMComponent"("productId");

-- CreateIndex
CREATE INDEX "BOMComponent_rawMaterialId_idx" ON "BOMComponent"("rawMaterialId");

-- CreateIndex
CREATE INDEX "QCTemplate_tenantId_idx" ON "QCTemplate"("tenantId");

-- CreateIndex
CREATE INDEX "QCTemplate_type_idx" ON "QCTemplate"("type");

-- CreateIndex
CREATE INDEX "QCInspection_tenantId_idx" ON "QCInspection"("tenantId");

-- CreateIndex
CREATE INDEX "QCInspection_templateId_idx" ON "QCInspection"("templateId");

-- CreateIndex
CREATE INDEX "QCInspection_status_idx" ON "QCInspection"("status");

-- CreateIndex
CREATE INDEX "QCInspection_inspectionDate_idx" ON "QCInspection"("inspectionDate");

-- CreateIndex
CREATE INDEX "NonConformanceReport_tenantId_idx" ON "NonConformanceReport"("tenantId");

-- CreateIndex
CREATE INDEX "NonConformanceReport_status_idx" ON "NonConformanceReport"("status");

-- CreateIndex
CREATE INDEX "NonConformanceReport_severity_idx" ON "NonConformanceReport"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "NonConformanceReport_tenantId_reportNo_key" ON "NonConformanceReport"("tenantId", "reportNo");

-- CreateIndex
CREATE INDEX "GRN_tenantId_idx" ON "GRN"("tenantId");

-- CreateIndex
CREATE INDEX "GRN_purchaseId_idx" ON "GRN"("purchaseId");

-- CreateIndex
CREATE INDEX "GRN_status_idx" ON "GRN"("status");

-- CreateIndex
CREATE INDEX "GRN_receivedDate_idx" ON "GRN"("receivedDate");

-- CreateIndex
CREATE UNIQUE INDEX "GRN_tenantId_grnNo_key" ON "GRN"("tenantId", "grnNo");

-- CreateIndex
CREATE INDEX "GRNLineItem_grnId_idx" ON "GRNLineItem"("grnId");

-- CreateIndex
CREATE INDEX "GRNLineItem_productId_idx" ON "GRNLineItem"("productId");

-- CreateIndex
CREATE INDEX "GRNLineItem_rawMaterialId_idx" ON "GRNLineItem"("rawMaterialId");

-- CreateIndex
CREATE INDEX "Budget_tenantId_idx" ON "Budget"("tenantId");

-- CreateIndex
CREATE INDEX "Budget_status_idx" ON "Budget"("status");

-- CreateIndex
CREATE INDEX "Budget_startDate_endDate_idx" ON "Budget"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "BudgetLine_budgetId_idx" ON "BudgetLine"("budgetId");

-- CreateIndex
CREATE INDEX "BudgetLine_costCenterId_idx" ON "BudgetLine"("costCenterId");

-- CreateIndex
CREATE INDEX "BudgetLine_accountId_idx" ON "BudgetLine"("accountId");

-- CreateIndex
CREATE INDEX "Forecast_tenantId_idx" ON "Forecast"("tenantId");

-- CreateIndex
CREATE INDEX "Forecast_status_idx" ON "Forecast"("status");

-- CreateIndex
CREATE INDEX "Forecast_startDate_endDate_idx" ON "Forecast"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "ForecastLineItem_forecastId_idx" ON "ForecastLineItem"("forecastId");

-- CreateIndex
CREATE INDEX "ForecastLineItem_productId_idx" ON "ForecastLineItem"("productId");

-- CreateIndex
CREATE INDEX "ForecastLineItem_month_idx" ON "ForecastLineItem"("month");

-- CreateIndex
CREATE UNIQUE INDEX "ForecastLineItem_forecastId_productId_month_key" ON "ForecastLineItem"("forecastId", "productId", "month");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AccountingPeriod_tenantId_idx" ON "AccountingPeriod"("tenantId");

-- CreateIndex
CREATE INDEX "AccountingPeriod_status_idx" ON "AccountingPeriod"("status");

-- CreateIndex
CREATE INDEX "AccountingPeriod_startDate_endDate_idx" ON "AccountingPeriod"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "TenantSettings_tenantId_key" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantSettings_tenantId_idx" ON "TenantSettings"("tenantId");

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOM" ADD CONSTRAINT "BOM_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOM" ADD CONSTRAINT "BOM_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOMComponent" ADD CONSTRAINT "BOMComponent_bomId_fkey" FOREIGN KEY ("bomId") REFERENCES "BOM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOMComponent" ADD CONSTRAINT "BOMComponent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOMComponent" ADD CONSTRAINT "BOMComponent_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCTemplate" ADD CONSTRAINT "QCTemplate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCInspection" ADD CONSTRAINT "QCInspection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCInspection" ADD CONSTRAINT "QCInspection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "QCTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCInspection" ADD CONSTRAINT "QCInspection_nonConformanceId_fkey" FOREIGN KEY ("nonConformanceId") REFERENCES "NonConformanceReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonConformanceReport" ADD CONSTRAINT "NonConformanceReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "GRN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNLineItem" ADD CONSTRAINT "GRNLineItem_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLine" ADD CONSTRAINT "BudgetLine_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastLineItem" ADD CONSTRAINT "ForecastLineItem_forecastId_fkey" FOREIGN KEY ("forecastId") REFERENCES "Forecast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastLineItem" ADD CONSTRAINT "ForecastLineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingPeriod" ADD CONSTRAINT "AccountingPeriod_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantSettings" ADD CONSTRAINT "TenantSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
