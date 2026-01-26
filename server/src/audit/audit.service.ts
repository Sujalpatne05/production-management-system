import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  UNLOCK = 'unlock',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PERIOD_CLOSE = 'period_close',
  PERIOD_REOPEN = 'period_reopen',
}

export interface AuditLogEntry {
  userId?: string;
  tenantId?: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit event
   */
  async log(entry: AuditLogEntry) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId,
          tenantId: entry.tenantId,
          entityType: entry.entityType,
          entityId: entry.entityId,
          action: entry.action,
          oldValue: entry.oldValue || null,
          newValue: entry.newValue || null,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
        },
      });
    } catch (error) {
      // Don't throw - audit logging shouldn't break the main flow
      console.error('Audit logging error:', error);
    }
  }

  /**
   * Get audit logs with filters
   */
  async getLogs(filters: {
    tenantId?: string;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.tenantId) where.tenantId = filters.tenantId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.action) where.action = filters.action;

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.gte = filters.startDate;
      if (filters.endDate) where.timestamp.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }

  /**
   * Get audit history for a specific entity
   */
  async getEntityHistory(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Get audit statistics
   */
  async getStats(tenantId?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;

    const [totalLogs, actionCounts, userActivity] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['userId'],
        where,
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalLogs,
      actionCounts,
      topUsers: userActivity,
    };
  }

  /**
   * Export audit logs (for compliance)
   */
  async exportLogs(filters: {
    tenantId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters.tenantId) where.tenantId = filters.tenantId;

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.gte = filters.startDate;
      if (filters.endDate) where.timestamp.lte = filters.endDate;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Clean up old audit logs (for retention policy)
   */
  async cleanupOldLogs(retentionDays: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });

    return { deleted: result.count };
  }
}
