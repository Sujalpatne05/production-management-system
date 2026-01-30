import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PDFOptions {
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

export interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  taxId?: string;
  website?: string;
}

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate Invoice PDF
   */
  async generateInvoice(saleId: string): Promise<string> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        tenant: true,
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    const html = this.generateInvoiceHTML(sale);
    return html; // In production, convert HTML to PDF using puppeteer or similar
  }

  /**
   * Generate Purchase Order PDF
   */
  async generatePurchaseOrder(purchaseId: string): Promise<string> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        tenant: true,
        supplier: true,
        user: true,
        items: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    const html = this.generatePurchaseOrderHTML(purchase);
    return html;
  }

  /**
   * Generate Delivery Challan PDF
   */
  async generateDeliveryChallan(orderId: string): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tenant: true,
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const html = this.generateDeliveryChallanHTML(order);
    return html;
  }

  /**
   * Generate Production Report PDF
   */
  async generateProductionReport(productionId: string): Promise<string> {
    const production = await this.prisma.production.findUnique({
      where: { id: productionId },
      include: {
        tenant: true,
        product: true,
        user: true,
        losses: true,
        stageTransitions: true,
      },
    });

    if (!production) {
      throw new Error('Production not found');
    }

    const html = this.generateProductionReportHTML(production);
    return html;
  }

  /**
   * Generate Financial Statement PDF
   */
  async generateFinancialStatement(
    type: 'trial-balance' | 'balance-sheet' | 'profit-loss',
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<string> {
    // Fetch financial data based on type
    let data: any;

    switch (type) {
      case 'trial-balance':
        data = await this.getTrialBalanceData(tenantId, startDate, endDate);
        break;
      case 'balance-sheet':
        data = await this.getBalanceSheetData(tenantId, endDate);
        break;
      case 'profit-loss':
        data = await this.getProfitLossData(tenantId, startDate, endDate);
        break;
    }

    const html = this.generateFinancialStatementHTML(type, data);
    return html;
  }

  // HTML Generation Methods

  private generateInvoiceHTML(sale: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${sale.invoiceNo}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .company-info { flex: 1; }
    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .invoice-title { flex: 1; text-align: right; }
    .invoice-number { font-size: 28px; font-weight: bold; color: #2563eb; }
    .invoice-date { color: #666; }
    .parties { display: flex; gap: 40px; margin: 30px 0; }
    .party { flex: 1; }
    .party-title { font-weight: bold; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .text-right { text-align: right; }
    .totals { margin-top: 20px; float: right; width: 300px; }
    .totals table { margin: 0; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    .terms { margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <div class="company-name">${sale.tenant.name}</div>
      <div>Tax ID: ${sale.tenant.id}</div>
      <div>Email: info@${sale.tenant.name.toLowerCase().replace(/\s/g, '')}.com</div>
    </div>
    <div class="invoice-title">
      <div class="invoice-number">INVOICE</div>
      <div class="invoice-number">${sale.invoiceNo}</div>
      <div class="invoice-date">Date: ${new Date(sale.saleDate).toLocaleDateString()}</div>
      ${sale.dueDate ? `<div class="invoice-date">Due: ${new Date(sale.dueDate).toLocaleDateString()}</div>` : ''}
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-title">BILL TO:</div>
      <div><strong>${sale.customer.name}</strong></div>
      ${sale.customer.email ? `<div>${sale.customer.email}</div>` : ''}
      ${sale.customer.phone ? `<div>${sale.customer.phone}</div>` : ''}
      ${sale.customer.address ? `<div>${sale.customer.address}</div>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Discount</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${sale.items.map((item: any, index: number) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.product.name}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">$${Number(item.unitPrice).toFixed(2)}</td>
          <td class="text-right">$${Number(item.discount).toFixed(2)}</td>
          <td class="text-right">$${Number(item.amount).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td class="text-right">$${Number(sale.subtotal).toFixed(2)}</td>
      </tr>
      <tr>
        <td>Tax:</td>
        <td class="text-right">$${Number(sale.taxAmount).toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td>TOTAL:</td>
        <td class="text-right">$${Number(sale.total).toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <div style="clear: both;"></div>

  ${sale.notes ? `
  <div class="terms">
    <strong>Notes:</strong>
    <p>${sale.notes}</p>
  </div>
  ` : ''}

  <div class="terms">
    <strong>Payment Terms:</strong>
    <p>Payment is due within 30 days from the invoice date. Please make checks payable to ${sale.tenant.name}.</p>
  </div>

  <div class="footer">
    <div>Thank you for your business!</div>
    <div>This is a computer-generated invoice and does not require a signature.</div>
  </div>
</body>
</html>
    `;
  }

  private generatePurchaseOrderHTML(purchase: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Purchase Order ${purchase.poNo}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .company-info { flex: 1; }
    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .po-title { flex: 1; text-align: right; }
    .po-number { font-size: 28px; font-weight: bold; color: #16a34a; }
    .po-date { color: #666; }
    .parties { display: flex; gap: 40px; margin: 30px 0; }
    .party { flex: 1; }
    .party-title { font-weight: bold; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .text-right { text-align: right; }
    .totals { margin-top: 20px; float: right; width: 300px; }
    .totals table { margin: 0; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    .terms { margin-top: 30px; }
    .signature { margin-top: 60px; }
    .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 60px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <div class="company-name">${purchase.tenant.name}</div>
      <div>Tax ID: ${purchase.tenant.id}</div>
      <div>Email: info@${purchase.tenant.name.toLowerCase().replace(/\s/g, '')}.com</div>
    </div>
    <div class="po-title">
      <div class="po-number">PURCHASE ORDER</div>
      <div class="po-number">${purchase.poNo}</div>
      <div class="po-date">Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}</div>
      ${purchase.expectedDate ? `<div class="po-date">Expected: ${new Date(purchase.expectedDate).toLocaleDateString()}</div>` : ''}
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-title">VENDOR:</div>
      <div><strong>${purchase.supplier.name}</strong></div>
      ${purchase.supplier.email ? `<div>${purchase.supplier.email}</div>` : ''}
      ${purchase.supplier.phone ? `<div>${purchase.supplier.phone}</div>` : ''}
      ${purchase.supplier.address ? `<div>${purchase.supplier.address}</div>` : ''}
    </div>
    <div class="party">
      <div class="party-title">DELIVER TO:</div>
      <div><strong>${purchase.tenant.name}</strong></div>
      <div>Warehouse/Factory Address</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Item</th>
        <th>Specifications</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${purchase.items.map((item: any, index: number) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.rawMaterial.name}</td>
          <td>${item.rawMaterial.unit || 'N/A'}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">$${Number(item.unitPrice).toFixed(2)}</td>
          <td class="text-right">$${Number(item.amount).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td class="text-right">$${Number(purchase.subtotal).toFixed(2)}</td>
      </tr>
      <tr>
        <td>Tax:</td>
        <td class="text-right">$${Number(purchase.taxAmount).toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td>TOTAL:</td>
        <td class="text-right">$${Number(purchase.total).toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <div style="clear: both;"></div>

  ${purchase.notes ? `
  <div class="terms">
    <strong>Special Instructions:</strong>
    <p>${purchase.notes}</p>
  </div>
  ` : ''}

  <div class="terms">
    <strong>Terms & Conditions:</strong>
    <p>1. Please confirm receipt of this PO within 24 hours.</p>
    <p>2. Deliver items by the expected date mentioned above.</p>
    <p>3. Invoice should reference this PO number.</p>
    <p>4. Payment terms as per agreement.</p>
  </div>

  <div class="signature">
    <div>Authorized Signature:</div>
    <div class="signature-line"></div>
    <div>${purchase.user?.fullName || 'Authorized Person'}</div>
    <div>${new Date().toLocaleDateString()}</div>
  </div>

  <div class="footer">
    <div>This is a system-generated Purchase Order.</div>
  </div>
</body>
</html>
    `;
  }

  private generateDeliveryChallanHTML(order: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Delivery Challan ${order.orderNo}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .title { font-size: 28px; font-weight: bold; }
    .challan-no { font-size: 20px; color: #ea580c; margin-top: 10px; }
    .parties { display: flex; gap: 40px; margin: 30px 0; }
    .party { flex: 1; }
    .party-title { font-weight: bold; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature { text-align: center; }
    .signature-line { border-top: 1px solid #333; width: 200px; margin: 60px auto 10px; }
    .barcode { text-align: center; margin: 30px 0; font-family: 'Courier New', monospace; font-size: 24px; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">DELIVERY CHALLAN</div>
    <div class="challan-no">Challan No: ${order.orderNo}</div>
    <div>Date: ${new Date(order.orderDate).toLocaleDateString()}</div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-title">FROM:</div>
      <div><strong>${order.tenant.name}</strong></div>
      <div>Warehouse/Factory Address</div>
    </div>
    <div class="party">
      <div class="party-title">TO:</div>
      <div><strong>Delivery Address</strong></div>
      <div>Will be specified on order</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th>Product Description</th>
        <th class="text-center">Quantity</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${order.orderItems?.map((item: any, index: number) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.product?.name || 'Product'}</td>
          <td class="text-center">${item.quantity}</td>
          <td></td>
        </tr>
      `).join('') || '<tr><td colspan="4" class="text-center">No items</td></tr>'}
    </tbody>
  </table>

  <div class="barcode">
    *${order.orderNo}*
  </div>

  <div><strong>Vehicle Details:</strong> _______________</div>
  <div><strong>Driver Name:</strong> _______________</div>
  <div><strong>Driver Phone:</strong> _______________</div>

  <div class="signature-section">
    <div class="signature">
      <div class="signature-line"></div>
      <div>Prepared By</div>
      <div>${order.user?.fullName || 'Staff'}</div>
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <div>Received By</div>
      <div>(Customer Signature)</div>
    </div>
  </div>

  <div class="footer">
    <div>This is a computer-generated document. No signature required from sender.</div>
    <div>For queries, contact: ${order.tenant.name}</div>
  </div>
</body>
</html>
    `;
  }

  private generateProductionReportHTML(production: any): string {
    const efficiency = production.completedQty / production.quantity * 100;
    const totalLosses = production.losses?.reduce((sum: number, loss: any) => sum + loss.quantity, 0) || 0;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Production Report ${production.referenceNo}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    .info-label { color: #666; font-size: 14px; }
    .info-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .section-title { font-size: 18px; font-weight: bold; margin: 30px 0 15px; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .status-completed { background-color: #dcfce7; color: #166534; }
    .status-in-progress { background-color: #fef3c7; color: #92400e; }
    .status-planned { background-color: #e0e7ff; color: #3730a3; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">PRODUCTION REPORT</div>
    <div>Reference: ${production.referenceNo}</div>
    <div>Product: ${production.product.name}</div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <div class="info-label">Planned Quantity</div>
      <div class="info-value">${production.quantity}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Completed Quantity</div>
      <div class="info-value">${production.completedQty}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Efficiency</div>
      <div class="info-value">${efficiency.toFixed(2)}%</div>
    </div>
    <div class="info-box">
      <div class="info-label">Status</div>
      <div class="info-value">
        <span class="status-badge status-${production.status}">${production.status.toUpperCase()}</span>
      </div>
    </div>
    <div class="info-box">
      <div class="info-label">Start Date</div>
      <div class="info-value">${production.startDate ? new Date(production.startDate).toLocaleDateString() : 'Not started'}</div>
    </div>
    <div class="info-box">
      <div class="info-label">End Date</div>
      <div class="info-value">${production.endDate ? new Date(production.endDate).toLocaleDateString() : 'In progress'}</div>
    </div>
  </div>

  ${production.stageTransitions && production.stageTransitions.length > 0 ? `
  <div class="section-title">Production Stages</div>
  <table>
    <thead>
      <tr>
        <th>Stage</th>
        <th>Status</th>
        <th>Started</th>
        <th>Completed</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${production.stageTransitions.map((stage: any) => `
        <tr>
          <td>${stage.stage}</td>
          <td><span class="status-badge status-${stage.status}">${stage.status}</span></td>
          <td>${stage.startedAt ? new Date(stage.startedAt).toLocaleDateString() : 'N/A'}</td>
          <td>${stage.completedAt ? new Date(stage.completedAt).toLocaleDateString() : 'N/A'}</td>
          <td>${stage.notes || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  ${production.losses && production.losses.length > 0 ? `
  <div class="section-title">Production Losses</div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Quantity Lost</th>
        <th>Reason</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${production.losses.map((loss: any) => `
        <tr>
          <td>${new Date(loss.createdAt).toLocaleDateString()}</td>
          <td>${loss.quantity}</td>
          <td>${loss.reason || 'Not specified'}</td>
          <td>${loss.notes || '-'}</td>
        </tr>
      `).join('')}
      <tr style="font-weight: bold;">
        <td>TOTAL LOSSES</td>
        <td>${totalLosses}</td>
        <td colspan="2"></td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <div style="margin-top: 40px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
    <strong>Summary:</strong>
    <p>Target: ${production.quantity} units | Completed: ${production.completedQty} units | Losses: ${totalLosses} units</p>
    <p>Overall Efficiency: ${efficiency.toFixed(2)}%</p>
  </div>

  <div style="margin-top: 60px; text-align: center; font-size: 12px; color: #666;">
    Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
  </div>
</body>
</html>
    `;
  }

  private generateFinancialStatementHTML(type: string, data: any): string {
    // Simplified implementation - expand as needed
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${type.replace(/-/g, ' ').toUpperCase()}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 24px; font-weight: bold; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .text-right { text-align: right; }
    .total-row { font-weight: bold; background-color: #f9fafb; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${type.replace(/-/g, ' ')}</div>
    <div>Generated on ${new Date().toLocaleDateString()}</div>
  </div>
  <div style="text-align: center; padding: 40px;">
    Financial statement data will be displayed here based on the type: ${type}
  </div>
</body>
</html>
    `;
  }

  // Helper methods for financial data
  private async getTrialBalanceData(tenantId: string, startDate?: Date, endDate?: Date) {
    // Implementation for trial balance data
    return {};
  }

  private async getBalanceSheetData(tenantId: string, endDate?: Date) {
    // Implementation for balance sheet data
    return {};
  }

  private async getProfitLossData(tenantId: string, startDate?: Date, endDate?: Date) {
    // Implementation for P&L data
    return {};
  }
}
