import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import {
  CreateApprovalDto,
  ApproveRejectDto,
  QueryApprovalsDto,
  ApprovalEntityType,
} from './approval.dto';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  /**
   * Request approval for an entity
   * POST /api/approvals/request
   */
  @Post('request')
  async requestApproval(@Body() dto: CreateApprovalDto) {
    return this.approvalsService.requestApproval(dto);
  }

  /**
   * Approve a request
   * POST /api/approvals/:approvalId/approve
   */
  @Post(':approvalId/approve')
  async approve(
    @Param('approvalId') approvalId: string,
    @Body() dto: ApproveRejectDto,
  ) {
    return this.approvalsService.approve(approvalId, dto);
  }

  /**
   * Reject a request
   * POST /api/approvals/:approvalId/reject
   */
  @Post(':approvalId/reject')
  async reject(
    @Param('approvalId') approvalId: string,
    @Body() dto: ApproveRejectDto,
  ) {
    return this.approvalsService.reject(approvalId, dto);
  }

  /**
   * Get pending approvals
   * GET /api/approvals/pending
   */
  @Get('pending')
  async getPendingApprovals(@Query() query: QueryApprovalsDto) {
    return this.approvalsService.getPendingApprovals(query);
  }

  /**
   * Get approval history for an entity
   * GET /api/approvals/history/:entityType/:entityId
   */
  @Get('history/:entityType/:entityId')
  async getEntityApprovalHistory(
    @Param('entityType') entityType: ApprovalEntityType,
    @Param('entityId') entityId: string,
  ) {
    return this.approvalsService.getEntityApprovalHistory(entityType, entityId);
  }

  /**
   * Unlock an entity (Admin only)
   * POST /api/approvals/unlock/:entityType/:entityId
   */
  @Post('unlock/:entityType/:entityId')
  async unlockEntity(
    @Param('entityType') entityType: ApprovalEntityType,
    @Param('entityId') entityId: string,
    @Body('userId') userId: string,
  ) {
    return this.approvalsService.unlockEntity(entityType, entityId, userId);
  }

  /**
   * Check if entity can be edited
   * GET /api/approvals/can-edit/:entityType/:entityId
   */
  @Get('can-edit/:entityType/:entityId')
  async canEdit(
    @Param('entityType') entityType: ApprovalEntityType,
    @Param('entityId') entityId: string,
    @Query('userId') userId: string,
  ) {
    const canEdit = await this.approvalsService.canEdit(entityType, entityId, userId);
    return { canEdit };
  }
}
