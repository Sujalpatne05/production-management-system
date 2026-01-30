import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateForecastDto {
  name: string;
  description?: string;
  forecastMethod: string; // 'manual', 'historical_average', 'seasonal', 'trend'
  startDate: Date;
  endDate: Date;
  notes?: string;
}

export class CreateForecastLineItemDto {
  productId: string;
  month: string; // 'YYYY-MM'
  forecastedQuantity: number;
  historicalAvg?: number;
  lastYearQuantity?: number;
  confidence?: number;
  notes?: string;
}

@Injectable()
export class ForecastService {
  constructor(private prisma: PrismaService) {}

  async createForecast(tenantId: string, data: CreateForecastDto) {
    return this.prisma.forecast.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        forecastMethod: data.forecastMethod,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        status: 'draft',
      },
      include: { lineItems: true },
    });
  }

  async getForecastList(tenantId: string) {
    return this.prisma.forecast.findMany({
      where: { tenantId },
      include: { lineItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getForecastById(tenantId: string, forecastId: string) {
    return this.prisma.forecast.findFirst({
      where: { tenantId, id: forecastId },
      include: { lineItems: { include: { product: true } } },
    });
  }

  async addForecastLineItem(forecastId: string, data: CreateForecastLineItemDto) {
    return this.prisma.forecastLineItem.create({
      data: {
        forecastId,
        productId: data.productId,
        month: data.month,
        forecastedQuantity: BigInt(Math.round(data.forecastedQuantity * 10000)),
        historicalAvg: BigInt(Math.round((data.historicalAvg || 0) * 10000)),
        lastYearQuantity: BigInt(Math.round((data.lastYearQuantity || 0) * 10000)),
        confidence: data.confidence || 90,
        notes: data.notes,
      },
      include: { product: true },
    });
  }

  async updateForecastLineItem(lineItemId: string, data: Partial<CreateForecastLineItemDto>) {
    const updateData: any = {};
    if (data.forecastedQuantity !== undefined) {
      updateData.forecastedQuantity = BigInt(Math.round(data.forecastedQuantity * 10000));
    }
    if (data.historicalAvg !== undefined) {
      updateData.historicalAvg = BigInt(Math.round(data.historicalAvg * 10000));
    }
    if (data.lastYearQuantity !== undefined) {
      updateData.lastYearQuantity = BigInt(Math.round(data.lastYearQuantity * 10000));
    }
    if (data.confidence !== undefined) {
      updateData.confidence = data.confidence;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    return this.prisma.forecastLineItem.update({
      where: { id: lineItemId },
      data: updateData,
      include: { product: true },
    });
  }

  async updateForecastStatus(tenantId: string, forecastId: string, status: string) {
    return this.prisma.forecast.update({
      where: { id: forecastId },
      data: { status },
      include: { lineItems: true },
    });
  }

  async getForecastDashboard(tenantId: string) {
    const activeForecast = await this.prisma.forecast.count({
      where: { tenantId, status: 'active' },
    });

    const totalLineItems = await this.prisma.forecastLineItem.count({
      where: { forecast: { tenantId } },
    });

    const avgConfidence = await this.prisma.forecastLineItem.aggregate({
      where: { forecast: { tenantId } },
      _avg: { confidence: true },
    });

    return {
      activeForecast,
      totalLineItems,
      avgConfidence: avgConfidence._avg.confidence || 0,
    };
  }

  async calculateHistoricalAverage(tenantId: string, productId: string, months: number = 12) {
    // This would integrate with actual sales data
    // For now, returning placeholder
    return {
      productId,
      average: 0,
      trend: 'stable',
    };
  }

  async forecastBySeason(tenantId: string, productId: string, seasonFactor: number) {
    // Seasonal forecast calculation
    return {
      productId,
      seasonFactor,
      method: 'seasonal',
    };
  }
}
