import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Production {
  id: string;
  tenantId: string;
  productId: string;
  startDate: string;
  expectedCompletionDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  quantity: number;
  loss: number;
  yield: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionLoss {
  id: string;
  productionId: string;
  lossType: string;
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface ProductionStage {
  id: string;
  productionId: string;
  stageId: string;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface CreateProductionRequest {
  productId: string;
  startDate: string;
  expectedCompletionDate: string;
  quantity: number;
  notes?: string;
}

export interface CreateProductionLossRequest {
  productionId: string;
  lossType: string;
  quantity: number;
  reason: string;
}

export class ProductionService {
  static async getProductions(tenantId: string): Promise<Production[]> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTION.LIST}?tenantId=${tenantId}`);
  }

  static async getProductionById(id: string): Promise<Production> {
    return apiClient.get(API_ENDPOINTS.PRODUCTION.GET.replace(':id', id));
  }

  static async createProduction(data: CreateProductionRequest): Promise<Production> {
    return apiClient.post(API_ENDPOINTS.PRODUCTION.CREATE, data);
  }

  static async updateProduction(id: string, data: Partial<CreateProductionRequest>): Promise<Production> {
    return apiClient.put(API_ENDPOINTS.PRODUCTION.UPDATE.replace(':id', id), data);
  }

  static async deleteProduction(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PRODUCTION.DELETE.replace(':id', id));
  }

  static async getProductionStats(tenantId: string): Promise<any> {
    return apiClient.get(API_ENDPOINTS.PRODUCTION.STATS.replace(':tenantId', tenantId));
  }

  // Production Losses
  static async getProductionLosses(productionId?: string): Promise<ProductionLoss[]> {
    const url = productionId
      ? `${API_ENDPOINTS.PRODUCTION.LOSSES}?productionId=${productionId}`
      : API_ENDPOINTS.PRODUCTION.LOSSES;
    return apiClient.get(url);
  }

  static async createProductionLoss(data: CreateProductionLossRequest): Promise<ProductionLoss> {
    return apiClient.post(API_ENDPOINTS.PRODUCTION.LOSSES, data);
  }

  static async deleteProductionLoss(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCTION.LOSSES}/${id}`);
  }

  // Production Stages
  static async getProductionStages(): Promise<any[]> {
    return apiClient.get(API_ENDPOINTS.PRODUCTION.STAGES);
  }

  static async createProductionStage(data: any): Promise<any> {
    return apiClient.post(API_ENDPOINTS.PRODUCTION.STAGES, data);
  }

  static async deleteProductionStage(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCTION.STAGES}/${id}`);
  }
}
