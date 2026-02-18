# Role Hierarchy & Permissions - iProduction System

## Current Role Structure

### 🔴 Super Admin (System Developer Level)
**Who**: System developers/owners (You and your team)
**Access**: Complete system access across ALL tenants/companies
**Permissions**: 
- ✅ All permissions (12 permissions)
- ✅ Manage tenants (add/remove companies)
- ✅ System configuration
- ✅ Access all company data
- ✅ Create/delete admin accounts

**Use Cases**:
- Deploy new companies to the system
- Troubleshoot technical issues
- System maintenance and updates
- Monitor all tenants

---

### 🟠 Admin (Company HR/Management Level)
**Who**: HR department or management of CLIENT companies
**Access**: Full access within THEIR company only
**Permissions**:
- ✅ All permissions (12 permissions)
- ✅ Manage users (employees) in their company
- ✅ View/edit all modules (production, inventory, orders, etc.)
- ✅ Assign roles to employees
- ❌ Cannot access other companies' data
- ❌ Cannot manage system-level settings

**Use Cases**:
- Onboard new employees
- Assign roles and permissions
- Monitor company operations
- Generate reports

---

### 🟢 User (Employee Level)
**Who**: Regular employees of the client company
**Access**: Limited to daily operational tasks
**Permissions** (Current - Read Only):
- ✅ Read orders
- ✅ Read production data
- ✅ Read inventory
- ❌ Cannot create/edit/delete
- ❌ Cannot manage other users
- ❌ Cannot view sensitive reports

**Use Cases**:
- View work orders
- Check inventory status
- View production schedules

---

### 🔵 Additional Roles (Optional)

#### Manager
- More permissions than User
- Can create/edit production and inventory
- Cannot manage users

#### Supervisor  
- Production-focused role
- Can manage production and inventory
- Limited to operational tasks

---

## Business Model Alignment

### Your Requirement:
```
Super Admin → Developers (System Owners)
     ↓
   Admin → HR of Client Companies
     ↓
   User → Employees of Client Companies
```

### Current Implementation: ✅ Already Aligned!

Your system is already set up as a **Multi-Tenant SaaS** platform where:

1. **Tenant** = Client Company (e.g., "ABC Manufacturing Ltd")
2. **Super Admin** = You (developers) - manage the whole platform
3. **Admin** = Client's HR - manage their company's employees
4. **User** = Client's employees - use the system

---

## Key Features Already Implemented

### 1. Tenant Isolation
- Each company (tenant) has its own data
- Users can only access their company's data
- Admins can only manage users in their company

### 2. Role-Based Access Control (RBAC)
- Super Admin: System-wide access
- Admin: Company-wide access  
- User: Limited operational access

### 3. Multi-Company Support
- One system serves multiple companies
- Each company is completely isolated
- Shared infrastructure, separate data

---

## Recommended Adjustments

### For Better Employee Management:

#### Update User Role Permissions:
Instead of read-only, give employees more operational access:

```typescript
User: [
  'orders.read',
  'orders.write',        // ← Add: Create orders
  'production.read',
  'production.write',    // ← Add: Update production
  'inventory.read',
  'inventory.write',     // ← Add: Update inventory
  'reports.view'         // ← Add: View reports
]
```

### Add More Granular Permissions:
```typescript
// Employee-level permissions
'orders.create'          // Create new orders
'production.update'      // Update production status
'inventory.adjust'       // Adjust inventory counts
'reports.basic'          // View basic reports

// Admin-level permissions  
'users.manage'           // Manage employees
'roles.assign'           // Assign roles
'reports.advanced'       // View all reports
'settings.company'       // Company settings

// Super Admin-level
'tenants.manage'         // Add/remove companies
'system.config'          // System configuration
'all.companies.access'   // Access all tenant data
```

---

## How It Works in Production

### Scenario 1: Onboarding New Client Company

1. **Super Admin** (You):
   - Create new tenant: "XYZ Industries"
   - Create admin account: hr@xyzindustries.com
   - Set company configuration

2. **Admin** (HR at XYZ Industries):
   - Logs in with hr@xyzindustries.com
   - Creates employee accounts
   - Assigns roles (User, Manager, Supervisor)

3. **Users** (Employees at XYZ Industries):
   - Log in with their accounts
   - Access production, inventory, orders
   - Cannot see data from other companies

### Scenario 2: Employee Management

**Admin Can**:
- ✅ Add new employees
- ✅ Edit employee details
- ✅ Assign roles
- ✅ Deactivate accounts
- ✅ View all company operations

**User Cannot**:
- ❌ Add other users
- ❌ Change roles
- ❌ Access admin settings
- ❌ View other companies

---

## Current Database Structure

```
Tenant (Company)
  ↓
User (Employee/Admin)
  ↓
UserRole (Links User to Role within Tenant)
  ↓
Role (Superadmin/Admin/User/Manager)
  ↓
RolePermission (Links Role to Permissions)
  ↓
Permission (Specific access rights)
```

---

## Summary

✅ **Your system is already correctly structured** for your business model:
- Multi-tenant architecture
- Proper role separation
- Tenant data isolation

🔧 **Recommended Next Steps**:
1. Increase User role permissions for employees (add write access)
2. Add more granular permissions
3. Create tenant onboarding workflow
4. Add company branding per tenant (optional)

Current setup matches your requirement perfectly for a B2B SaaS production management system! 🚀
