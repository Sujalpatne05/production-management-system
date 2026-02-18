-- Revert attendance, payroll, and expense changes
-- Drop tables created today
DROP TABLE IF EXISTS "Attendance" CASCADE;
DROP TABLE IF EXISTS "Leave" CASCADE;
DROP TABLE IF EXISTS "Payroll" CASCADE;
DROP TABLE IF EXISTS "EmployeeSalaryStructure" CASCADE;

-- Revert Expense table changes (restore to original schema)
ALTER TABLE "Expense" 
  DROP COLUMN IF EXISTS "date",
  DROP COLUMN IF EXISTS "vendor",
  DROP COLUMN IF EXISTS "invoiceNumber",
  DROP COLUMN IF EXISTS "paymentMethod",
  DROP COLUMN IF EXISTS "reference",
  DROP COLUMN IF EXISTS "notes",
  DROP COLUMN IF EXISTS "createdBy",
  ADD COLUMN IF NOT EXISTS "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "description" DROP NOT NULL,
  ALTER COLUMN "status" SET DEFAULT 'draft';

-- Revert ExpenseCategory changes
ALTER TABLE "ExpenseCategory"
  DROP CONSTRAINT IF EXISTS "ExpenseCategory_tenantId_fkey",
  DROP COLUMN IF EXISTS "tenantId",
  DROP COLUMN IF EXISTS "code",
  DROP COLUMN IF EXISTS "updatedAt";

-- Drop indexes
DROP INDEX IF EXISTS "Expense_date_idx";
DROP INDEX IF EXISTS "ExpenseCategory_tenantId_idx";
