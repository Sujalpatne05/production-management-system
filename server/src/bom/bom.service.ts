import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateBomDto {
  productId: string;
  name: string;
  description?: string;
  status?: string;
  notes?: string;
}

export class CreateBomComponentDto {
  productId?: string;
  rawMaterialId?: string;
  quantity: number;
  uom: string;
  wasteFactor?: number;
  leadTime?: number;
  notes?: string;
  sequenceNo?: number;
}

export class UpdateBomDto {
  name?: string;
  description?: string;
  status?: string;
  notes?: string;
}

@Injectable()
export class BomService {
  constructor(private prisma: PrismaService) {}

  async createBom(tenantId: string, data: CreateBomDto) {
    const latestVersion = await this.prisma.bOM.findFirst({
      where: { tenantId, productId: data.productId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return this.prisma.bOM.create({
      data: {
        tenantId,
        productId: data.productId,
        name: data.name,
        description: data.description,
        status: data.status || 'active',
        notes: data.notes,
        version: (latestVersion?.version || 0) + 1,
      },
      include: { components: true, product: true },
    });
  }

  async getBomList(tenantId: string, productId?: string) {
    return this.prisma.bOM.findMany({
      where: {
        tenantId,
        ...(productId && { productId }),
      },
      include: { components: true, product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBomById(tenantId: string, bomId: string) {
    return this.prisma.bOM.findFirst({
      where: { tenantId, id: bomId },
      include: { components: { include: { product: true, rawMaterial: true } }, product: true },
    });
  }

  async updateBom(tenantId: string, bomId: string, data: UpdateBomDto) {
    return this.prisma.bOM.update({
      where: { id: bomId },
      data,
      include: { components: true, product: true },
    });
  }

  async deleteBom(tenantId: string, bomId: string) {
    return this.prisma.bOM.delete({
      where: { id: bomId },
    });
  }

  async addComponent(tenantId: string, bomId: string, data: CreateBomComponentDto) {
    const bom = await this.prisma.bOM.findFirst({
      where: { tenantId, id: bomId },
    });

    if (!bom) throw new Error('BOM not found');

    // Get max sequenceNo
    const maxSequence = await this.prisma.bOMComponent.findFirst({
      where: { bomId },
      orderBy: { sequenceNo: 'desc' },
      select: { sequenceNo: true },
    });

    return this.prisma.bOMComponent.create({
      data: {
        bomId,
        productId: data.productId,
        rawMaterialId: data.rawMaterialId,
        quantity: data.quantity,
        uom: data.uom,
        wasteFactor: data.wasteFactor || 0,
        leadTime: data.leadTime || 0,
        notes: data.notes,
        sequenceNo: (maxSequence?.sequenceNo || 0) + 1,
      },
      include: { product: true, rawMaterial: true },
    });
  }

  async removeComponent(tenantId: string, componentId: string) {
    return this.prisma.bOMComponent.delete({
      where: { id: componentId },
    });
  }

  async updateComponent(componentId: string, data: Partial<CreateBomComponentDto>) {
    return this.prisma.bOMComponent.update({
      where: { id: componentId },
      data,
      include: { product: true, rawMaterial: true },
    });
  }

  async getBomByProduct(tenantId: string, productId: string) {
    return this.prisma.bOM.findFirst({
      where: { tenantId, productId, status: 'active' },
      include: { components: { include: { product: true, rawMaterial: true }, orderBy: { sequenceNo: 'asc' } } },
    });
  }
}
