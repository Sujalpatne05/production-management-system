import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  sku: string;
  description?: string;
  unitOfMeasure: string;
  cost: number;
  sellingPrice: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  sku: string;
  description?: string;
  unitOfMeasure: string;
  cost: number;
  sellingPrice: number;
  reorderLevel: number;
}

export interface CreateProductCategoryRequest {
  name: string;
  description?: string;
}

export class ProductService {
  static async getProducts(tenantId?: string): Promise<Product[]> {
    const url = tenantId 
      ? `${API_ENDPOINTS.PRODUCTS.LIST}?tenantId=${tenantId}`
      : API_ENDPOINTS.PRODUCTS.LIST;
    return apiClient.get(url);
  }

  static async getProductById(id: string): Promise<Product> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.GET.replace(':id', id));
  }

  static async createProduct(data: CreateProductRequest): Promise<Product> {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
  }

  static async updateProduct(id: string, data: Partial<CreateProductRequest>): Promise<Product> {
    return apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE.replace(':id', id), data);
  }

  static async deleteProduct(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE.replace(':id', id));
  }

  static async getCategories(): Promise<ProductCategory[]> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  static async getCategoryById(id: string): Promise<ProductCategory> {
    return apiClient.get(`${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${id}`);
  }

  static async createCategory(data: CreateProductCategoryRequest): Promise<ProductCategory> {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.CATEGORIES, data);
  }

  static async updateCategory(id: string, data: Partial<CreateProductCategoryRequest>): Promise<ProductCategory> {
    return apiClient.put(`${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${id}`, data);
  }

  static async deleteCategory(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${id}`);
  }
}
