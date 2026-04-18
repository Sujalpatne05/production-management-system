# Production Management System - Login Credentials

**Date:** April 15, 2026
**System Status:** ✅ READY TO USE
**Overall Cleanup:** 75% Complete

---

## 🚀 Server URLs

### Frontend
- **URL:** http://localhost:8081
- **Status:** ✅ Running on Vite
- **Port:** 8081

### Backend API
- **URL:** http://localhost:5000
- **Status:** ✅ Running on Express + Prisma
- **Port:** 5000
- **Database:** PostgreSQL (Neon)

---

## 👤 Default Login Credentials

### Super Admin Panel
**Role:** Super Admin (Full System Access)

| Field | Value |
|-------|-------|
| **Email** | superadmin@example.com |
| **Username** | superadmin |
| **Password** | password |
| **Access Level** | Platform-wide (All companies) |
| **Permissions** | ✅ All operations |

**Features Available:**
- ✅ Company Management (Create, Read, Update, Delete)
- ✅ User Management (All users across all companies)
- ✅ Subscription Plans (Create and manage plans)
- ✅ Company Subscriptions (Assign plans to companies)
- ✅ Admin Management (Manage company admins)
- ✅ Audit Logs (View all system activities)
- ✅ API Keys (Generate and manage API keys)
- ✅ Support Tickets (Manage support tickets)
- ✅ Analytics (Platform-wide analytics)
- ✅ All ERP Modules

---

### Company Admin Panel
**Role:** Admin (Company-specific Access)

| Field | Value |
|-------|-------|
| **Email** | admin@example.com |
| **Username** | admin |
| **Password** | password |
| **Access Level** | Company-specific |
| **Permissions** | ✅ Company operations only |

**Features Available:**
- ✅ User Management (Company users only)
- ✅ Company Settings (View and update)
- ✅ Subscription Details (View current plan)
- ✅ Audit Logs (Company-specific logs)
- ✅ Analytics (Company-specific analytics)
- ✅ All ERP Modules (Company data only)

---

### Regular User Panel
**Role:** User (Limited Access)

| Field | Value |
|-------|-------|
| **Email** | user@example.com |
| **Username** | user |
| **Password** | password |
| **Access Level** | Read-only |
| **Permissions** | ✅ View operations only |

**Features Available:**
- ✅ View Dashboard
- ✅ View Reports
- ✅ View Analytics
- ✅ View Company Data

---

## 🔐 Authentication

### Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "password"
}
```

### Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "role": "super_admin",
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "username": "superadmin"
  }
}
```

### Token Usage
Include token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📊 Super Admin Panel Features

### 1. Company Management
**Endpoint:** `/api/super-admin/companies`

**Operations:**
- ✅ View all companies
- ✅ Create new company
- ✅ Update company details
- ✅ Delete company (soft delete)
- ✅ View company statistics

**Example:**
```bash
# Get all companies
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/companies

# Create company
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","email":"acme@example.com"}' \
  http://localhost:5000/api/super-admin/companies
```

---

### 2. User Management
**Endpoint:** `/api/super-admin/users`

**Operations:**
- ✅ View all users
- ✅ Create new user
- ✅ Update user details
- ✅ Deactivate user
- ✅ Assign roles

**Example:**
```bash
# Get all users
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/users

# Create user
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"admin"}' \
  http://localhost:5000/api/super-admin/users
```

---

### 3. Subscription Management
**Endpoint:** `/api/super-admin/plans` and `/api/super-admin/subscriptions`

**Operations:**
- ✅ View subscription plans
- ✅ Create new plan
- ✅ Update plan details
- ✅ Manage company subscriptions
- ✅ Upgrade/downgrade plans

**Example:**
```bash
# Get all plans
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/plans

# Create plan
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pro","price":99,"maxUsers":50}' \
  http://localhost:5000/api/super-admin/plans
```

---

### 4. Admin Management
**Endpoint:** `/api/super-admin/admins`

**Operations:**
- ✅ View all admins
- ✅ Add admin to company
- ✅ Update admin role
- ✅ Deactivate admin

**Example:**
```bash
# Get all admins
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/admins

# Add admin
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"companyId":"company-123","userId":"user-456","role":"admin"}' \
  http://localhost:5000/api/super-admin/admins
```

---

### 5. Audit Logging
**Endpoint:** `/api/super-admin/audit-logs`

