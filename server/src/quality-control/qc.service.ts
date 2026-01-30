import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateQcTemplateDto {
  name: string;
  description?: string;
  type: string; // 'incoming', 'inprocess', 'final'
  parameters: any[]; // JSON array of test parameters
}

export class CreateQcInspectionDto {
  templateId: string;
  productionId?: string;
  purchaseId?: string;
  saleId?: string;
  batchNo?: string;
  results: any; // JSON object with test results
  passedQuantity: number;
  rejectedQuantity?: number;
  defectNotes?: string;
}

@Injectable()
export class QcService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(tenantId: string, data: CreateQcTemplateDto) {
    return this.prisma.qCTemplate.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async getTemplates(tenantId: string) {
    return this.prisma.qCTemplate.findMany({
      where: { tenantId },
      include: { inspections: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTemplateById(tenantId: string, templateId: string) {
    return this.prisma.qCTemplate.findFirst({
      where: { tenantId, id: templateId },
      include: { inspections: true },
    });
  }

  async createInspection(tenantId: string, data: CreateQcInspectionDto) {
    const template = await this.prisma.qCTemplate.findFirst({
      where: { tenantId, id: data.templateId },
    });

    if (!template) throw new Error('Template not found');

    // Determine status based on results
    const results = data.results;
    const allTestsPassed = Object.values(results).every((r: any) => r.passed === true);
    const status = allTestsPassed ? 'passed' : 'failed';
    const defectCount = Object.values(results).filter((r: any) => r.passed === false).length;

    return this.prisma.qCInspection.create({
      data: {
        tenantId,
        templateId: data.templateId,
        productionId: data.productionId,
        purchaseId: data.purchaseId,
        saleId: data.saleId,
        batchNo: data.batchNo,
        results: data.results,
        passedQuantity: data.passedQuantity,
        rejectedQuantity: data.rejectedQuantity || 0,
        defectCount,
        defectNotes: data.defectNotes,
        status,
      },
      include: { template: true },
    });
  }

  async getInspections(tenantId: string) {
    return this.prisma.qCInspection.findMany({
      where: { tenantId },
      include: { template: true, nonConformance: true },
      orderBy: { inspectionDate: 'desc' },
    });
  }

  async getInspectionById(tenantId: string, inspectionId: string) {
    return this.prisma.qCInspection.findFirst({
      where: { tenantId, id: inspectionId },
      include: { template: true, nonConformance: true },
    });
  }

  async createNonConformance(tenantId: string, description: string, severity: string) {
    // Generate report number
    const lastReport = await this.prisma.nonConformanceReport.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { reportNo: true },
    });

    let reportNo = 'NCR-001';
    if (lastReport?.reportNo) {
      const lastNum = parseInt(lastReport.reportNo.split('-')[1]) || 0;
      reportNo = `NCR-${String(lastNum + 1).padStart(3, '0')}`;
    }

    return this.prisma.nonConformanceReport.create({
      data: {
        tenantId,
        reportNo,
        description,
        severity,
        status: 'open',
      },
    });
  }

  async getNonConformanceReports(tenantId: string) {
    return this.prisma.nonConformanceReport.findMany({
      where: { tenantId },
      include: { inspections: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateNonConformance(tenantId: string, reportId: string, data: any) {
    return this.prisma.nonConformanceReport.update({
      where: { id: reportId },
      data,
      include: { inspections: true },
    });
  }

  async getQcDashboard(tenantId: string) {
    const totalInspections = await this.prisma.qCInspection.count({ where: { tenantId } });
    const passedInspections = await this.prisma.qCInspection.count({
      where: { tenantId, status: 'passed' },
    });
    const failedInspections = await this.prisma.qCInspection.count({
      where: { tenantId, status: 'failed' },
    });
    const openNcrs = await this.prisma.nonConformanceReport.count({
      where: { tenantId, status: 'open' },
    });

    return {
      totalInspections,
      passedInspections,
      failedInspections,
      passRate: totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0,
      openNcrs,
    };
  }
}
