# System Architecture - Multi-Tenant ERP

## Overview

This is a **multi-tenant ERP system** where multiple companies can use the same application with complete data isolation.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  - Dashboard with company-specific metrics                  │
│  - Role-based menu filtering (RBAC)                         │
│  - Company context from localStorage                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express)                    │
│  - Authentication (JWT tokens)                              │
│  - Authorization (Role-based access control)                │
│  - Company isolation enforcement                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC MODULES                     │
│  - Company Isolation Module (enforces data isolation)       │
│  - User Management Module (company-specific users)          │
│  - Dashboard Metrics Module (company-specific analytics)    │
│  - RBAC Module (role-based access control)                  │
│  - Audit Module (logging all operations)                    │
│  - And 15+ other specialized modules                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                      │
│  - All data tagged with companyId                           │
│  - Indexes on companyId for fast filtering                  │
│  - Audit logs with company context                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Model

### **Core Tables**

```
┌─────────────────────────────────────────────────────────────┐
│                      COMPANIES                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                     │
│ name                                                        │
│ email                                                       │
│ subscriptionPlan (basic, professional, enterprise)          │
│ maxUsers (based on plan)                                    │
│ maxStorage (based on plan)                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                     │
│ name                                                        │
│ email                                                       │
│ role (CEO, Finance Manager, Sales Manager, etc.)           │
│ companyId (FK) ← ISOLATION KEY                             │
│ status (active, inactive)                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS DATA                             │
├─────────────────────────────────────────────────────────────┤
│ Sales                                                       │
│ Purchases                                                   │
│ Inventory                                                   │
│ Orders                                                      │
│ Production                                                  │
│ Expenses                                                    │
│ Payments                                                    │
│ ... (all tagged with companyId)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER LOGS IN                                             │
│    POST /api/auth/login                                     │
│    { email, password }                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. BACKEND VALIDATES                                        │
│    - Check email exists                                     │
│    - Verify password (bcrypt)                               │
│    - Get user's company (companyId)                         │
│    - Get user's role                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. GENERATE JWT TOKEN                                       │
│    {                                                        │
│      id: "user-123",                                        │
│      role: "Finance Manager",                               │
│      companyId: "company-a-id",                             │
│      email: "user@company-a.com"                            │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. FRONTEND STORES TOKEN & COMPANY                          │
│    localStorage.setItem('authToken', token)                 │
│    localStorage.setItem('tenant', {                         │
│      id: "company-a-id",                                    │
│      name: "Company A"                                      │
│    })                                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. FRONTEND MAKES API CALLS                                 │
│    GET /api/sales                                           │
│    Headers: Authorization: Bearer {token}                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. BACKEND VALIDATES REQUEST                                │
│    - Verify JWT token                                       │
│    - Extract user info from token                           │
│    - Check user's role has permission                       │
│    - Get user's companyId from token                        │
│    - Filter data: WHERE companyId = user.companyId          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. RETURN COMPANY-SPECIFIC DATA                             │
│    [                                                        │
│      { id: "sale-1", amount: 10000, companyId: "company-a" }│
│      { id: "sale-2", amount: 20000, companyId: "company-a" }│
│    ]                                                        │
│    (Only Company A's sales)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Role-Based Access Control (RBAC)

### **Roles & Permissions**

```
SUPER_ADMIN
├── Access: All companies, all modules
├── Can: Create companies, manage admins, view all data
└── Cannot: None (full access)

ADMIN (Company Admin)
├── Access: Their company only
├── Can: Manage users, view all modules, create data
└── Cannot: Access other companies, create super_admin

CEO
├── Access: All modules in their company
├── Can: View all data, make strategic decisions
└── Cannot: Access other companies

FINANCE_MANAGER
├── Access: Accounting, Budget, Forecasting, Reports
├── Can: View financial data, create reports
└── Cannot: Access Sales, Manufacturing, HR

SALES_MANAGER
├── Access: Sales, CRM, Orders, Inventory, Reports
├── Can: Create sales, manage customers
└── Cannot: Access Accounting, Manufacturing, HR

PRODUCTION_MANAGER
├── Access: Manufacturing, MRP, Quality, Goods Receipt
├── Can: Create production orders, manage quality
└── Cannot: Access Sales, Accounting, HR

... (and 6 more roles)
```

### **Menu Filtering**

```
Frontend (AppSidebar.tsx)
├── Get user role from token
├── Get allowed menus for role (from rolePermissions.ts)
├── Filter menu items
└── Display only allowed modules

Example:
Finance Manager sees:
  ✅ Home
  ✅ Dashboard
  ✅ Accounting
  ✅ Accounting Periods
  ✅ Budget Planning
  ✅ Forecasting
  ✅ Reports
  ❌ Sales (hidden)
  ❌ Manufacturing (hidden)
  ❌ HR (hidden)
