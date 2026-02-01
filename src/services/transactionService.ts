import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Sale {
  id: string;
  tenantId: string;
  customerId: string;
  saleNumber: string;
  date: string;
  dueDate?: string;
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'returned';
  totalAmount: number;
  items: SaleItem[];
  payment?: Payment;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Purchase {
  id: string;
  tenantId: string;
  supplierId: string;
  purchaseNumber: string;
  date: string;
  dueDate?: string;
  status: 'draft' | 'ordered' | 'received' | 'invoiced' | 'paid';
  totalAmount: number;
  items: PurchaseItem[];
  payment?: Payment;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'check' | 'bank_transfer' | 'credit_card';
  reference?: string;
}

export interface CreateSaleRequest {
  customerId: string;
  saleNumber: string;
  date: string;
  dueDate?: string;
  items: Omit<SaleItem, 'id'>[];
  notes?: string;
}

export interface CreatePurchaseRequest {
  supplierId: string;
  purchaseNumber: string;
  date: string;
  dueDate?: string;
  items: Omit<PurchaseItem, 'id'>[];
  notes?: string;
}

export class TransactionService {
  // Sales methods
  static async getSales(tenantId: string): Promise<Sale[]> {
    return apiClient.get(`${API_ENDPOINTS.SALES.LIST}?tenantId=${tenantId}`);
  }

  static async getSaleById(id: string): Promise<Sale> {
    return apiClient.get(API_ENDPOINTS.SALES.GET.replace(':id', id));
  }

  static async createSale(data: CreateSaleRequest): Promise<Sale> {
    return apiClient.post(API_ENDPOINTS.SALES.CREATE, data);
  }

  static async updateSale(id: string, data: Partial<CreateSaleRequest>): Promise<Sale> {
    return apiClient.put(API_ENDPOINTS.SALES.UPDATE.replace(':id', id), data);
  }

  static async deleteSale(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.SALES.DELETE.replace(':id', id));
  }

  // Purchase methods
  static async getPurchases(tenantId: string): Promise<Purchase[]> {
    return apiClient.get(`${API_ENDPOINTS.PURCHASES.LIST}?tenantId=${tenantId}`);
  }

  static async getPurchaseById(id: string): Promise<Purchase> {
    return apiClient.get(API_ENDPOINTS.PURCHASES.GET.replace(':id', id));
  }

  static async createPurchase(data: CreatePurchaseRequest): Promise<Purchase> {
    return apiClient.post(API_ENDPOINTS.PURCHASES.CREATE, data);
  }

  static async updatePurchase(id: string, data: Partial<CreatePurchaseRequest>): Promise<Purchase> {
    return apiClient.put(API_ENDPOINTS.PURCHASES.UPDATE.replace(':id', id), data);
  }

  static async deletePurchase(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PURCHASES.DELETE.replace(':id', id));
  }
}
