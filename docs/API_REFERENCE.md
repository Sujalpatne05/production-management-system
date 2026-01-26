# Production Management System - API Reference Guide

## Quick Access

- **Backend Base URL:** http://localhost:3000
- **API Prefix:** /api
- **Authentication:** JWT Bearer token in Authorization header
- **Response Format:** JSON

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "tenantId": "tenant-uuid"
}
```

**Response:** User object with JWT tokens

---

### POST /api/auth/login
User login.

**Request Body:**
```json
{
  "email": "admin@demo.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": { "id": "...", "email": "..." }
}
```

---

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response:** New access token

---

## Users Endpoints

### GET /api/users
List all users (with pagination/filtering).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `tenantId` - Filter by tenant

**Response:**
```json
{
  "data": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "tenantId": "tenant-id",
      "roles": ["Admin"],
      "createdAt": "2025-01-22T..."
    }
  ],
  "total": 5,
  "page": 1
}
```

---

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "tenantId": "tenant-id",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

### GET /api/users/:id
Get user details.

**Response:** User object

---

### PUT /api/users/:id
Update user.

**Request Body:**
```json
{
  "email": "updated@example.com",
  "firstName": "Jane"
}
```

---

### DELETE /api/users/:id
Delete user.

---

### POST /api/users/:id/roles
Assign roles to user.

**Request Body:**
```json
{
  "roleIds": ["role-id-1", "role-id-2"]
}
```

---

## Tenants Endpoints

### GET /api/tenants
List all tenants.

**Response:**
```json
{
  "data": [
    {
      "id": "tenant-id",
      "name": "Company Name",
      "email": "company@example.com",
      "status": "active",
      "createdAt": "2025-01-22T..."
    }
  ]
}
```

---

### POST /api/tenants
Create a new tenant.

**Request Body:**
```json
{
  "name": "New Company",
  "email": "company@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St"
}
```

---

### GET /api/tenants/:id
Get tenant details.

---

### PUT /api/tenants/:id
Update tenant.

---

### DELETE /api/tenants/:id
Delete tenant.

---

## Products Endpoints

### GET /api/products
List all products.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `categoryId` - Filter by category
- `search` - Search by name
- `page`, `limit` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "product-id",
      "name": "Product Name",
      "sku": "SKU-001",
      "categoryId": "category-id",
      "costPrice": 100,
      "sellingPrice": 150,
      "status": "active",
      "tenantId": "tenant-id"
    }
  ]
}
```

---

### POST /api/products
Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "sku": "SKU-002",
  "categoryId": "category-id",
  "costPrice": 100,
  "sellingPrice": 150,
  "description": "Product description",
  "tenantId": "tenant-id"
}
```

---

### GET /api/products/:id
Get product details.

---

### PUT /api/products/:id
Update product.

---

### DELETE /api/products/:id
Delete product.

---

## Product Categories Endpoints

### GET /api/product-categories
List all product categories.

**Response:**
```json
{
  "data": [
    {
      "id": "category-id",
      "name": "Electronics",
      "description": "Electronic products",
      "tenantId": "tenant-id"
    }
  ]
}
```

---

### POST /api/product-categories
Create a new category.

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Description",
  "tenantId": "tenant-id"
}
```

---

## Sales Orders Endpoints

### GET /api/sales
List all sales orders.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `customerId` - Filter by customer
- `status` - Filter by status (pending, completed, cancelled)
- `page`, `limit` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "order-id",
      "orderNumber": "ORD-001",
      "customerId": "customer-id",
      "tenantId": "tenant-id",
      "orderDate": "2025-01-22T...",
      "status": "completed",
      "totalAmount": 1500,
      "items": [
        {
          "productId": "product-id",
          "quantity": 2,
          "unitPrice": 750
        }
      ]
    }
  ]
}
```

---

### POST /api/sales
Create a new sales order.

**Request Body:**
```json
{
  "customerId": "customer-id",
  "tenantId": "tenant-id",
  "orderDate": "2025-01-22T10:00:00Z",
  "items": [
    {
      "productId": "product-id",
      "quantity": 2,
      "unitPrice": 750
    }
  ]
}
```

---

### GET /api/sales/:id
Get sales order details.

---

### GET /api/sales/stats/:tenantId
Get sales statistics.

**Response:**
```json
{
  "totalSales": 50000,
  "totalOrders": 25,
  "averageOrderValue": 2000,
  "topProduct": "Product Name",
  "topCustomer": "Customer Name"
}
```

---

## Customers Endpoints

### GET /api/customers
List all customers.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `search` - Search by name
- `page`, `limit` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "customer-id",
      "name": "Customer Name",
      "email": "customer@example.com",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "tenantId": "tenant-id",
      "status": "active"
    }
  ]
}
```

