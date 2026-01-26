import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateApprovalDto,
  ApproveRejectDto,
  QueryApprovalsDto,
  ApprovalStatus,
  ApprovalEntityType,
} from './approval.dto';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Request approval for an entity
   */
  async requestApproval(dto: CreateApprovalDto) {
    // Check if entity exists and is in correct state
    await this.validateEntityForApproval(dto.entityType, dto.entityId);

    // Create approval request
    const approval = await this.prisma.approval.create({
      data: {
        entityType: dto.entityType,
        entityId: dto.entityId,
        tenantId: dto.tenantId,
        requesterId: dto.requesterId,
        approverId: dto.approverId,
        status: ApprovalStatus.PENDING,
        level: dto.level || 1,
        comments: dto.comments,
      },
    });

    // Update entity approval status
    await this.updateEntityApprovalStatus(
      dto.entityType,
      dto.entityId,
      ApprovalStatus.PENDING,
      approval.id,
    );

    return approval;
  }

  /**
   * Approve a request
   */
  async approve(approvalId: string, dto: ApproveRejectDto) {
    const approval = await this.prisma.approval.findUnique({
      where: { id: approvalId },
    });

    if (!approval) {
      throw new NotFoundException('Approval request not found');
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Approval request is not pending');
    }

    // Update approval
    const updated = await this.prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: ApprovalStatus.APPROVED,
        approverId: dto.approverId,
        respondedAt: new Date(),
        comments: dto.comments || approval.comments,
      },
    });

    // Update entity approval status
    await this.updateEntityApprovalStatus(
      approval.entityType as ApprovalEntityType,
      approval.entityId,
      ApprovalStatus.APPROVED,
      approval.id,
    );

    // Lock the entity
    await this.lockEntity(
      approval.entityType as ApprovalEntityType,
      approval.entityId,
      dto.approverId,
    );

    return updated;
  }

  /**
   * Reject a request
   */
  async reject(approvalId: string, dto: ApproveRejectDto) {
    const approval = await this.prisma.approval.findUnique({
      where: { id: approvalId },
    });

    if (!approval) {
      throw new NotFoundException('Approval request not found');
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Approval request is not pending');
    }

    // Update approval
    const updated = await this.prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: ApprovalStatus.REJECTED,
        approverId: dto.approverId,
        respondedAt: new Date(),
        comments: dto.comments || approval.comments,
      },
    });

    // Update entity approval status
    await this.updateEntityApprovalStatus(
      approval.entityType as ApprovalEntityType,
      approval.entityId,
      ApprovalStatus.REJECTED,
      approval.id,
    );

    return updated;
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals(query: QueryApprovalsDto) {
    const where: any = {};

    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.status) where.status = query.status;
    if (query.entityType) where.entityType = query.entityType;
    if (query.requesterId) where.requesterId = query.requesterId;
    if (query.approverId) where.approverId = query.approverId;

    return this.prisma.approval.findMany({
      where,
      orderBy: { requestedAt: 'desc' },
    });
  }

  /**
   * Get approval history for an entity
   */
  async getEntityApprovalHistory(entityType: string, entityId: string) {
    return this.prisma.approval.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  /**
   * Check if entity can be edited
   */
  async canEdit(entityType: ApprovalEntityType, entityId: string, userId: string): Promise<boolean> {
    const entity = await this.getEntity(entityType, entityId);

    if (!entity) return false;

    // If approved and locked, only allow with special permission
    if (entity.approvalStatus === ApprovalStatus.APPROVED && entity.lockedAt) {
      // Check if user has unlock permission (implement permission check)
      return false;
    }

    // If draft or rejected, allow edit
    if (entity.approvalStatus === 'draft' || entity.approvalStatus === ApprovalStatus.REJECTED) {
      return true;
    }

    // If pending approval, only creator can edit
    if (entity.approvalStatus === ApprovalStatus.PENDING) {
      return entity.userId === userId || entity.requesterId === userId;
    }

    return false;
  }

  /**
   * Unlock an entity (Admin only)
   */
  async unlockEntity(entityType: ApprovalEntityType, entityId: string, userId: string) {
    const updateData = {
      lockedAt: null,
      lockedBy: null,
    };

    await this.updateEntity(entityType, entityId, updateData);

    // TODO: Log audit event
    return { success: true, message: 'Entity unlocked successfully' };
  }

  // Private helpers

  private async validateEntityForApproval(entityType: ApprovalEntityType, entityId: string) {
    const entity = await this.getEntity(entityType, entityId);

    if (!entity) {
      throw new NotFoundException(`${entityType} not found`);
    }

    if (entity.approvalStatus === ApprovalStatus.PENDING) {
      throw new BadRequestException('Entity is already pending approval');
    }

    if (entity.approvalStatus === ApprovalStatus.APPROVED) {
      throw new BadRequestException('Entity is already approved');
    }
  }

  private async updateEntityApprovalStatus(
    entityType: ApprovalEntityType,
    entityId: string,
    status: ApprovalStatus,
    approvalId: string,
  ) {
    const updateData = {
      approvalStatus: status,
      approvalId: approvalId,
    };

    await this.updateEntity(entityType, entityId, updateData);
  }

  private async lockEntity(entityType: ApprovalEntityType, entityId: string, userId: string) {
    const updateData = {
      lockedAt: new Date(),
      lockedBy: userId,
    };

    await this.updateEntity(entityType, entityId, updateData);
  }

  private async getEntity(entityType: ApprovalEntityType, entityId: string) {
    switch (entityType) {
      case ApprovalEntityType.PURCHASE_ORDER:
        return this.prisma.purchase.findUnique({ where: { id: entityId } });
      case ApprovalEntityType.SALE_ORDER:
        return this.prisma.sale.findUnique({ where: { id: entityId } });
      case ApprovalEntityType.PRODUCTION:
        return this.prisma.production.findUnique({ where: { id: entityId } });
      default:
        return null;
    }
  }

  private async updateEntity(entityType: ApprovalEntityType, entityId: string, data: any) {
    switch (entityType) {
      case ApprovalEntityType.PURCHASE_ORDER:
        return this.prisma.purchase.update({ where: { id: entityId }, data });
      case ApprovalEntityType.SALE_ORDER:
        return this.prisma.sale.update({ where: { id: entityId }, data });
      case ApprovalEntityType.PRODUCTION:
        return this.prisma.production.update({ where: { id: entityId }, data });
      default:
        throw new BadRequestException('Invalid entity type');
    }
  }
}
