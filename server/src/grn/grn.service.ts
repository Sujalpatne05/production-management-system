import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateGrnDto {
  purchaseId: string;
  receivedDate: Date;
  totalQuantity: number;
  warehouseLocation?: string;
  remarks?: string;
}

export class CreateGrnLineItemDto {
  productId?: string;
  rawMaterialId?: string;
  quantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity?: number;
  batchNo?: string;
  expiryDate?: Date;
  remarks?: string;
}

@Injectable()
export class GrnService {
  constructor(private prisma: PrismaService) {}

  async createGrn(tenantId: string, data: CreateGrnDto) {
    // Generate GRN number
    const lastGrn = await this.prisma.gRN.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { grnNo: true },
    });

    let grnNo = 'GRN-001';
    if (lastGrn?.grnNo) {
      const lastNum = parseInt(lastGrn.grnNo.split('-')[1]) || 0;
      grnNo = `GRN-${String(lastNum + 1).padStart(5, '0')}`;
    }

    return this.prisma.gRN.create({
      data: {
        tenantId,
        purchaseId: data.purchaseId,
        grnNo,
        receivedDate: data.receivedDate,
        totalQuantity: data.totalQuantity,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        warehouseLocation: data.warehouseLocation,
        remarks: data.remarks,
        status: 'pending',
      },
      include: { purchase: true, lineItems: true },
    });
  }

  async getGrnList(tenantId: string) {
    return this.prisma.gRN.findMany({
      where: { tenantId },
      include: { purchase: { include: { supplier: true } }, lineItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGrnById(tenantId: string, grnId: string) {
    return this.prisma.gRN.findFirst({
      where: { tenantId, id: grnId },
      include: {
        purchase: { include: { supplier: true, items: true } },
        lineItems: { include: { product: true, rawMaterial: true } },
      },
    });
  }

  async addLineItem(tenantId: string, grnId: string, data: CreateGrnLineItemDto) {
    const grn = await this.prisma.gRN.findFirst({
      where: { tenantId, id: grnId },
    });

    if (!grn) throw new Error('GRN not found');

    return this.prisma.gRNLineItem.create({
      data: {
        grnId,
        productId: data.productId,
        rawMaterialId: data.rawMaterialId,
        quantity: data.quantity,
        receivedQuantity: data.receivedQuantity,
        acceptedQuantity: data.acceptedQuantity,
        rejectedQuantity: data.rejectedQuantity || 0,
        batchNo: data.batchNo,
        expiryDate: data.expiryDate,
        remarks: data.remarks,
        qualityStatus: 'pending',
      },
      include: { product: true, rawMaterial: true },
    });
  }

  async updateGrnStatus(tenantId: string, grnId: string, status: string) {
    // Get GRN with all line items
    const grn = await this.prisma.gRN.findFirst({
      where: { tenantId, id: grnId },
      include: { lineItems: true },
    });

    if (!grn) throw new Error('GRN not found');

    // Calculate totals
    const totalAccepted = grn.lineItems.reduce((sum, item) => sum + item.acceptedQuantity, 0);
    const totalRejected = grn.lineItems.reduce((sum, item) => sum + item.rejectedQuantity, 0);

    return this.prisma.gRN.update({
      where: { id: grnId },
      data: {
        status,
        acceptedQuantity: totalAccepted,
        rejectedQuantity: totalRejected,
      },
      include: { purchase: true, lineItems: true },
    });
  }

  async updateLineItemQualityStatus(grnLineItemId: string, qualityStatus: string) {
    return this.prisma.gRNLineItem.update({
      where: { id: grnLineItemId },
      data: { qualityStatus },
      include: { product: true, rawMaterial: true },
    });
  }

  async getGrnDashboard(tenantId: string) {
    const totalGrns = await this.prisma.gRN.count({ where: { tenantId } });
    const pendingGrns = await this.prisma.gRN.count({
      where: { tenantId, status: 'pending' },
    });
    const acceptedGrns = await this.prisma.gRN.count({
      where: { tenantId, status: 'accepted' },
    });
    const rejectedGrns = await this.prisma.gRN.count({
      where: { tenantId, status: 'rejected' },
    });

    return {
      totalGrns,
      pendingGrns,
      acceptedGrns,
      rejectedGrns,
    };
  }
}
