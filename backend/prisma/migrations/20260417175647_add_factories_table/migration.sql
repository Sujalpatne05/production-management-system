-- CreateTable
CREATE TABLE "Factory" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "manager" TEXT,
    "employees" INTEGER NOT NULL DEFAULT 0,
    "productionLines" INTEGER NOT NULL DEFAULT 0,
    "storageCapacity" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "storageUsed" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "efficiency" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Factory_companyId_idx" ON "Factory"("companyId");

-- CreateIndex
CREATE INDEX "Factory_type_idx" ON "Factory"("type");