---

### POST /api/customers
Create a new customer.

**Request Body:**
```json
{
  "name": "New Customer",
  "email": "customer@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "tenantId": "tenant-id"
}
```

---

## Purchases Endpoints

### GET /api/purchases
List all purchase orders.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `supplierId` - Filter by supplier
- `status` - Filter by status
- `page`, `limit` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "purchase-id",
      "poNumber": "PO-001",
      "supplierId": "supplier-id",
      "tenantId": "tenant-id",
      "purchaseDate": "2025-01-22T...",
      "status": "pending",
      "totalAmount": 5000,
      "items": [
        {
          "rawMaterialId": "material-id",
          "quantity": 10,
          "unitPrice": 500
        }
      ]
    }
  ]
}
```

---

### POST /api/purchases
Create a new purchase order.

**Request Body:**
```json
{
  "supplierId": "supplier-id",
  "tenantId": "tenant-id",
  "purchaseDate": "2025-01-22T10:00:00Z",
  "items": [
    {
      "rawMaterialId": "material-id",
      "quantity": 10,
      "unitPrice": 500
    }
  ]
}
```

---

## Suppliers Endpoints

### GET /api/suppliers
List all suppliers.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `search` - Search by name
- `page`, `limit` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "supplier-id",
      "name": "Supplier Name",
      "email": "supplier@example.com",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "tenantId": "tenant-id",
      "status": "active"
    }
  ]
}
```

---

### POST /api/suppliers
Create a new supplier.

**Request Body:**
```json
{
  "name": "New Supplier",
  "email": "supplier@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "tenantId": "tenant-id"
}
```

---

## Stock Endpoints

### GET /api/stock/products
Get product stock levels.

**Query Parameters:**
- `tenantId` - Filter by tenant

**Response:**
```json
{
  "data": [
    {
      "productId": "product-id",
      "productName": "Product Name",
      "quantity": 100,
      "warehouseLocation": "Shelf A1",
      "lastUpdated": "2025-01-22T..."
    }
  ]
}
```

---

### GET /api/stock/raw-materials
Get raw material stock levels.

---

### POST /api/stock/products/:id/update
Update product stock.

**Request Body:**
```json
{
  "quantity": 50,
  "type": "add",
  "reason": "Stock receipt",
  "tenantId": "tenant-id"
}
```

---

### GET /api/stock/low-stock/:tenantId
Get low stock items.

**Response:**
```json
{
  "data": [
    {
      "productId": "product-id",
      "name": "Product Name",
      "currentStock": 5,
      "minimumStock": 10,
      "alert": true
    }
  ]
}
```

---

## Productions Endpoints

### GET /api/productions
List all production runs.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `status` - Filter by status (planned, in-progress, completed)
- `page`, `limit` - Pagination

**Response:**
```json
{
  "data": [
    {
      "id": "production-id",
      "batchNumber": "BATCH-001",
      "productId": "product-id",
      "quantity": 1000,
      "startDate": "2025-01-22T...",
      "endDate": "2025-01-23T...",
      "status": "in-progress",
      "tenantId": "tenant-id",
      "stages": [
        {
          "id": "stage-id",
          "name": "Assembly",
          "status": "completed"
        }
      ]
    }
  ]
}
```

---

### POST /api/productions
Create a new production run.

**Request Body:**
```json
{
  "productId": "product-id",
  "batchNumber": "BATCH-002",
  "quantity": 500,
  "startDate": "2025-01-22T10:00:00Z",
  "tenantId": "tenant-id"
}
```

---

### GET /api/productions/stats/:tenantId
Get production statistics.

