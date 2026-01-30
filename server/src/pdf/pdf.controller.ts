import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pdf')
@UseGuards(JwtAuthGuard)
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  /**
   * Generate Invoice PDF
   * GET /api/pdf/invoice/:saleId
   */
  @Get('invoice/:saleId')
  async generateInvoice(
    @Param('saleId') saleId: string,
    @Res() res: Response,
  ) {
    try {
      const html = await this.pdfService.generateInvoice(saleId);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="invoice-${saleId}.html"`,
      );
      res.send(html);
    } catch (error) {
      res.status(404).json({
        message: error.message || 'Failed to generate invoice',
      });
    }
  }

  /**
   * Generate Purchase Order PDF
   * GET /api/pdf/purchase-order/:purchaseId
   */
  @Get('purchase-order/:purchaseId')
  async generatePurchaseOrder(
    @Param('purchaseId') purchaseId: string,
    @Res() res: Response,
  ) {
    try {
      const html = await this.pdfService.generatePurchaseOrder(purchaseId);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="po-${purchaseId}.html"`,
      );
      res.send(html);
    } catch (error) {
      res.status(404).json({
        message: error.message || 'Failed to generate purchase order',
      });
    }
  }

  /**
   * Generate Delivery Challan PDF
   * GET /api/pdf/delivery-challan/:orderId
   */
  @Get('delivery-challan/:orderId')
  async generateDeliveryChallan(
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    try {
      const html = await this.pdfService.generateDeliveryChallan(orderId);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="challan-${orderId}.html"`,
      );
      res.send(html);
    } catch (error) {
      res.status(404).json({
        message: error.message || 'Failed to generate delivery challan',
      });
    }
  }

  /**
   * Generate Production Report PDF
   * GET /api/pdf/production-report/:productionId
   */
  @Get('production-report/:productionId')
  async generateProductionReport(
    @Param('productionId') productionId: string,
    @Res() res: Response,
  ) {
    try {
      const html = await this.pdfService.generateProductionReport(productionId);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="production-${productionId}.html"`,
      );
      res.send(html);
    } catch (error) {
      res.status(404).json({
        message: error.message || 'Failed to generate production report',
      });
    }
  }

  /**
   * Generate Financial Statement PDF
   * GET /api/pdf/financial-statement?type=trial-balance&startDate=...&endDate=...
   */
  @Get('financial-statement')
  async generateFinancialStatement(
    @Query('type') type: 'trial-balance' | 'balance-sheet' | 'profit-loss',
    @Query('tenantId') tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    try {
      const html = await this.pdfService.generateFinancialStatement(
        type,
        tenantId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      );
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${type}-${tenantId}.html"`,
      );
      res.send(html);
    } catch (error) {
      res.status(404).json({
        message: error.message || 'Failed to generate financial statement',
      });
    }
  }

  /**
   * Email PDF documents
   * POST /api/pdf/email
   * Body: { type: 'invoice', id: '...', email: 'customer@example.com' }
   */
  @Post('email')
  async emailPDF(
    @Param('type') type: string,
    @Param('id') id: string,
    @Param('email') email: string,
  ) {
    // TODO: Implement email functionality
    return {
      message: 'Email functionality will be implemented',
      type,
      id,
      email,
    };
  }
}
