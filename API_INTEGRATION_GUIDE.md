# API Integration Guide

## Overview

The frontend is now fully integrated with the NestJS backend API. All major business modules have corresponding service classes for seamless API communication.

## Architecture

```
Frontend                    Backend (NestJS)
┌─────────────────┐        ┌─────────────────┐
│  React Pages    │        │  Controllers    │
│      ↓          │        │       ↑         │
│  Services       │───────→│  Services       │
│      ↓          │←───────│      ↓          │
│  API Client     │        │  Database       │
└─────────────────┘        └─────────────────┘
```

## Available Services

### 1. Authentication Service
**File**: `src/services/authService.ts`

```typescript
import { AuthService } from '@/services';

// Login
await AuthService.login({
  email: 'admin@demo.com',
  password: 'password'
});

// Register
await AuthService.register({
  email: 'user@demo.com',
  password: 'password',
  fullName: 'User Name'
});

// Refresh token
await AuthService.refreshToken();

// Logout
AuthService.logout();
```

### 2. Order Service
**File**: `src/services/orderService.ts`

```typescript
import { OrderService } from '@/services';

// Get orders
const orders = await OrderService.getOrders(tenantId);

// Get single order
const order = await OrderService.getOrderById(id);

// Create order
const newOrder = await OrderService.createOrder({
  customerId: 'cust-123',
  orderNumber: 'ORD-001',
  date: '2026-02-01',
  items: [
    { productId: 'prod-1', quantity: 10, unitPrice: 50, totalPrice: 500 }
  ]
});

// Update order
await OrderService.updateOrder(id, { status: 'completed' });

// Delete order
await OrderService.deleteOrder(id);

// Get statistics
const stats = await OrderService.getOrderStats(tenantId);
```

### 3. Product Service
**File**: `src/services/productService.ts`

```typescript
import { ProductService } from '@/services';

// Products
const products = await ProductService.getProducts(tenantId);
const product = await ProductService.getProductById(id);
await ProductService.createProduct({
  categoryId: 'cat-1',
  name: 'Product Name',
  sku: 'SKU-001',
  unitOfMeasure: 'piece',
  cost: 50,
  sellingPrice: 99.99,
  reorderLevel: 20
});

// Categories
const categories = await ProductService.getCategories();
await ProductService.createCategory({
  name: 'Electronics',
  description: 'Electronic products'
});
```

### 4. Production Service
**File**: `src/services/productionService.ts`

```typescript
import { ProductionService } from '@/services';

// Productions
const productions = await ProductionService.getProductions(tenantId);
const production = await ProductionService.getProductionById(id);
await ProductionService.createProduction({
  productId: 'prod-123',
  startDate: '2026-02-01',
  expectedCompletionDate: '2026-02-10',
  quantity: 100
});

// Production losses
const losses = await ProductionService.getProductionLosses(productionId);
await ProductionService.createProductionLoss({
  productionId: 'prod-id',
  lossType: 'defect',
  quantity: 5,
  reason: 'Quality control failure'
});

// Production stages
const stages = await ProductionService.getProductionStages();
```

### 5. Stock Service
**File**: `src/services/stockService.ts`

```typescript
import { StockService } from '@/services';

// Get stock
const stock = await StockService.getStock(tenantId);
const item = await StockService.getStockById(id);

// Update stock
await StockService.updateStock(id, {
  quantity: 100,
  warehouseLocation: 'Shelf A1'
});

// Get transactions
const transactions = await StockService.getStockTransactions(stockId);
```

### 6. Party Service (Customers & Suppliers)
**File**: `src/services/partyService.ts`

```typescript
import { PartyService } from '@/services';

// Customers
const customers = await PartyService.getCustomers(tenantId);
await PartyService.createCustomer({
  name: 'ABC Corporation',
  email: 'contact@abc.com',
  phone: '1234567890',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'USA'
});

// Suppliers
const suppliers = await PartyService.getSuppliers(tenantId);
await PartyService.createSupplier({
  name: 'Global Supplies Inc',
  email: 'sales@global.com',
  phone: '9876543210',
  address: '456 Trade Ave',
  city: 'Singapore',
  state: 'SG',
  postalCode: '018956',
  country: 'Singapore'
});
```

