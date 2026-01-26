import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateTenantSettingsDto } from './settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Get tenant settings
   * GET /api/settings
   */
  @Get()
  async getSettings(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.settingsService.getSettings(tenantId);
  }

  /**
   * Update tenant settings
   * PUT /api/settings
   */
  @Put()
  async updateSettings(@Req() req: any, @Body() data: UpdateTenantSettingsDto) {
    const tenantId = req.user?.tenantId;
    return this.settingsService.updateSettings(tenantId, data);
  }

  /**
   * Reset settings to defaults
   * POST /api/settings/reset
   */
  @Post('reset')
  async resetSettings(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.settingsService.resetSettings(tenantId);
  }

  /**
   * Get next invoice number
   * GET /api/settings/next-invoice-number
   */
  @Get('next-invoice-number')
  async getNextInvoiceNumber(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    const invoiceNo = await this.settingsService.getNextInvoiceNumber(tenantId);
    return { invoiceNo };
  }

  /**
   * Get next purchase order number
   * GET /api/settings/next-po-number
   */
  @Get('next-po-number')
  async getNextPurchaseOrderNumber(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    const poNo = await this.settingsService.getNextPurchaseOrderNumber(tenantId);
    return { poNo };
  }

  /**
   * Check if a feature is enabled
   * GET /api/settings/feature/:feature
   */
  @Get('feature/:feature')
  async isFeatureEnabled(@Req() req: any, @Param('feature') feature: string) {
    const tenantId = req.user?.tenantId;
    const enabled = await this.settingsService.isFeatureEnabled(tenantId, feature);
    return { feature, enabled };
  }

  /**
   * Get currency formatting info
   * GET /api/settings/currency-format
   */
  @Get('currency-format')
  async getCurrencyFormat(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.settingsService.getCurrencyFormat(tenantId);
  }
}
