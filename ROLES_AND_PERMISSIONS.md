# ERP System Roles and Permissions Documentation

## Overview

This document provides a comprehensive guide to all available roles in the Production Management System ERP. The system uses a Role-Based Access Control (RBAC) model where each user is assigned a role that determines what actions they can perform and what data they can access.

---

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN                              │
│  System-level administrator with unrestricted access        │
│  Manages all companies, users, and system settings           │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN (Company Admin)                     │
│  Company-level administrator                                │
│  Manages users and settings within their company only        │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                    USER (Regular User)                       │
│  Standard user with read-only access                         │
│  Can view data but cannot create, modify, or delete          │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Role Definitions

### 1. Super Admin

**Role ID**: `super_admin`  
**Display Name**: Super Admin  
**Permissions**: `["*"]` (All permissions)

#### Description
The Super Admin role represents a system-level administrator with unrestricted access to all features, companies, and system settings. There should be only one Super Admin in the system to maintain security and control.

#### Capabilities

| Feature | Capability | Details |
|---------|-----------|---------|
| **Company Management** | Full CRUD | Create, read, update, delete all companies |
| **Admin Management** | Full CRUD | Assign/remove company admins, manage admin roles |
| **User Management** | Full CRUD | Create, read, update, delete users across all companies |
| **Subscription Plans** | Full CRUD | Create, update, delete subscription plans |
| **Company Subscriptions** | Full CRUD | Assign/upgrade/downgrade plans for companies |
| **Audit Logs** | Read All | View all system-wide audit logs with filtering |
| **Analytics** | Full Access | View platform-wide analytics and company statistics |
| **API Keys** | Full CRUD | Create, revoke, and manage API keys |
| **Support Tickets** | Full CRUD | Create, read, update, delete support tickets |
| **System Settings** | Full CRUD | Modify system-wide settings and configurations |
| **Data Isolation** | None | Can access all companies' data without restrictions |

#### Access Scope
- **Companies**: All companies (including deleted ones)
- **Users**: All users across all companies
- **Data**: All data in the system
- **Cross-Company Access**: Unrestricted

#### Typical Use Cases
- System administrator managing the entire platform
- Setting up new companies and subscription plans
- Managing company administrators
- Viewing system-wide analytics and reports
- Handling system maintenance and configuration
- Investigating issues across multiple companies
- Exporting platform-wide data

#### Restrictions
- None (unrestricted access)

#### Example Endpoints
```
GET    /api/super-admin/companies
POST   /api/super-admin/companies
PUT    /api/super-admin/companies/:id
DELETE /api/super-admin/companies/:id

GET    /api/super-admin/admins
POST   /api/super-admin/admins
PUT    /api/super-admin/admins/:id
DELETE /api/super-admin/admins/:id

GET    /api/super-admin/plans
POST   /api/super-admin/plans
DELETE /api/super-admin/plans/:id

GET    /api/super-admin/audit-logs
GET    /api/super-admin/analytics
GET    /api/super-admin/api-keys
```

---

### 2. Admin (Company Admin)

**Role ID**: `admin`  
**Display Name**: Admin  
**Permissions**: `["read", "write", "delete"]`

#### Description
The Admin role represents a company-level administrator responsible for managing users and settings within their assigned company. Company Admins have restricted access and can only manage their own company's data.

#### Capabilities

| Feature | Capability | Details |
|---------|-----------|---------|
| **Company Management** | Read Only | View own company details |
| **User Management** | Full CRUD | Create, read, update, delete users in own company |
| **User Limit Enforcement** | Enforced | Cannot exceed subscription plan user limit |
| **Role Assignment** | Limited | Can assign "user" and "admin" roles (NOT "super_admin") |
| **Company Settings** | Update | Update own company name, email, phone, address, website |
| **Subscription Details** | Read Only | View current plan, user limit, storage usage |
| **Audit Logs** | Read Own | View audit logs for own company only |
| **Analytics** | None | Cannot access system-wide analytics |
| **Password Management** | Self-Service | Change own password, request password reset |
| **Admin Profile** | Update | Update own name and email |
| **Data Isolation** | Enforced | Can only access own company's data |

