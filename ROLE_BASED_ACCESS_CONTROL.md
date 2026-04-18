# Role-Based Access Control (RBAC) System

## Overview

The Super Admin Panel implements a comprehensive Role-Based Access Control (RBAC) system with 9 distinct roles and 23 modules. This system ensures that users can only access the modules and features relevant to their role within the organization.

## System Architecture

### 9 Roles

1. **CEO** - Chief Executive Officer
   - Full access to all 23 modules
   - Can view all company operations and analytics
   - Can manage all users and settings

2. **Finance Manager** - Financial Operations
   - Access to: Accounting, Invoicing, Payments, Expenses, Payroll, Analytics, Reports, Dashboard
   - Manages financial operations and reporting
   - Cannot access production or warehouse modules

3. **Sales Manager** - Sales Operations
   - Access to: Sales, Orders, Quotations, Customers, Invoicing, Payments, Analytics, Reports, Dashboard
   - Manages sales pipeline and customer relationships
   - Cannot access production or warehouse modules

4. **Procurement Manager** - Procurement Operations
   - Access to: Purchases, Suppliers, Inventory, Stock Management, Payments, Expenses, Analytics, Reports, Dashboard
   - Manages supplier relationships and purchase orders
   - Cannot access sales or production modules

5. **Production Manager** - Production Operations
   - Access to: Production, Quality Control, Waste Management, Inventory, Stock Management, Orders, Analytics, Reports, Dashboard
   - Manages production schedules and quality
   - Cannot access financial or sales modules

6. **Quality Manager** - Quality Assurance
   - Access to: Quality Control, Production, Waste Management, Inventory, Analytics, Reports, Dashboard
   - Manages quality control and waste management
   - Limited access to production-related modules only

7. **Warehouse Manager** - Warehouse Operations
   - Access to: Warehouse, Inventory, Stock Management, Purchases, Sales, Orders, Waste Management, Analytics, Reports, Dashboard
   - Manages warehouse and inventory operations
   - Cannot access financial or HR modules

8. **HR Manager** - Human Resources
   - Access to: HR Management, Payroll, Attendance, User Management, Analytics, Reports, Dashboard
   - Manages employee records and payroll
   - Cannot access operational modules

9. **System Administrator** - System Administration
   - Full access to all 23 modules
   - Can manage system settings and user roles
   - Equivalent to CEO but with system administration focus

### 23 Modules

#### Core Modules (2)
- Dashboard - Main dashboard and overview
- User Management - User account management

#### Sales & Orders (4)
- Sales - Sales transactions and records
- Orders - Customer orders
- Quotations - Sales quotations
- Customers - Customer management

#### Inventory & Warehouse (3)
- Inventory - Inventory management
- Warehouse - Warehouse operations
- Stock Management - Stock level management

#### Procurement (2)
- Purchases - Purchase transactions
- Suppliers - Supplier management

#### Production (3)
- Production - Production scheduling and tracking
- Quality Control - Quality assurance
- Waste Management - Waste tracking and management

#### Finance & Accounting (4)
- Accounting - General accounting
- Invoicing - Invoice management
- Payments - Payment processing
- Expenses - Expense tracking

#### HR & Payroll (3)
- HR Management - Human resources
- Payroll - Payroll processing
- Attendance - Attendance tracking

#### Analytics & Reports (2)
- Analytics - System analytics and dashboards
- Reports - Report generation and viewing

## Module Access Matrix

| Role | Modules | Count |
|------|---------|-------|
| CEO | All 23 modules | 23 |
| Finance Manager | Accounting, Invoicing, Payments, Expenses, Payroll, Analytics, Reports, Dashboard | 8 |
| Sales Manager | Sales, Orders, Quotations, Customers, Invoicing, Payments, Analytics, Reports, Dashboard | 9 |
| Procurement Manager | Purchases, Suppliers, Inventory, Stock Management, Payments, Expenses, Analytics, Reports, Dashboard | 10 |
| Production Manager | Production, Quality Control, Waste Management, Inventory, Stock Management, Orders, Analytics, Reports, Dashboard | 9 |
| Quality Manager | Quality Control, Production, Waste Management, Inventory, Analytics, Reports, Dashboard | 7 |
| Warehouse Manager | Warehouse, Inventory, Stock Management, Purchases, Sales, Orders, Waste Management, Analytics, Reports, Dashboard | 10 |
| HR Manager | HR Management, Payroll, Attendance, User Management, Analytics, Reports, Dashboard | 7 |
| System Administrator | All 23 modules | 23 |

## Implementation

### Files

1. **role-module-mapping.js** - Core role and module definitions
   - Defines 9 roles and 23 modules
   - Implements role-module access matrix
   - Provides utility functions for access checking

