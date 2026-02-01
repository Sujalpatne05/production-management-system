import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  creditLimit?: number;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  creditLimit?: number;
  paymentTerms?: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentTerms?: string;
}

export class PartyService {
  // Customer methods
  static async getCustomers(tenantId: string): Promise<Customer[]> {
    return apiClient.get(`${API_ENDPOINTS.CUSTOMERS.LIST}?tenantId=${tenantId}`);
  }

  static async getCustomerById(id: string): Promise<Customer> {
    return apiClient.get(API_ENDPOINTS.CUSTOMERS.GET.replace(':id', id));
  }

  static async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post(API_ENDPOINTS.CUSTOMERS.CREATE, data);
  }

  static async updateCustomer(id: string, data: Partial<CreateCustomerRequest>): Promise<Customer> {
    return apiClient.put(API_ENDPOINTS.CUSTOMERS.UPDATE.replace(':id', id), data);
  }

  static async deleteCustomer(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.CUSTOMERS.DELETE.replace(':id', id));
  }

  // Supplier methods
  static async getSuppliers(tenantId: string): Promise<Supplier[]> {
    return apiClient.get(`${API_ENDPOINTS.SUPPLIERS.LIST}?tenantId=${tenantId}`);
  }

  static async getSupplierById(id: string): Promise<Supplier> {
    return apiClient.get(API_ENDPOINTS.SUPPLIERS.GET.replace(':id', id));
  }

  static async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    return apiClient.post(API_ENDPOINTS.SUPPLIERS.CREATE, data);
  }

  static async updateSupplier(id: string, data: Partial<CreateSupplierRequest>): Promise<Supplier> {
    return apiClient.put(API_ENDPOINTS.SUPPLIERS.UPDATE.replace(':id', id), data);
  }

  static async deleteSupplier(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.SUPPLIERS.DELETE.replace(':id', id));
  }
}