#### Access Scope
- **Companies**: Only their assigned company
- **Users**: Only users in their company
- **Data**: Only data belonging to their company
- **Cross-Company Access**: Denied (403 Forbidden)

#### Typical Use Cases
- Managing team members within the company
- Adding new users to the company
- Deactivating users who leave the company
- Updating company profile information
- Viewing company-specific audit logs
- Managing user roles within the company
- Changing personal password
- Viewing subscription details and user limits

#### Restrictions
- Cannot create or assign "super_admin" role
- Cannot modify company subscription plan
- Cannot view other companies' data
- Cannot access system-wide analytics
- Cannot create or manage API keys
- Cannot manage other company admins
- Cannot delete company
- Cannot view system-wide audit logs

#### Example Endpoints
```
GET    /api/company-admin/users
POST   /api/company-admin/users
PUT    /api/company-admin/users/:id
DELETE /api/company-admin/users/:id

GET    /api/company-admin/settings
PUT    /api/company-admin/settings

GET    /api/company-admin/subscription
GET    /api/company-admin/profile
PUT    /api/company-admin/profile

POST   /api/company-admin/password-change
POST   /api/company-admin/password-reset

GET    /api/company-admin/audit-logs
```

#### Permission Boundary Enforcement
When a Company Admin attempts to:
- **Create super_admin user**: ❌ Denied (403 Forbidden)
- **Access another company's data**: ❌ Denied (403 Forbidden)
- **Modify subscription plan**: ❌ Denied (403 Forbidden)
- **View system-wide analytics**: ❌ Denied (403 Forbidden)
- **Create API keys**: ❌ Denied (403 Forbidden)

---

### 3. User (Regular User)

**Role ID**: `user`  
**Display Name**: User  
**Permissions**: `["read"]`

#### Description
The User role represents a standard user with read-only access to the system. Users can view data but cannot create, modify, or delete any records. This is the most restrictive role.

#### Capabilities

| Feature | Capability | Details |
|---------|-----------|---------|
| **Data Access** | Read Only | View all data accessible to their company |
| **Company Data** | Read Only | View company information and settings |
| **User Directory** | Read Only | View list of users in their company |
| **Orders** | Read Only | View orders (cannot create or modify) |
| **Sales** | Read Only | View sales records (cannot create or modify) |
| **Inventory** | Read Only | View inventory items (cannot create or modify) |
| **Purchases** | Read Only | View purchase records (cannot create or modify) |
| **Expenses** | Read Only | View expense records (cannot create or modify) |
| **Reports** | Read Only | View reports and analytics for own company |
| **Audit Logs** | None | Cannot view audit logs |
| **Password Management** | Self-Service | Change own password, request password reset |
| **Profile** | Update | Update own name and email |
| **Data Isolation** | Enforced | Can only access own company's data |

#### Access Scope
- **Companies**: Only their assigned company
- **Users**: Can see other users in their company (read-only)
- **Data**: Only data belonging to their company
- **Cross-Company Access**: Denied (403 Forbidden)

#### Typical Use Cases
- Viewing company data and reports
- Checking order and sales status
- Reviewing inventory levels
- Viewing expense records
- Accessing dashboards and analytics
- Changing personal password
- Updating personal profile

#### Restrictions
- Cannot create any records
- Cannot modify any records
- Cannot delete any records
- Cannot view other companies' data
- Cannot manage users
- Cannot modify company settings
- Cannot view audit logs
- Cannot access admin features
- Cannot create or manage API keys

