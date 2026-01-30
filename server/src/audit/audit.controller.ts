import {
  Controller,
  Get,
  Query,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { AuditService, AuditAction } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Get audit logs with filters
   * GET /api/audit
   */
  @Get()
  async getLogs(
    @Query('tenantId') tenantId?: string,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('action') action?: AuditAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.auditService.getLogs({
      tenantId,
      userId,
      entityType,
      entityId,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  /**
   * Get entity audit history
   * GET /api/audit/entity/:entityType/:entityId
   */
  @Get('entity/:entityType/:entityId')
  async getEntityHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.getEntityHistory(entityType, entityId);
  }

  /**
   * Get audit statistics
   * GET /api/audit/stats
   */
  @Get('stats')
  async getStats(@Query('tenantId') tenantId?: string) {
    return this.auditService.getStats(tenantId);
  }

  /**
   * Export audit logs
   * GET /api/audit/export
   */
  @Get('export')
  async exportLogs(
    @Query('tenantId') tenantId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditService.exportLogs({
      tenantId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  /**
   * Cleanup old logs (Admin only)
   * DELETE /api/audit/cleanup/:retentionDays
   */
  @Delete('cleanup/:retentionDays')
  async cleanupOldLogs(@Param('retentionDays') retentionDays: string) {
    return this.auditService.cleanupOldLogs(parseInt(retentionDays));
  }
}
