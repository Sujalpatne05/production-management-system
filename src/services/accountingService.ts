import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface Account {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  accountId: string;
  date: string;
  description: string;
  debit?: number;
  credit?: number;
  reference?: string;
  createdAt: string;
}

export interface FinancialReport {
  id: string;
  tenantId: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  period: string;
  data: any;
  generatedAt: string;
}

export interface CreateAccountRequest {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  currency?: string;
}

export interface CreateTransactionRequest {
  accountId: string;
  date: string;
  description: string;
  debit?: number;
  credit?: number;
  reference?: string;
}

export interface GenerateReportRequest {
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  startDate: string;
  endDate: string;
}

export class AccountingService {
  // Account methods
  static async getAccounts(tenantId: string): Promise<Account[]> {
    return apiClient.get(`${API_ENDPOINTS.ACCOUNTING.ACCOUNTS}?tenantId=${tenantId}`);
  }

  static async getAccountById(id: string): Promise<Account> {
    return apiClient.get(`${API_ENDPOINTS.ACCOUNTING.ACCOUNTS}/${id}`);
  }

  static async createAccount(data: CreateAccountRequest): Promise<Account> {
    return apiClient.post(API_ENDPOINTS.ACCOUNTING.ACCOUNTS, data);
  }

  static async updateAccount(id: string, data: Partial<CreateAccountRequest>): Promise<Account> {
    return apiClient.put(`${API_ENDPOINTS.ACCOUNTING.ACCOUNTS}/${id}`, data);
  }

  static async deleteAccount(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.ACCOUNTING.ACCOUNTS}/${id}`);
  }

  // Transaction methods
  static async getTransactions(tenantId: string, accountId?: string): Promise<Transaction[]> {
    const url = accountId
      ? `${API_ENDPOINTS.ACCOUNTING.TRANSACTIONS}?tenantId=${tenantId}&accountId=${accountId}`
      : `${API_ENDPOINTS.ACCOUNTING.TRANSACTIONS}?tenantId=${tenantId}`;
    return apiClient.get(url);
  }

  static async getTransactionById(id: string): Promise<Transaction> {
    return apiClient.get(`${API_ENDPOINTS.ACCOUNTING.TRANSACTIONS}/${id}`);
  }

  static async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    return apiClient.post(API_ENDPOINTS.ACCOUNTING.TRANSACTIONS, data);
  }

  static async updateTransaction(id: string, data: Partial<CreateTransactionRequest>): Promise<Transaction> {
    return apiClient.put(`${API_ENDPOINTS.ACCOUNTING.TRANSACTIONS}/${id}`, data);
  }

  static async deleteTransaction(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.ACCOUNTING.TRANSACTIONS}/${id}`);
  }

  // Report methods
  static async getReports(tenantId: string): Promise<FinancialReport[]> {
    return apiClient.get(`${API_ENDPOINTS.ACCOUNTING.REPORTS}?tenantId=${tenantId}`);
  }

  static async getReportById(id: string): Promise<FinancialReport> {
    return apiClient.get(`${API_ENDPOINTS.ACCOUNTING.REPORTS}/${id}`);
  }

  static async generateReport(data: GenerateReportRequest): Promise<FinancialReport> {
    return apiClient.post(API_ENDPOINTS.ACCOUNTING.REPORTS, data);
  }
}