### 7. Transaction Service (Sales & Purchases)
**File**: `src/services/transactionService.ts`

```typescript
import { TransactionService } from '@/services';

// Sales
const sales = await TransactionService.getSales(tenantId);
await TransactionService.createSale({
  customerId: 'cust-1',
  saleNumber: 'SALE-001',
  date: '2026-02-01',
  items: [
    { productId: 'prod-1', quantity: 5, unitPrice: 100, totalPrice: 500 }
  ]
});

// Purchases
const purchases = await TransactionService.getPurchases(tenantId);
await TransactionService.createPurchase({
  supplierId: 'supp-1',
  purchaseNumber: 'PUR-001',
  date: '2026-02-01',
  items: [
    { productId: 'prod-1', quantity: 20, unitPrice: 50, totalPrice: 1000 }
  ]
});
```

### 8. Accounting Service
**File**: `src/services/accountingService.ts`

```typescript
import { AccountingService } from '@/services';

// Accounts
const accounts = await AccountingService.getAccounts(tenantId);
await AccountingService.createAccount({
  code: '1000',
  name: 'Cash',
  type: 'asset',
  currency: 'USD'
});

// Transactions
const transactions = await AccountingService.getTransactions(tenantId);
await AccountingService.createTransaction({
  accountId: 'acc-1',
  date: '2026-02-01',
  description: 'Sale transaction',
  debit: 1000
});

// Reports
const reports = await AccountingService.getReports(tenantId);
const report = await AccountingService.generateReport({
  type: 'balance_sheet',
  startDate: '2026-01-01',
  endDate: '2026-02-01'
});
```

## Error Handling

All services throw `ApiError` exceptions. Handle them in your components:

```typescript
import { ApiError } from '@/services';

try {
  const orders = await OrderService.getOrders(tenantId);
} catch (error) {
  if (error instanceof ApiError || error.statusCode) {
    console.error('API Error:', error.message, error.statusCode);
    // Handle specific errors
    if (error.statusCode === 401) {
      // Redirect to login
    }
  }
}
```

## Authentication Flow

1. User logs in with credentials
2. Backend returns `accessToken` and `refreshToken`
3. Token is automatically stored and sent with each request
4. If token expires (401), user is redirected to login
5. Use `AuthService.refreshToken()` to get new token before expiration

## API Configuration

**File**: `src/config/apiConfig.ts`

Change backend URL:
```typescript
API_CONFIG.API_URL = 'http://production-server.com/api';
```

## Backend Requirements

### Running Backend Server
```bash
cd server
docker-compose up -d          # Start PostgreSQL & Redis
npm install --legacy-peer-deps
npm run prisma:migrate         # Run migrations
npm run prisma:seed           # Seed database
npm run start:dev             # Start server
```

### Default Credentials
- **Superadmin**: `superadmin@system.com`
- **Admin**: `admin@demo.com`
- **User**: `user@demo.com`

### Backend URL
- **API Base**: `http://localhost:3000/api`
- **Server**: `http://localhost:3000`

## Usage Examples

### Example 1: Login and Load Orders
```typescript
import { AuthService, OrderService } from '@/services';

async function loadUserOrders() {
  try {
    // Login
    const auth = await AuthService.login({
      email: 'admin@demo.com',
      password: 'password'
    });
    
    // Get orders
    const orders = await OrderService.getOrders(auth.user.tenant.id);
    return orders;
  } catch (error) {
    console.error('Failed to load orders:', error);
  }
}
```

### Example 2: Create Order with Items
```typescript
async function createNewOrder() {
  const order = await OrderService.createOrder({
    customerId: 'cust-123',
    orderNumber: 'ORD-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    items: [
      {
        productId: 'prod-1',
        quantity: 10,
        unitPrice: 50,
        totalPrice: 500
      }
    ]
  });
  return order;
}
```

## Debugging

Enable API logs:
```typescript
// In apiClient.ts, logs are already implemented
// Check browser console for API calls
```

Monitor API calls:
- Open DevTools (F12)
- Network tab
- Filter by XHR/Fetch
- All requests go to `http://localhost:3000/api/*`

