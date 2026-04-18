# Consolidated Modules - Quick Reference Guide

**Date:** April 15, 2026
**Status:** ✅ COMPLETE
**Modules:** 4 (User, HR, Analytics, Inventory)

---

## Module Overview

### 1. User Management Module
**File:** `backend/user-module.js` (450 lines)
**Purpose:** Consolidated user management across all levels

#### Endpoints
```
Super Admin (Platform-wide):
  GET    /api/super-admin/users
  GET    /api/super-admin/users/:id
  POST   /api/super-admin/users
  PUT    /api/super-admin/users/:id
  DELETE /api/super-admin/users/:id

Company Admin (Company-specific):
  GET    /api/company-admin/users
  POST   /api/company-admin/users
  PUT    /api/company-admin/users/:id
  DELETE /api/company-admin/users/:id

Generic (Backward compatibility):
  GET    /api/users
  GET    /api/users/:id
  POST   /api/users
  PUT    /api/users/:id
  DELETE /api/users/:id
```

#### Features
- Multi-level user management
- Email and username uniqueness validation
- User limit enforcement
- Audit logging
- Role-based access control
- Company isolation

#### Example Usage
```javascript
// Create user (super admin)
POST /api/super-admin/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "role": "admin",
  "companyId": "company-123"
}

// Get users in company (company admin)
GET /api/company-admin/users?limit=10&offset=0

// Update user (super admin)
PUT /api/super-admin/users/user-123
{
  "role": "manager",
  "status": "active"
}
```

---

### 2. HR/Payroll/Attendance Module
**File:** `backend/hr-consolidated-module.js` (500 lines)
**Purpose:** Consolidated HR operations (employees, attendance, payroll, leaves)

#### Endpoints
```
Employee Management:
  POST   /api/hr/employees
  GET    /api/hr/employees
  GET    /api/hr/employees/:id
  PUT    /api/hr/employees/:id
  DELETE /api/hr/employees/:id

Leave Management:
  POST   /api/hr/leaves
  GET    /api/hr/leaves
  GET    /api/hr/leaves/:id
  PUT    /api/hr/leaves/:id
  POST   /api/hr/leaves/:id/approve
  POST   /api/hr/leaves/:id/reject
  DELETE /api/hr/leaves/:id

Attendance Management:
  POST   /api/hr/attendance
  GET    /api/hr/attendance
  GET    /api/hr/attendance/:employeeId
  PUT    /api/hr/attendance/:id
  DELETE /api/hr/attendance/:id

Payroll Management:
  POST   /api/hr/payroll
  GET    /api/hr/payroll
  GET    /api/hr/payroll/:employeeId
  PUT    /api/hr/payroll/:id
  POST   /api/hr/payroll/:id/process
  DELETE /api/hr/payroll/:id
```

#### Features
- Comprehensive HR operations
- Employee management
- Leave approval workflow
- Attendance tracking
- Payroll calculation
- Company-specific filtering
- Status tracking
- Pagination support

#### Example Usage
```javascript
// Create employee
POST /api/hr/employees
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "department": "Sales",
  "position": "Sales Manager",
  "salary": 50000,
  "joinDate": "2024-01-15",
  "companyId": "company-123"
}

// Record attendance
POST /api/hr/attendance
{
  "employeeId": "emp-123",
  "date": "2024-04-15",
  "inTime": "09:00",
  "outTime": "17:30",
  "status": "present"
}

// Create payroll
POST /api/hr/payroll
{
  "employeeId": "emp-123",
  "month": "2024-04",
  "basicSalary": 50000,
  "bonus": 5000,
  "deductions": 2000
}

// Request leave
POST /api/hr/leaves
{
  "employeeId": "emp-123",
  "leaveType": "annual",
  "startDate": "2024-05-01",
  "endDate": "2024-05-05",
  "reason": "Vacation"
}

// Approve leave
POST /api/hr/leaves/leave-123/approve

// Get employee attendance
GET /api/hr/attendance/emp-123?limit=30&offset=0
```

---

### 3. Analytics Module
**File:** `backend/analytics-module.js` (350 lines)
**Purpose:** Consolidated analytics across all business areas

#### Endpoints
```
Platform Analytics (Super Admin):
  GET /api/super-admin/analytics

Company Analytics (Company Admin):
  GET /api/company-admin/analytics

Sales Analytics:
  GET /api/analytics/sales
  GET /api/analytics/sales/by-customer

Purchase Analytics:
  GET /api/analytics/purchases
  GET /api/analytics/purchases/by-supplier

Inventory Analytics:
  GET /api/analytics/inventory
  GET /api/analytics/inventory/low-stock

Production Analytics:
  GET /api/analytics/production

Order Analytics:
  GET /api/analytics/orders

Dashboard Metrics:
  GET /api/analytics/dashboard
```

#### Features
- Platform-wide analytics
- Company-specific analytics
- Sales analytics
- Purchase analytics
- Inventory analytics
- Production analytics
- Order analytics
- Dashboard metrics
- Date range filtering
- Company filtering

#### Example Usage
```javascript
// Get platform analytics (super admin)
GET /api/super-admin/analytics

// Get company analytics (company admin)
GET /api/company-admin/analytics

// Get sales analytics
GET /api/analytics/sales?startDate=2024-01-01&endDate=2024-04-15

// Get low stock items
GET /api/analytics/inventory/low-stock?companyId=company-123

// Get dashboard metrics
GET /api/analytics/dashboard?companyId=company-123
```

---