**Operations:**
- ✅ View all audit logs
- ✅ Filter by action, user, company
- ✅ Export logs as CSV
- ✅ View audit statistics

**Example:**
```bash
# Get audit logs
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/audit-logs

# Export as CSV
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/audit-logs/export/csv > logs.csv
```

---

### 6. API Keys
**Endpoint:** `/api/super-admin/api-keys`

**Operations:**
- ✅ Generate API keys
- ✅ View API keys
- ✅ Revoke API keys
- ✅ Track API key usage

**Example:**
```bash
# Get API keys
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/api-keys

# Create API key
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Integration Key"}' \
  http://localhost:5000/api/super-admin/api-keys
```

---

### 7. Support Tickets
**Endpoint:** `/api/super-admin/tickets`

**Operations:**
- ✅ View all tickets
- ✅ Create ticket
- ✅ Update ticket status
- ✅ Assign ticket
- ✅ Close ticket

**Example:**
```bash
# Get tickets
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/tickets

# Create ticket
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bug Report","description":"...","priority":"high"}' \
  http://localhost:5000/api/super-admin/tickets
```

---

## 📊 Company Admin Panel Features

### 1. User Management
**Endpoint:** `/api/company-admin/users`

**Operations:**
- ✅ View company users
- ✅ Create new user (within limit)
- ✅ Update user details
- ✅ Deactivate user

---

### 2. Company Settings
**Endpoint:** `/api/company-admin/settings`

**Operations:**
- ✅ View company details
- ✅ Update company information
- ✅ View subscription details
- ✅ View user limits

---

### 3. Audit Logs
**Endpoint:** `/api/company-admin/audit-logs`

**Operations:**
- ✅ View company-specific logs
- ✅ Filter by action
- ✅ Track company activities

---

### 4. Analytics
**Endpoint:** `/api/company-admin/analytics`

**Operations:**
- ✅ View company analytics
- ✅ Sales analytics
- ✅ Purchase analytics
- ✅ Inventory analytics

---

## 🔄 ERP Modules Available

All users have access to the following ERP modules (based on permissions):

1. **Dashboard** - Overview and metrics
2. **Sales Management** - Orders, invoices, customers
3. **Purchase Management** - Purchase orders, suppliers
4. **Inventory Management** - Stock, movements, transactions
5. **Production Management** - Production orders, stages
6. **HR Management** - Employees, attendance, payroll, leaves
7. **Accounting** - Accounts, transactions, reports
8. **Analytics** - Sales, purchase, inventory, production analytics
9. **Reports** - Custom reports and exports
10. **Settings** - System configuration

---

## 🧪 Testing the System

### 1. Login to Super Admin Panel
```bash
# Step 1: Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "password"
  }'

# Step 2: Use token in subsequent requests
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/super-admin/companies
```

### 2. Access Frontend
- Open browser: http://localhost:8081
- Login with credentials above
- Navigate to Super Admin Panel
- Manage companies, users, subscriptions, etc.

### 3. Test API Endpoints
- Use Postman or curl
- Include Authorization header with token
- Test all endpoints documented above

---

## 📝 Important Notes

### Security
- ⚠️ **Development Only:** These are default credentials for development
- ⚠️ **Change Passwords:** Change all passwords before production
- ⚠️ **Use HTTPS:** Always use HTTPS in production
- ⚠️ **Secure Tokens:** Store tokens securely on client side

### Database
- ✅ **PostgreSQL:** Using Neon PostgreSQL
- ✅ **Prisma ORM:** Database abstraction layer
- ✅ **Migrations:** Run `npm run prisma:migrate` to apply migrations

### Troubleshooting
- **Port Already in Use:** Kill process on port 5000 or 8081
- **Database Connection:** Check DATABASE_URL in .env
- **CORS Issues:** Check CORS configuration in server-prisma.js
- **Token Expired:** Re-login to get new token

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd production-management-system/backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd production-management-system
npm install
npm run dev
```

### 3. Login
- Frontend: http://localhost:8081
- Email: superadmin@example.com
- Password: password

### 4. Explore
- Navigate through Super Admin Panel
- Create companies, users, subscriptions
- View analytics and reports
- Manage all system features

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API endpoints
3. Check browser console for errors
4. Check server logs for backend errors
5. Verify database connection

---

**System Status:** ✅ READY TO USE
**Last Updated:** April 15, 2026
**Version:** 1.0.0

