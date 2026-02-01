// Main API client for low-level HTTP operations
export { apiClient, ApiResponse, ApiError } from './apiClient';

// High-level service APIs
export { AuthService } from './authService';
export type { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest } from './authService';

export { OrderService } from './orderService';
export type { Order, OrderItem, CreateOrderRequest } from './orderService';

export { ProductService } from './productService';
export type { Product, ProductCategory, CreateProductRequest, CreateProductCategoryRequest } from './productService';

export { ProductionService } from './productionService';
export type { Production, ProductionLoss, ProductionStage, CreateProductionRequest, CreateProductionLossRequest } from './productionService';

export { StockService } from './stockService';
export type { Stock, StockTransaction, UpdateStockRequest } from './stockService';

export { PartyService } from './partyService';
export type { Customer, Supplier, CreateCustomerRequest, CreateSupplierRequest } from './partyService';

export { TransactionService } from './transactionService';
export type { Sale, SaleItem, Purchase, PurchaseItem, Payment, CreateSaleRequest, CreatePurchaseRequest } from './transactionService';

export { AccountingService } from './accountingService';
export type { Account, Transaction, FinancialReport, CreateAccountRequest, CreateTransactionRequest, GenerateReportRequest } from './accountingService';