#### Example Endpoints (Read-Only)
```
GET    /api/users
GET    /api/orders
GET    /api/sales
GET    /api/inventory
GET    /api/purchases
GET    /api/expenses
GET    /api/reports

POST   /api/password-change (self-service)
POST   /api/password-reset (self-service)
PUT    /api/profile (self-service)
```

---

## Permission Matrix

| Feature | Super Admin | Admin | User |
|---------|:-----------:|:-----:|:----:|
| **Company Management** | ✅ Full | ✅ Read | ❌ No |
| **User Management** | ✅ Full | ✅ Full | ❌ No |
| **Subscription Plans** | ✅ Full | ❌ No | ❌ No |
| **Audit Logs** | ✅ All | ✅ Own Company | ❌ No |
| **Analytics** | ✅ Platform-wide | ❌ No | ✅ Own Company (Read) |
| **API Keys** | ✅ Full | ❌ No | ❌ No |
| **Support Tickets** | ✅ Full | ❌ No | ❌ No |
| **System Settings** | ✅ Full | ❌ No | ❌ No |
| **Data Access** | ✅ All Companies | ✅ Own Company | ✅ Own Company (Read) |
| **Cross-Company Access** | ✅ Allowed | ❌ Denied | ❌ Denied |
| **Password Management** | ✅ Self-Service | ✅ Self-Service | ✅ Self-Service |

---

## Permission Codes

The system uses the following permission codes for fine-grained access control:

| Code | Description | Used By |
|------|-------------|---------|
| `*` | All permissions (unrestricted) | Super Admin |
| `read` | Read/view data | User, Admin |
| `write` | Create and modify data | Admin |
| `delete` | Delete data | Admin |

---

## Data Isolation Rules

### Super Admin
- **No isolation**: Can access all companies and all data
- **Audit trail**: All actions are logged with super admin context

### Admin (Company Admin)
- **Company-level isolation**: Can only access their assigned company
- **User-level isolation**: Can only manage users in their company
- **Data-level isolation**: All queries automatically filtered by companyId
- **Cross-company denial**: Any attempt to access other companies' data returns 403 Forbidden
- **Audit trail**: All actions are logged with company context

### User
- **Company-level isolation**: Can only access their assigned company
- **Read-only access**: Cannot modify any data
- **Data-level isolation**: All queries automatically filtered by companyId
- **Cross-company denial**: Any attempt to access other companies' data returns 403 Forbidden
- **Audit trail**: All actions are logged with user context

---

## Role Assignment Rules

### Who Can Assign Roles?

| Role | Can Assign | Can Assign To |
|------|-----------|---------------|
| **Super Admin** | ✅ Yes | Any role (super_admin, admin, user) |
| **Admin** | ✅ Yes (Limited) | user, admin (NOT super_admin) |
| **User** | ❌ No | N/A |

### Role Assignment Restrictions

1. **Super Admin Role**
   - Only Super Admin can create/assign super_admin role
   - Company Admins cannot create super_admin users
   - System enforces: Only one Super Admin per system

2. **Admin Role**
   - Super Admin can assign admin role to any user
   - Company Admin can assign admin role to users in their company
   - Admin role is tied to a specific company

3. **User Role**
   - Any admin can assign user role
   - User role is the default for new users
   - Users cannot be assigned higher roles by other users

---

## API Response Examples

### Get Available Roles
```bash
GET /api/roles
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Super Admin",
      "permissions": ["*"]
    },
    {
      "id": "2",
      "name": "Admin",
      "permissions": ["read", "write", "delete"]
    },
    {
      "id": "3",
      "name": "User",
      "permissions": ["read"]
    }
  ],
  "total": 3
}
```

### Create User with Role
```bash
POST /api/company-admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "+1234567890",
  "department": "Sales"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "companyId": "company_456",
    "createdAt": "2026-04-15T10:30:00Z"
  },
  "message": "User created successfully"
}
```

