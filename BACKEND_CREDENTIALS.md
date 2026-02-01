# Backend Access Credentials

## Role Hierarchy

```
Superadmin (Developer)
    └── Manages: System access control, decides login access
    
Admin (Company Admin)
    └── Manages: Company operations, full permissions
    
User (Regular User)
    └── Manages: View-only access to basic operations
```

---

## Default Login Credentials

### 1. Superadmin Account
- **Email**: `superadmin@system.com`
- **Password**: Set via authentication endpoint
- **Permissions**: ✅ All permissions (System level)
- **Role**: Superadmin
- **Purpose**: Developer/System administrator - controls who gets access

### 2. Admin Account
- **Email**: `admin@demo.com`
- **Password**: Set via authentication endpoint
- **Permissions**: ✅ All permissions (Company level)
- **Role**: Admin
- **Purpose**: Company administrator - manages operations

### 3. User Account
- **Email**: `user@demo.com`
- **Password**: Set via authentication endpoint
- **Permissions**: ✅ Limited permissions (Read-only for most operations)
- **Role**: User
- **Purpose**: Regular employee - view orders, production, inventory

---

## Available Permissions

### Superadmin & Admin have access to:
- `orders.read` - View orders
- `orders.write` - Create/Update orders
- `orders.delete` - Delete orders
- `users.read` - View users
- `users.write` - Manage users
- `users.delete` - Delete users
- `tenants.manage` - Manage tenants
- `production.read` - View production data
- `production.write` - Manage production
- `inventory.read` - View inventory
- `inventory.write` - Manage inventory
- `reports.view` - View reports

### Regular User has access to:
- `orders.read` - View orders
- `production.read` - View production data
- `inventory.read` - View inventory

---

## API Login Endpoint

**POST** `/api/auth/login`

```json
{
  "email": "admin@demo.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@demo.com",
    "fullName": "Admin User",
    "roles": ["Admin"],
    "tenant": {
      "id": "demo-tenant-id",
      "name": "Demo Company"
    }
  }
}
```

---

## Backend Server

**Base URL**: `http://localhost:3000`
**API Prefix**: `/api`

### Server Status
- ✅ NestJS server ready
- ✅ PostgreSQL database configured
- ✅ Redis cache ready
- ✅ Authentication system active
- ✅ 100+ API endpoints available

---

## Database Credentials (Demo)

- **Tenant ID**: `demo-tenant-id`
- **Tenant Name**: `Demo Company`

### Seeded Data:
- ✅ 3 User accounts (Superadmin, Admin, User)
- ✅ 5 Roles (Superadmin, Admin, User, Manager, Supervisor)
- ✅ 12 Permissions configured
- ✅ Sample products, customers, suppliers
- ✅ Production stages setup
- ✅ Chart of accounts initialized