**Response:**
```json
{
  "totalProduction": 50000,
  "totalBatches": 25,
  "averageBatchSize": 2000,
  "completionRate": 95,
  "wastePercentage": 2.5
}
```

---

## Production Losses Endpoints

### POST /api/production-losses
Log production loss.

**Request Body:**
```json
{
  "productionId": "production-id",
  "quantity": 10,
  "reason": "Quality defect",
  "tenantId": "tenant-id"
}
```

---

## Accounting Endpoints

### GET /api/accounts
List all accounts.

**Query Parameters:**
- `tenantId` - Filter by tenant
- `type` - Filter by type (asset, liability, equity, revenue, expense)

**Response:**
```json
{
  "data": [
    {
      "id": "account-id",
      "code": "1000",
      "name": "Cash",
      "type": "asset",
      "balance": 50000,
      "tenantId": "tenant-id"
    }
  ]
}
```

---

### POST /api/accounts
Create a new account.

**Request Body:**
```json
{
  "code": "2000",
  "name": "Accounts Payable",
  "type": "liability",
  "tenantId": "tenant-id"
}
```

---

### POST /api/accounting-transactions
Create journal entry.

**Request Body:**
```json
{
  "entries": [
    {
      "accountId": "account-id-1",
      "debit": 1000,
      "credit": 0
    },
    {
      "accountId": "account-id-2",
      "debit": 0,
      "credit": 1000
    }
  ],
  "description": "Monthly rent expense",
  "tenantId": "tenant-id"
}
```

---

## Accounting Reports Endpoints

### GET /api/accounting/reports/trial-balance/:tenantId
Get trial balance report.

**Response:**
```json
{
  "accounts": [
    {
      "code": "1000",
      "name": "Cash",
      "debit": 50000,
      "credit": 0
    }
  ],
  "totalDebit": 500000,
  "totalCredit": 500000
}
```

---

### GET /api/accounting/reports/balance-sheet/:tenantId
Get balance sheet report.

**Response:**
```json
{
  "assets": 500000,
  "liabilities": 200000,
  "equity": 300000
}
```

---

### GET /api/accounting/reports/profit-loss/:tenantId
Get profit & loss report.

**Response:**
```json
{
  "revenue": 100000,
  "expenses": 60000,
  "netProfit": 40000
}
```

---

## Reports Endpoints

### GET /api/reports/sales/:tenantId
Get sales report.

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "totalSales": 50000,
  "totalOrders": 25,
  "topProducts": [...],
  "topCustomers": [...]
}
```

---

### GET /api/reports/production/:tenantId
Get production report.

---

### GET /api/reports/inventory/:tenantId
Get inventory report.

---

### GET /api/reports/dashboard/:tenantId
Get dashboard KPIs.

**Response:**
```json
{
  "totalRevenue": 500000,
  "totalExpenses": 300000,
  "netProfit": 200000,
  "activeCustomers": 50,
  "activeSuppliers": 10,
  "currentInventoryValue": 75000,
  "salesGrowth": 15,
  "productionCapacityUsage": 85
}
```

---

## Roles & Permissions Endpoints

### GET /api/roles
List all roles.

**Response:**
```json
{
  "data": [
    {
      "id": "role-id",
      "name": "Admin",
      "description": "Full system access",
      "permissions": ["create_users", "edit_users", ...]
    }
  ]
}
```

---

### POST /api/roles
Create a new role.

**Request Body:**
```json
{
  "name": "Manager",
  "description": "Operational oversight",
  "permissionIds": ["perm-id-1", "perm-id-2"]
}
```

---

### GET /api/permissions
List all permissions.

**Response:**
```json
{
  "data": [
    {
      "id": "perm-id",
      "name": "create_users",
      "description": "Can create new users"
    }
  ]
}
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Field name is required"]
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized - Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Authentication Example

All authenticated requests require JWT token in header:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/users
```

---

## Pagination Example

```bash
curl http://localhost:3000/api/products?page=1&limit=10
```

**Response Metadata:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

**For detailed information on all endpoints, refer to [server/IMPLEMENTATION_COMPLETE.md](../server/IMPLEMENTATION_COMPLETE.md).**
