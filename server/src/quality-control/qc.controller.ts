import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { QcService, CreateQcTemplateDto, CreateQcInspectionDto } from './qc.service';

@Controller('api/qc')
export class QcController {
  constructor(private qcService: QcService) {}

  @Post('templates')
  async createTemplate(@Request() req, @Body() data: CreateQcTemplateDto) {
    return this.qcService.createTemplate(req.user.tenantId, data);
  }

  @Get('templates')
  async getTemplates(@Request() req) {
    return this.qcService.getTemplates(req.user.tenantId);
  }

  @Get('templates/:id')
  async getTemplateById(@Request() req, @Param('id') id: string) {
    return this.qcService.getTemplateById(req.user.tenantId, id);
  }

  @Post('inspections')
  async createInspection(@Request() req, @Body() data: CreateQcInspectionDto) {
    return this.qcService.createInspection(req.user.tenantId, data);
  }

  @Get('inspections')
  async getInspections(@Request() req) {
    return this.qcService.getInspections(req.user.tenantId);
  }

  @Get('inspections/:id')
  async getInspectionById(@Request() req, @Param('id') id: string) {
    return this.qcService.getInspectionById(req.user.tenantId, id);
  }

  @Post('non-conformance')
  async createNonConformance(
    @Request() req,
    @Body() data: { description: string; severity: string },
  ) {
    return this.qcService.createNonConformance(req.user.tenantId, data.description, data.severity);
  }

  @Get('non-conformance')
  async getNonConformanceReports(@Request() req) {
    return this.qcService.getNonConformanceReports(req.user.tenantId);
  }

  @Put('non-conformance/:id')
  async updateNonConformance(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.qcService.updateNonConformance(req.user.tenantId, id, data);
  }

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.qcService.getQcDashboard(req.user.tenantId);
  }
}
