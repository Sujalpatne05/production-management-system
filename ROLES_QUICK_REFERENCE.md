# Roles Quick Reference Guide

## At a Glance

### 3 Core Roles

```
┌──────────────────────────────────────────────────────────────┐
│ SUPER ADMIN                                                  │
│ • System-level administrator                                 │
│ • Unrestricted access to all companies and features          │
│ • Manages companies, admins, subscription plans              │
│ • Views platform-wide analytics and audit logs               │
│ • Permissions: ["*"] (All)                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ADMIN (Company Admin)                                         │
│ • Company-level administrator                                │
│ • Manages users within their company only                    │
│ • Updates company settings and profile                       │
│ • Views company-specific audit logs                          │
│ • Cannot create super_admin users                            │
│ • Permissions: ["read", "write", "delete"]                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ USER (Regular User)                                          │
│ • Standard user with read-only access                        │
│ • Views company data and reports                             │
│ • Cannot create, modify, or delete records                   │
│ • Can change own password                                    │
│ • Permissions: ["read"]                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## What Can Each Role Do?

### Super Admin ✅ Can Do Everything

| Task | Super Admin |
|------|:-----------:|
| Create companies | ✅ |
| Manage company admins | ✅ |
| Create subscription plans | ✅ |
| Assign plans to companies | ✅ |
| Create users in any company | ✅ |
| Assign any role (including super_admin) | ✅ |
| View all audit logs | ✅ |
| View platform analytics | ✅ |
| Manage API keys | ✅ |
| Delete companies | ✅ |
| Access all data | ✅ |

### Admin (Company Admin) ✅ Can Manage Their Company

| Task | Admin |
|------|:-----:|
| Create users in own company | ✅ |
| Assign user/admin roles (NOT super_admin) | ✅ |
| Update company profile | ✅ |
| View company audit logs | ✅ |
| View subscription details | ✅ |
| Change own password | ✅ |
| **Cannot**: Create companies | ❌ |
| **Cannot**: Manage subscription plans | ❌ |
| **Cannot**: Access other companies' data | ❌ |
| **Cannot**: View platform analytics | ❌ |
| **Cannot**: Create super_admin users | ❌ |

### User ✅ Can View Data

| Task | User |
|------|:----:|
| View company data | ✅ |
| View orders, sales, inventory | ✅ |
| View reports | ✅ |
| Change own password | ✅ |
| **Cannot**: Create records | ❌ |
| **Cannot**: Modify records | ❌ |
| **Cannot**: Delete records | ❌ |
| **Cannot**: Manage users | ❌ |
| **Cannot**: Access other companies' data | ❌ |

---

## Key Differences

### Data Access
- **Super Admin**: All companies, all data
- **Admin**: Own company only
- **User**: Own company only (read-only)

### User Management
- **Super Admin**: Create/manage users in any company
- **Admin**: Create/manage users in own company only
- **User**: Cannot manage users

### Role Assignment
- **Super Admin**: Can assign any role
- **Admin**: Can assign user/admin roles (NOT super_admin)
- **User**: Cannot assign roles

### System Settings
- **Super Admin**: Full access
- **Admin**: Limited (own company only)
- **User**: No access

---

## Common Scenarios

### Scenario 1: New Company Setup
1. Super Admin creates company
2. Super Admin creates subscription plan
3. Super Admin assigns plan to company
4. Super Admin creates first admin user
5. Admin creates team members (users)

### Scenario 2: Adding Team Member
1. Admin logs in
2. Admin creates new user
3. Admin assigns "user" role
4. User receives credentials
5. User logs in and accesses data

### Scenario 3: Promoting User to Admin
1. Super Admin finds user
2. Super Admin updates user role to "admin"
3. Admin now has access to admin features
4. Admin can manage other users

### Scenario 4: Removing User Access
1. Admin finds user
2. Admin deactivates user
3. User can no longer log in
4. User slot becomes available for new user

---

## Permission Codes

| Code | Meaning | Who Has It |
|------|---------|-----------|
| `*` | All permissions | Super Admin |
| `read` | View data | Admin, User |
| `write` | Create/modify data | Admin |
| `delete` | Delete data | Admin |

---

## API Endpoints by Role

### Super Admin Endpoints
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

### Admin Endpoints
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
GET    /api/company-admin/audit-logs
```

### User Endpoints
```
GET    /api/users
GET    /api/orders
GET    /api/sales
GET    /api/inventory
GET    /api/purchases
GET    /api/expenses
GET    /api/reports

POST   /api/password-change
PUT    /api/profile
```

---

## Error Messages

### When You Don't Have Permission
```json
{
  "success": false,
  "error": "Access Denied",
  "code": "FORBIDDEN"
}
```

### When You Try to Create Super Admin (as Admin)
```json
{
  "success": false,
  "error": "Company admins cannot create super_admin users",
  "code": "FORBIDDEN"
}
```

### When You Try to Access Another Company's Data
```json
{
  "success": false,
  "error": "Cannot access data from another company",
  "code": "FORBIDDEN"
}
```

### When User Limit is Exceeded
```json
{
  "success": false,
  "error": "User limit exceeded. Current: 10, Limit: 10",
  "code": "USER_LIMIT_EXCEEDED"
}
```

---

## Role Assignment Examples

### Create User with "user" Role
```bash
POST /api/company-admin/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

### Create User with "admin" Role
```bash
POST /api/super-admin/admins
{
  "companyId": "company_123",
  "userId": "user_456",
  "role": "admin"
}
```

### Update User Role
```bash
PUT /api/company-admin/users/:id
{
  "role": "admin"
}
```

---

## Checklist: Setting Up Roles

- [ ] Create Super Admin account
- [ ] Create companies
- [ ] Create subscription plans
- [ ] Assign plans to companies
- [ ] Create company admins
- [ ] Company admins create team members
- [ ] Assign appropriate roles to users
- [ ] Test role-based access control
- [ ] Review audit logs
- [ ] Document role assignments

---

## Quick Tips

✅ **DO**
- Use Super Admin account only for administrative tasks
- Create separate Admin accounts for daily operations
- Regularly review user access and permissions
- Deactivate users who leave the company
- Monitor audit logs for suspicious activity
- Use strong passwords for all accounts

❌ **DON'T**
- Share Super Admin credentials
- Create multiple Super Admin accounts
- Assign higher roles than necessary
- Leave inactive users in the system
- Ignore audit log warnings
- Use weak passwords

---

## Need Help?

1. **Check Permissions**: Review the permission matrix above
2. **Read Full Documentation**: See `ROLES_AND_PERMISSIONS.md`
3. **Check API Docs**: See `API_ENDPOINTS_COMPLETE.md`
4. **Contact Support**: Submit a support ticket

---

**Last Updated**: April 15, 2026  
**Version**: 1.0
