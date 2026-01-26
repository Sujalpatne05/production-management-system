import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ValidationService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  /**
   * Validate stock availability
   */
  async validateStock(
    tenantId: string,
    productId: string,
    quantity: number,
  ): Promise<{ valid: boolean; message?: string; currentStock?: number }> {
    // Check if negative stock is allowed
    const canGoNegative = await this.settingsService.canHaveNegativeStock(tenantId);

    // Get current stock
    const stock = await this.prisma.stock.findFirst({
      where: {
        tenantId,
        productId,
      },
    });

    const currentStock = stock?.quantity || 0;
    const afterTransaction = currentStock - quantity;

    if (!canGoNegative && afterTransaction < 0) {
      return {
        valid: false,
        message: `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}`,
        currentStock,
      };
    }

    // Warning if stock is low (even if negative allowed)
    if (afterTransaction < 0) {
      return {
        valid: true,
        message: `Warning: Stock will become negative (${afterTransaction})`,
        currentStock,
      };
    }

    return { valid: true, currentStock };
  }

  /**
   * Validate duplicate invoice number
   */
  async validateInvoiceNumber(
    tenantId: string,
    invoiceNo: string,
    excludeSaleId?: string,
  ): Promise<{ valid: boolean; message?: string }> {
    const settings = await this.settingsService.getSettings(tenantId);

    if (!settings.preventDuplicateInvoice) {
      return { valid: true };
    }

    const where: any = {
      tenantId,
      invoiceNo,
    };

    if (excludeSaleId) {
      where.id = { not: excludeSaleId };
    }

    const existingSale = await this.prisma.sale.findFirst({ where });

    if (existingSale) {
      return {
        valid: false,
        message: `Invoice number ${invoiceNo} already exists`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate duplicate purchase order number
   */
  async validatePurchaseOrderNumber(
    tenantId: string,
    poNo: string,
    excludePurchaseId?: string,
  ): Promise<{ valid: boolean; message?: string }> {
    const where: any = {
      tenantId,
      poNo,
    };

    if (excludePurchaseId) {
      where.id = { not: excludePurchaseId };
    }

    const existingPurchase = await this.prisma.purchase.findFirst({ where });

    if (existingPurchase) {
      return {
        valid: false,
        message: `Purchase order ${poNo} already exists`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate if record can be deleted (check references)
   */
  async canDelete(
    entityType: 'product' | 'customer' | 'supplier' | 'account',
    entityId: string,
    tenantId: string,
  ): Promise<{ canDelete: boolean; message?: string; references?: string[] }> {
    const references: string[] = [];

    switch (entityType) {
      case 'product':
        // Check sales
        const salesCount = await this.prisma.saleItem.count({
          where: { productId: entityId },
        });
        if (salesCount > 0) references.push(`${salesCount} sale(s)`);

        // Check orders
        const ordersCount = await this.prisma.orderItem.count({
          where: { productId: entityId },
        });
        if (ordersCount > 0) references.push(`${ordersCount} order(s)`);

        // Check production
        const productionCount = await this.prisma.production.count({
          where: { productId: entityId },
        });
        if (productionCount > 0) references.push(`${productionCount} production run(s)`);
        break;

      case 'customer':
        const customerSales = await this.prisma.sale.count({
          where: { customerId: entityId },
        });
        if (customerSales > 0) references.push(`${customerSales} sale(s)`);
        break;

      case 'supplier':
        const supplierPurchases = await this.prisma.purchase.count({
          where: { supplierId: entityId },
        });
        if (supplierPurchases > 0) references.push(`${supplierPurchases} purchase(s)`);
        break;

      case 'account':
        const accountTransactions = await this.prisma.accountingTransaction.count({
          where: {
            OR: [
              { debitAccountId: entityId },
              { creditAccountId: entityId },
            ],
          },
        });
        if (accountTransactions > 0) references.push(`${accountTransactions} transaction(s)`);
        break;
    }

    if (references.length > 0) {
      return {
        canDelete: false,
        message: `Cannot delete: Referenced in ${references.join(', ')}`,
        references,
      };
    }

    return { canDelete: true };
  }

  /**
   * Validate date is not in closed accounting period
   */
  async validateDateNotInClosedPeriod(
    tenantId: string,
    date: Date,
  ): Promise<{ valid: boolean; message?: string }> {
    const settings = await this.settingsService.getSettings(tenantId);

    if (!settings.lockPastPeriods) {
      return { valid: true };
    }

    const closedPeriod = await this.prisma.accountingPeriod.findFirst({
      where: {
        tenantId,
        status: 'closed',
        startDate: { lte: date },
        endDate: { gte: date },
      },
    });

    if (closedPeriod) {
      return {
        valid: false,
        message: `Date falls within closed accounting period: ${closedPeriod.name}`,
      };
    }

    return { valid: true };
  }

  /**
   * Batch validation for multiple items
   */
  async validateMultipleStockItems(
    tenantId: string,
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<{
    valid: boolean;
    errors: Array<{ productId: string; message: string }>;
  }> {
    const errors: Array<{ productId: string; message: string }> = [];

    for (const item of items) {
      const validation = await this.validateStock(
        tenantId,
        item.productId,
        item.quantity,
      );

      if (!validation.valid) {
        errors.push({
          productId: item.productId,
          message: validation.message || 'Stock validation failed',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
