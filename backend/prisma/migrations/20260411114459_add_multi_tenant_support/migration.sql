/*
  Warnings:

  - A unique constraint covering the columns `[companyId,key]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Setting_key_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Accounting" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "ExpenseCategory" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "NonInventoryItem" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Outlet" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "RMCategory" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Waste" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'starter',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "maxStorage" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyAdmin" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "maxUsers" INTEGER NOT NULL,
    "maxStorage" INTEGER NOT NULL,
    "features" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assignedTo" TEXT,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "tax" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT,
    "companyId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB,
    "type" TEXT NOT NULL DEFAULT 'string',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE INDEX "Company_email_idx" ON "Company"("email");

-- CreateIndex
CREATE INDEX "Company_subscriptionStatus_idx" ON "Company"("subscriptionStatus");

-- CreateIndex
CREATE INDEX "CompanyAdmin_companyId_idx" ON "CompanyAdmin"("companyId");

-- CreateIndex
CREATE INDEX "CompanyAdmin_userId_idx" ON "CompanyAdmin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyAdmin_companyId_userId_key" ON "CompanyAdmin"("companyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_status_idx" ON "SubscriptionPlan"("status");

-- CreateIndex
CREATE INDEX "Subscription_companyId_idx" ON "Subscription"("companyId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "AuditLog_companyId_idx" ON "AuditLog"("companyId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "SupportTicket_companyId_idx" ON "SupportTicket"("companyId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_priority_idx" ON "SupportTicket"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_companyId_idx" ON "Invoice"("companyId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPayment_transactionId_key" ON "SubscriptionPayment"("transactionId");

-- CreateIndex
CREATE INDEX "SubscriptionPayment_companyId_idx" ON "SubscriptionPayment"("companyId");

-- CreateIndex
CREATE INDEX "SubscriptionPayment_status_idx" ON "SubscriptionPayment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "SystemSetting_key_idx" ON "SystemSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_secret_key" ON "ApiKey"("secret");

-- CreateIndex
CREATE INDEX "ApiKey_companyId_idx" ON "ApiKey"("companyId");

-- CreateIndex
CREATE INDEX "ApiKey_status_idx" ON "ApiKey"("status");

-- CreateIndex
CREATE INDEX "Account_companyId_idx" ON "Account"("companyId");

-- CreateIndex
CREATE INDEX "Accounting_companyId_idx" ON "Accounting"("companyId");

-- CreateIndex
CREATE INDEX "Attendance_companyId_idx" ON "Attendance"("companyId");

-- CreateIndex
CREATE INDEX "Expense_companyId_idx" ON "Expense"("companyId");

-- CreateIndex
CREATE INDEX "ExpenseCategory_companyId_idx" ON "ExpenseCategory"("companyId");

-- CreateIndex
CREATE INDEX "Inventory_companyId_idx" ON "Inventory"("companyId");

-- CreateIndex
CREATE INDEX "NonInventoryItem_companyId_idx" ON "NonInventoryItem"("companyId");

-- CreateIndex
CREATE INDEX "Order_companyId_idx" ON "Order"("companyId");

-- CreateIndex
CREATE INDEX "Outlet_companyId_idx" ON "Outlet"("companyId");

-- CreateIndex
CREATE INDEX "Party_companyId_idx" ON "Party"("companyId");

-- CreateIndex
CREATE INDEX "Payment_companyId_idx" ON "Payment"("companyId");

-- CreateIndex
CREATE INDEX "Payroll_companyId_idx" ON "Payroll"("companyId");

-- CreateIndex
CREATE INDEX "ProductCategory_companyId_idx" ON "ProductCategory"("companyId");

-- CreateIndex
CREATE INDEX "Production_companyId_idx" ON "Production"("companyId");

-- CreateIndex
CREATE INDEX "Purchase_companyId_idx" ON "Purchase"("companyId");

-- CreateIndex
CREATE INDEX "Quotation_companyId_idx" ON "Quotation"("companyId");

-- CreateIndex
CREATE INDEX "RMCategory_companyId_idx" ON "RMCategory"("companyId");

-- CreateIndex
CREATE INDEX "Report_companyId_idx" ON "Report"("companyId");

-- CreateIndex
CREATE INDEX "Sale_companyId_idx" ON "Sale"("companyId");

-- CreateIndex
CREATE INDEX "Setting_companyId_idx" ON "Setting"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_companyId_key_key" ON "Setting"("companyId", "key");

-- CreateIndex
CREATE INDEX "Transaction_companyId_idx" ON "Transaction"("companyId");

-- CreateIndex
CREATE INDEX "Unit_companyId_idx" ON "Unit"("companyId");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE INDEX "Waste_companyId_idx" ON "Waste"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyAdmin" ADD CONSTRAINT "CompanyAdmin_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAdmin" ADD CONSTRAINT "CompanyAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