### 4. Inventory Module
**File:** `backend/inventory-module.js` (280 lines)
**Purpose:** Consolidated inventory management

#### Endpoints
```
Inventory CRUD:
  GET    /api/inventory
  GET    /api/inventory/:id
  POST   /api/inventory
  PUT    /api/inventory/:id
  DELETE /api/inventory/:id

Stock Transactions:
  GET    /api/inventory/transactions
  POST   /api/inventory/transactions

Stock Movements:
  POST   /api/inventory/movements
  GET    /api/inventory/movements
```

#### Features
- Inventory CRUD operations
- Stock transaction tracking
- Stock movement history
- Low stock tracking
- Negative inventory prevention
- Company-specific filtering
- Pagination support

#### Example Usage
```javascript
// Create inventory item
POST /api/inventory
{
  "name": "Product A",
  "sku": "SKU-001",
  "quantity": 100,
  "price": 50,
  "companyId": "company-123"
}

// Record stock movement
POST /api/inventory/movements
{
  "inventoryId": "inv-123",
  "type": "in",
  "quantity": 50,
  "reason": "Purchase order",
  "companyId": "company-123"
}

// Get low stock items
GET /api/inventory?lowStock=true&companyId=company-123

// Get stock transactions
GET /api/inventory/transactions?inventoryId=inv-123
```

---

## Migration Guide

### From Old Endpoints to New Modules

#### User Management
```
OLD: /api/users → NEW: /api/users (same, now via user-module.js)
OLD: /api/super-admin/users → NEW: /api/super-admin/users (same, now via user-module.js)
OLD: /api/company-admin/users → NEW: /api/company-admin/users (same, now via user-module.js)
OLD: /api/hr/employees → NEW: /api/hr/employees (same, now via hr-consolidated-module.js)
```

#### HR Operations
```
OLD: /api/hr/employees → NEW: /api/hr/employees (same, now via hr-consolidated-module.js)
OLD: /api/hr/attendance → NEW: /api/hr/attendance (same, now via hr-consolidated-module.js)
OLD: /api/hr/payroll → NEW: /api/hr/payroll (same, now via hr-consolidated-module.js)
OLD: /api/hr/leaves → NEW: /api/hr/leaves (same, now via hr-consolidated-module.js)
OLD: /api/attendance → NEW: /api/hr/attendance (same, now via hr-consolidated-module.js)
OLD: /api/payroll → NEW: /api/hr/payroll (same, now via hr-consolidated-module.js)
```

#### Analytics
```
OLD: /api/orders/stats/:tenantId → NEW: /api/analytics/orders
OLD: /api/sales/analytics → NEW: /api/analytics/sales
OLD: /api/purchases/analytics → NEW: /api/analytics/purchases
OLD: /api/inventory/analytics → NEW: /api/analytics/inventory
OLD: /api/super-admin/analytics → NEW: /api/super-admin/analytics (same, now via analytics-module.js)
```

#### Inventory
```
OLD: /api/inventory → NEW: /api/inventory (same, now via inventory-module.js)
OLD: /api/stock-transactions → NEW: /api/inventory/transactions
OLD: /api/inventory/movements → NEW: /api/inventory/movements (same, now via inventory-module.js)
```

---

## Common Patterns

### Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Response Format
All endpoints return consistent response format:
```javascript
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Operation successful",
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

### Error Handling
```javascript
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Pagination
Most list endpoints support pagination:
```
GET /api/endpoint?limit=10&offset=0
```

### Filtering
Most list endpoints support filtering:
```
GET /api/endpoint?status=active&companyId=company-123
```

---

## Best Practices

### 1. Always Include Company Context
When working with company-specific data, always include `companyId`:
```javascript
GET /api/hr/employees?companyId=company-123
```

### 2. Use Pagination for Large Datasets
Always use pagination for list endpoints:
```javascript
GET /api/users?limit=10&offset=0
```

### 3. Validate Input Data
All endpoints validate input data. Check error responses:
```javascript
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "name": "Name is required"
  }
}
```

### 4. Handle Audit Logging
All operations are automatically logged. Check audit logs:
```javascript
GET /api/super-admin/audit-logs?companyId=company-123
```

### 5. Respect User Limits
Company admins cannot exceed user limits:
```javascript
{
  "success": false,
  "error": "User limit exceeded. Current: 10, Limit: 10",
  "code": "USER_LIMIT_EXCEEDED"
}
```

---

## Troubleshooting

### Issue: Endpoint not found
**Solution:** Check if endpoint is in the correct module
- User endpoints: user-module.js
- HR endpoints: hr-consolidated-module.js
- Analytics endpoints: analytics-module.js
- Inventory endpoints: inventory-module.js

### Issue: Duplicate endpoints
**Solution:** All endpoints are now consolidated. Use the new module endpoints.

### Issue: Data not showing
**Solution:** Check if you're filtering by correct company:
```javascript
GET /api/hr/employees?companyId=company-123
```

### Issue: Permission denied
**Solution:** Check your role and authorization level:
- Super admin: Full access
- Company admin: Company-specific access
- User: Limited access

---

## Performance Tips

1. **Use pagination** for large datasets
2. **Filter by company** to reduce data
3. **Use date ranges** for analytics
4. **Cache results** on client side
5. **Batch operations** when possible

---

## Support

For issues or questions:
1. Check this guide
2. Review endpoint documentation
3. Check error messages
4. Review audit logs
5. Contact support

---

**Guide Generated:** April 15, 2026
**Status:** ✅ COMPLETE
**Modules:** 4 (User, HR, Analytics, Inventory)

