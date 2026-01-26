import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTenantSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get tenant settings (creates default if not exists)
   */
  async getSettings(tenantId: string) {
    let settings = await this.prisma.tenantSettings.findUnique({
      where: { tenantId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await this.prisma.tenantSettings.create({
        data: { tenantId },
      });
    }

    return settings;
  }

  /**
   * Update tenant settings
   */
  async updateSettings(tenantId: string, data: UpdateTenantSettingsDto) {
    // Ensure settings exist
    await this.getSettings(tenantId);

    return this.prisma.tenantSettings.update({
      where: { tenantId },
      data,
    });
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(tenantId: string) {
    await this.prisma.tenantSettings.delete({
      where: { tenantId },
    });

    return this.prisma.tenantSettings.create({
      data: { tenantId },
    });
  }

  /**
   * Check if negative stock is allowed
   */
  async canHaveNegativeStock(tenantId: string): Promise<boolean> {
    const settings = await this.getSettings(tenantId);
    return !settings.preventNegativeStock;
  }

  /**
   * Check if duplicate invoice is allowed
   */
  async canHaveDuplicateInvoice(tenantId: string): Promise<boolean> {
    const settings = await this.getSettings(tenantId);
    return !settings.preventDuplicateInvoice;
  }

  /**
   * Check if approval is required for sales
   */
  async requiresSalesApproval(tenantId: string, amount: number): Promise<boolean> {
    const settings = await this.getSettings(tenantId);
    
    if (!settings.requireApprovalForSales) {
      return false;
    }

    if (!settings.salesApprovalThreshold) {
      return true; // Require approval for all if threshold not set
    }

    return amount >= Number(settings.salesApprovalThreshold);
  }

  /**
   * Check if approval is required for purchases
   */
  async requiresPurchaseApproval(tenantId: string, amount: number): Promise<boolean> {
    const settings = await this.getSettings(tenantId);
    
    if (!settings.requireApprovalForPurchases) {
      return false;
    }

    if (!settings.purchaseApprovalThreshold) {
      return true; // Require approval for all if threshold not set
    }

    return amount >= Number(settings.purchaseApprovalThreshold);
  }

  /**
   * Get next invoice number
   */
  async getNextInvoiceNumber(tenantId: string): Promise<string> {
    const settings = await this.getSettings(tenantId);
    
    // Get the latest sale to determine next number
    const latestSale = await this.prisma.sale.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    let nextNumber = 1;
    if (latestSale?.invoiceNo) {
      // Extract number from invoice (e.g., "INV000001" -> 1)
      const match = latestSale.invoiceNo.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0]) + 1;
      }
    }

    const paddedNumber = String(nextNumber).padStart(settings.invoiceNumberLength, '0');
    return `${settings.invoicePrefix}${paddedNumber}`;
  }

  /**
   * Get next purchase order number
   */
  async getNextPurchaseOrderNumber(tenantId: string): Promise<string> {
    const settings = await this.getSettings(tenantId);
    
    // Get the latest purchase to determine next number
    const latestPurchase = await this.prisma.purchase.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    let nextNumber = 1;
    if (latestPurchase?.poNo) {
      // Extract number from PO (e.g., "PO000001" -> 1)
      const match = latestPurchase.poNo.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0]) + 1;
      }
    }

    const paddedNumber = String(nextNumber).padStart(settings.poNumberLength, '0');
    return `${settings.purchaseOrderPrefix}${paddedNumber}`;
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(tenantId: string, feature: string): Promise<boolean> {
    const settings = await this.getSettings(tenantId);
    
    const featureMap = {
      'advanced-reporting': settings.enableAdvancedReporting,
      'multi-warehouse': settings.enableMultiWarehouse,
      'project-tracking': settings.enableProjectTracking,
      'manufacturing': settings.enableManufacturing,
      'ecommerce': settings.enableEcommerce,
    };

    return featureMap[feature] ?? false;
  }

  /**
   * Get currency formatting info
   */
  async getCurrencyFormat(tenantId: string) {
    const settings = await this.getSettings(tenantId);
    
    return {
      currency: settings.currency,
      symbol: settings.currencySymbol,
      decimalPlaces: settings.decimalPrecision,
      format: (amount: number) => {
        return `${settings.currencySymbol}${amount.toFixed(settings.decimalPrecision)}`;
      },
    };
  }
}
