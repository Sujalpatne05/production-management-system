import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  orderNumber: string;
  date: string;
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  customerId: string;
  orderNumber: string;
  date: string;
  status?: string;
  items: OrderItem[];
  notes?: string;
}

export class OrderService {
  static async getOrders(tenantId: string): Promise<Order[]> {
    return apiClient.get(`${API_ENDPOINTS.ORDERS.LIST}?tenantId=${tenantId}`);
  }

  static async getOrderById(id: string): Promise<Order> {
    return apiClient.get(API_ENDPOINTS.ORDERS.GET.replace(':id', id));
  }

  static async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
  }

  static async updateOrder(id: string, data: Partial<CreateOrderRequest>): Promise<Order> {
    return apiClient.put(API_ENDPOINTS.ORDERS.UPDATE.replace(':id', id), data);
  }

  static async deleteOrder(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.ORDERS.DELETE.replace(':id', id));
  }

  static async getOrderStats(tenantId: string): Promise<any> {
    return apiClient.get(API_ENDPOINTS.ORDERS.STATS.replace(':tenantId', tenantId));
  }
}