2. **rbac-middleware.js** - Express middleware for RBAC
   - `requireModuleAccess(module)` - Check access to single module
   - `requireAnyModuleAccess(modules)` - Check access to any module
   - `requireAllModuleAccess(modules)` - Check access to all modules
   - `requireRole(roles)` - Check user role
   - `requireAdminRole()` - Check admin privileges
   - `requireSuperAdmin()` - Check super admin privileges
   - `requireCompanyAdmin()` - Check company admin privileges
   - `requireSameCompany(param)` - Check company ownership

3. **role-management-module.js** - Role management API endpoints
   - GET `/api/super-admin/roles` - List all roles
   - GET `/api/super-admin/roles/:roleName` - Get role details
   - GET `/api/super-admin/modules` - List all modules
   - GET `/api/user/accessible-modules` - Get user's accessible modules
   - POST `/api/user/check-module-access` - Check module access
   - GET `/api/super-admin/role-module-matrix` - Get access matrix
   - GET `/api/super-admin/users-by-role/:role` - Get users by role
   - POST `/api/super-admin/assign-role` - Assign role to user
   - GET `/api/super-admin/role-statistics` - Get role statistics

## Usage

### Checking Module Access

```javascript
import { hasModuleAccess, getAccessibleModules } from "./role-module-mapping.js";

// Check if user has access to a module
if (hasModuleAccess(userRole, "Sales")) {
  // User can access Sales module
}

// Get all accessible modules for a role
const modules = getAccessibleModules("Finance Manager");
console.log(modules); // Array of module names
```

### Using Middleware

```javascript
import { requireModuleAccess, requireRole } from "./rbac-middleware.js";

// Require access to Sales module
app.get("/api/sales", requireModuleAccess("Sales"), (req, res) => {
  // Only users with access to Sales module can access this
});

// Require specific role
app.post("/api/admin/settings", requireRole("super_admin"), (req, res) => {
  // Only super admins can access this
});

// Require access to any of multiple modules
app.get("/api/reports", requireAnyModuleAccess(["Analytics", "Reports"]), (req, res) => {
  // Users with access to either Analytics or Reports can access this
});
```

### API Endpoints

#### Get User's Accessible Modules
```bash
GET /api/user/accessible-modules
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "role": "Finance Manager",
    "modules": ["Dashboard", "Accounting", "Invoicing", ...],
    "moduleCount": 8
  }
}
```

#### Check Module Access
```bash
POST /api/user/check-module-access
Authorization: Bearer <token>
Content-Type: application/json

{
  "module": "Sales"
}

Response:
{
  "success": true,
  "data": {
    "module": "Sales",
    "role": "Finance Manager",
    "hasAccess": false,
    "message": "Access denied"
  }
}
```

#### Assign Role to User
```bash
POST /api/super-admin/assign-role
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id",
  "role": "Finance Manager"
}

Response:
{
  "success": true,
  "data": { /* updated user */ },
  "message": "Role assigned successfully. User now has access to 8 modules"
}
```

#### Get Role Statistics
```bash
GET /api/super-admin/role-statistics
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "CEO": { "userCount": 1, "moduleCount": 23 },
    "Finance Manager": { "userCount": 2, "moduleCount": 8 },
    ...
  }
}
```

## Security Considerations

1. **Role Validation** - All roles are validated against the defined role list
2. **Module Validation** - All modules are validated against the defined module list
3. **Audit Logging** - All role assignments are logged in the audit trail
4. **Company Isolation** - Users can only access data from their own company
5. **Super Admin Override** - Super admins and System Administrators have full access
6. **Token-Based** - Access control is enforced at the API level using JWT tokens

## Testing

Run the RBAC tests:
```bash
node test-rbac.js
```

Expected output:
```
✅ Passed: 59/59
❌ Failed: 0/59
Success Rate: 100.00%
🎉 All tests passed!
```

## Future Enhancements

1. **Custom Roles** - Allow creation of custom roles with specific module combinations
2. **Module-Level Permissions** - Fine-grained permissions within modules (read, write, delete)
3. **Time-Based Access** - Restrict access based on time of day or date ranges
4. **Conditional Access** - Access based on conditions (e.g., only during business hours)
5. **Role Hierarchy** - Implement role inheritance and hierarchy
6. **Permission Delegation** - Allow users to delegate permissions to others
7. **Audit Trail** - Enhanced audit logging with permission change history

## Troubleshooting

### User Cannot Access Module
1. Check user's role: `GET /api/user/accessible-modules`
2. Verify module name matches exactly
3. Check if role has access to module in the access matrix
4. Verify user's company context is correct

### Role Assignment Failed
1. Verify role name is valid: `GET /api/super-admin/roles`
2. Check user exists: `GET /api/super-admin/users-by-role/:role`
3. Verify super admin privileges
4. Check audit logs for error details

### Module Not Found
1. Verify module name: `GET /api/super-admin/modules`
2. Check spelling and case sensitivity
3. Verify module is defined in MODULES object
4. Check role-module mapping for the role

## Support

For issues or questions about the RBAC system, please contact the system administrator or refer to the API documentation.
