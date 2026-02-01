import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Stock {
  id: string;
  tenantId: string;
  productId: string;
  quantity: number;
  warehouseLocation: string;
  lastUpdated: string;
}

export interface StockTransaction {
  id: string;
  stockId: string;
  type: 'inbound' | 'outbound';
  quantity: number;
  reason: string;
  date: string;
}

export interface UpdateStockRequest {
  quantity: number;
  warehouseLocation?: string;
}

export class StockService {
  static async getStock(tenantId: string): Promise<Stock[]> {
    return apiClient.get(`${API_ENDPOINTS.STOCK.LIST}?tenantId=${tenantId}`);
  }

  static async getStockById(id: string): Promise<Stock> {
    return apiClient.get(API_ENDPOINTS.STOCK.GET.replace(':id', id));
  }

  static async updateStock(id: string, data: UpdateStockRequest): Promise<Stock> {
    return apiClient.put(API_ENDPOINTS.STOCK.UPDATE.replace(':id', id), data);
  }

  static async getStockByProductId(productId: string, tenantId: string): Promise<Stock[]> {
    return apiClient.get(`${API_ENDPOINTS.STOCK.LIST}?productId=${productId}&tenantId=${tenantId}`);
  }

  static async getStockTransactions(stockId: string): Promise<StockTransaction[]> {
    return apiClient.get(`/stock-transactions?stockId=${stockId}`);
  }
}