### Attempt to Create Super Admin (Company Admin)
```bash
POST /api/company-admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "super_admin"
}
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "Company admins cannot create super_admin users",
  "code": "FORBIDDEN"
}
```

---

## Audit Logging

All role-based actions are logged in the audit trail:

```json
{
  "id": "audit_789",
  "userId": "user_123",
  "companyId": "company_456",
  "action": "create",
  "resourceType": "user",
  "resourceId": "user_789",
  "changes": {
    "created": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "status": "success",
  "createdAt": "2026-04-15T10:30:00Z"
}
```

---

## Security Best Practices

### For Super Admin
1. ✅ Use strong, unique password
2. ✅ Enable multi-factor authentication (when available)
3. ✅ Limit number of Super Admin accounts (ideally 1-2)
4. ✅ Regularly audit Super Admin actions
5. ✅ Use Super Admin account only for administrative tasks
6. ✅ Create separate Admin accounts for daily operations

### For Company Admin
1. ✅ Use strong, unique password
2. ✅ Regularly review user access
3. ✅ Deactivate users who leave the company
4. ✅ Monitor audit logs for suspicious activity
5. ✅ Follow principle of least privilege
6. ✅ Don't share admin credentials

### For Users
1. ✅ Use strong, unique password
2. ✅ Change password regularly
3. ✅ Don't share login credentials
4. ✅ Report suspicious activity
5. ✅ Log out when finished
6. ✅ Use VPN for remote access

---

## Comparison with Competitor Systems

### Our System vs. Industry Standards

| Feature | Our System | Typical Competitor |
|---------|-----------|-------------------|
| **Role Hierarchy** | 3 levels (Super Admin, Admin, User) | 3-5 levels |
| **Permission Model** | RBAC (Role-Based) | RBAC + ABAC (Attribute-Based) |
| **Data Isolation** | Company-level | Company-level + Department-level |
| **Custom Roles** | Not yet | Yes (Premium feature) |
| **Fine-grained Permissions** | Basic | Advanced |
| **Audit Logging** | Comprehensive | Comprehensive |
| **API Key Management** | Yes | Yes |
| **Multi-factor Auth** | Planned | Yes |
| **SSO Integration** | Planned | Yes |

---

## Future Enhancements

### Planned Role Features
1. **Custom Roles**: Allow Super Admin to create custom roles with specific permissions
2. **Department-level Roles**: Add department-level access control
3. **Time-based Roles**: Temporary role assignments with expiration
4. **Role Templates**: Pre-configured role templates for common scenarios
5. **Permission Delegation**: Allow admins to delegate specific permissions
6. **Role Approval Workflow**: Require approval for sensitive role changes

### Planned Permission Features
1. **Fine-grained Permissions**: Module-level and feature-level permissions
2. **Attribute-Based Access Control (ABAC)**: Access based on user attributes
3. **Dynamic Permissions**: Permissions based on business logic
4. **Permission Inheritance**: Hierarchical permission inheritance
5. **Conditional Permissions**: Permissions based on conditions (time, location, etc.)

---

## Troubleshooting

### Common Issues

**Issue**: User cannot access a feature
- **Check**: User's role and permissions
- **Solution**: Verify role is assigned correctly, check permission matrix

**Issue**: Company Admin cannot create users
- **Check**: Company's user limit
- **Solution**: Upgrade subscription plan or deactivate unused users

**Issue**: Cannot assign Super Admin role
- **Check**: User's current role
- **Solution**: Only Super Admin can assign super_admin role

**Issue**: Cross-company access denied
- **Check**: User's company assignment
- **Solution**: Verify user is assigned to correct company

---

## Support and Questions

For questions about roles and permissions:
1. Review this documentation
2. Check the API endpoints documentation
3. Contact system administrator
4. Submit support ticket through the system

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-15 | Initial documentation with 3 core roles |

---

**Last Updated**: April 15, 2026  
**Document Version**: 1.0  
**Status**: Active