```

---

## Company Isolation Implementation

### **How Data is Isolated**

```
WHEN USER CREATES DATA:
┌─────────────────────────────────────────────────────────────┐
│ 1. User logs in as Company A Admin                          │
│    Token contains: companyId = "company-a-id"               │
│                                                             │
│ 2. User creates sale                                        │
│    POST /api/sales                                          │
│    { amount: 10000, customer: "Customer A" }                │
│                                                             │
│ 3. Backend processes request                                │
│    - Extracts companyId from token                          │
│    - Adds companyId to request data                         │
│    - Saves: { amount: 10000, customer: "...",              │
│              companyId: "company-a-id" }                    │
│                                                             │
│ 4. Data stored in database                                  │
│    All Company A data tagged with "company-a-id"            │
└─────────────────────────────────────────────────────────────┘

WHEN USER READS DATA:
┌─────────────────────────────────────────────────────────────┐
│ 1. User logs in as Company B Admin                          │
│    Token contains: companyId = "company-b-id"               │
│                                                             │
│ 2. User requests sales                                      │
│    GET /api/sales                                           │
│                                                             │
│ 3. Backend processes request                                │
│    - Extracts companyId from token                          │
│    - Adds filter: WHERE companyId = "company-b-id"          │
│    - Queries database                                       │
│                                                             │
│ 4. Database returns only Company B's sales                  │
│    Company A's sales are NOT returned                       │
└─────────────────────────────────────────────────────────────┘
```

### **Company Isolation Module**

```
backend/company-isolation-module.js
├── getUserCompanyId(prisma, userId, userRole)
│   └── Returns user's company ID (null for super admin)
│
├── validateCompanyAccess(prisma, userId, userRole, targetCompanyId)
│   └── Checks if user can access company
│
├── createCompanyIsolatedCrudEndpoints(...)
│   ├── GET /api/{resource}
│   │   └── Filters by user's company
│   ├── POST /api/{resource}
│   │   └── Assigns user's company
│   ├── PUT /api/{resource}/:id
│   │   └── Validates user owns record
│   └── DELETE /api/{resource}/:id
│       └── Validates user owns record
│
└── setupCompanyIsolationModule(app, prisma, ...)
    └── Initializes all company isolation features
```

---

## Data Flow Example

### **Scenario: Finance Manager Creates Expense**

```
1. FRONTEND
   ├── User logs in
   ├── Token stored: { id: "user-123", role: "Finance Manager", companyId: "company-a" }
   ├── Company stored: { id: "company-a", name: "Company A" }
   └── User navigates to Expenses

2. USER CREATES EXPENSE
   ├── Fills form: { description: "Office Supplies", amount: 5000 }
   ├── Clicks "Create"
   └── Frontend sends: POST /api/expenses
                       { description: "...", amount: 5000 }
                       Headers: Authorization: Bearer {token}

3. BACKEND RECEIVES REQUEST
   ├── Validates JWT token
   ├── Extracts: { id: "user-123", role: "Finance Manager", companyId: "company-a" }
   ├── Checks: Is user authorized to create expenses? YES (Finance Manager)
   ├── Gets: User's company = "company-a"
   └── Adds to request: companyId = "company-a"

4. DATABASE STORES
   ├── Saves: {
   │     id: "expense-123",
   │     description: "Office Supplies",
   │     amount: 5000,
   │     companyId: "company-a",
   │     createdBy: "user-123",
   │     createdAt: "2026-04-17T10:00:00Z"
   │   }
   └── Audit log: { action: "create", resource: "expense", companyId: "company-a" }

5. FRONTEND RECEIVES RESPONSE
   ├── Success: Expense created
   ├── Updates UI: Shows new expense
   └── Stores in state

6. WHEN COMPANY B ADMIN REQUESTS EXPENSES
   ├── Backend filters: WHERE companyId = "company-b"
   ├── Result: Company B's expenses only
   └── Company A's expense is NOT visible
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: AUTHENTICATION                                     │
│ - JWT token validation                                      │
│ - Password hashing (bcrypt)                                 │
│ - Token expiration (8 hours)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: AUTHORIZATION                                      │
│ - Role-based access control (RBAC)                          │
│ - Menu filtering based on role                              │
│ - Endpoint permission checks                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: COMPANY ISOLATION                                  │
│ - Automatic company assignment                              │
│ - Company ID validation on all operations                   │
│ - Cross-company access prevention                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 4: AUDIT LOGGING                                      │
│ - All operations logged                                     │
│ - Company context captured                                  │
│ - User actions tracked                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Vercel/Netlify)                       │
│  - React + Vite                                             │
│  - Port 8081 (dev) / Production URL                         │
│  - Stores auth token & company context                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Render/Heroku)                         │
│  - Express.js                                               │
│  - Port 5001                                                │
│  - Handles all business logic                               │
│  - Enforces company isolation                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Neon PostgreSQL)                      │
│  - Cloud-hosted PostgreSQL                                  │
│  - All data with companyId tags                             │
│  - Automatic backups                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

This is a **production-ready multi-tenant ERP system** with:

✅ **Complete data isolation** between companies
✅ **Role-based access control** for 12 different roles
✅ **Automatic company assignment** on all operations
✅ **Comprehensive audit logging** for compliance
✅ **Scalable architecture** supporting unlimited companies
✅ **Security layers** protecting data at multiple levels
✅ **Cloud deployment** ready for production use
