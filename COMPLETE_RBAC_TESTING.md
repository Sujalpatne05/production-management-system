# Complete RBAC Testing Guide - All Roles

## 🎯 Overview

The Role-Based Access Control (RBAC) system is now fully implemented for ALL roles. Each role will see ONLY the modules relevant to their job function.

---

## 📋 Role Permissions Summary

### 1. Super Admin
**Modules Visible:**
- Home, Dashboard, Factories, Procurement, Sales, CRM, MRP, Manufacturing, Quality Control, Goods Receipt, Budget Planning, Forecasting, Inventory, Accounting, Store, Approvals, Audit, Accounting Periods, Backup & Restore, PDF Center, Reports, Settings

**Access Level:** FULL SYSTEM ACCESS

---

### 2. Admin
**Modules Visible:**
- Home, Dashboard, Factories, Procurement, Sales, CRM, MRP, Manufacturing, Quality Control, Goods Receipt, Budget Planning, Forecasting, Inventory, Accounting, Store, Approvals, Audit, Accounting Periods, PDF Center, Reports, Settings

**Access Level:** FULL SYSTEM ACCESS (except Backup & Restore)

---

### 3. Sales Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Sales
- ✅ CRM
- ✅ Orders (under Sales)
- ✅ Inventory
- ✅ Reports

**Modules Hidden:**
- ❌ Factories, Procurement, Manufacturing, Quality Control, Accounting, etc.

---

### 4. Purchase Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Procurement
- ✅ Inventory
- ✅ Store
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Manufacturing, Quality Control, Accounting, etc.

---

### 5. Inventory Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Inventory
- ✅ Store
- ✅ Goods Receipt
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Procurement, Manufacturing, Accounting, etc.

---

### 6. Production Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Manufacturing
- ✅ MRP
- ✅ Quality Control
- ✅ Goods Receipt
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Procurement, Accounting, Inventory, etc.

---

### 7. Accountant
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Accounting
- ✅ Accounting Periods
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Procurement, Manufacturing, Inventory, etc.

---

### 8. Finance Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Accounting
- ✅ Accounting Periods
- ✅ Budget Planning
- ✅ Forecasting
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Procurement, Manufacturing, Inventory, etc.

---

### 9. HR Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Reports

**Modules Hidden:**
- ❌ All operational modules (Sales, Procurement, Manufacturing, etc.)

---

### 10. Quality Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Quality Control
- ✅ Manufacturing
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Procurement, Accounting, Inventory, etc.

---

### 11. Store Manager
**Modules Visible:**
- ✅ Home
- ✅ Dashboard
- ✅ Store
- ✅ Inventory
- ✅ Goods Receipt
- ✅ Reports

**Modules Hidden:**
- ❌ Sales, Procurement, Manufacturing, Accounting, etc.

---

### 12. Basic User
**Modules Visible:**
- ✅ Home
- ✅ Dashboard

**Modules Hidden:**
- ❌ All operational modules

---

## 🧪 Testing Procedure

### Step 1: Create Test Users (if not already created)

For each role, create a user:

```
Role: Sales Manager
Name: Sarah Sales
Email: sarah.sales@testcompany.com
Password: SalesPass@123

Role: Purchase Manager
Name: Mike Purchase
Email: mike.purchase@testcompany.com
Password: PurchasePass@123

Role: Inventory Manager
Name: Alice Inventory
Email: alice.inventory@testcompany.com
Password: InventoryPass@123

Role: Production Manager
Name: Bob Production
Email: bob.production@testcompany.com
Password: ProductionPass@123

Role: Accountant
Name: Carol Accountant
Email: carol.accountant@testcompany.com
Password: AccountantPass@123

Role: Finance Manager
Name: David Finance
Email: david.finance@testcompany.com
Password: FinancePass@123

Role: HR Manager
Name: Emma HR
Email: emma.hr@testcompany.com
Password: HRPass@123

Role: Quality Manager
Name: Frank Quality
Email: frank.quality@testcompany.com
Password: QualityPass@123

Role: Store Manager
Name: Grace Store
Email: grace.store@testcompany.com
Password: StorePass@123

Role: User (Basic)
Name: Henry User
Email: henry.user@testcompany.com
Password: UserPass@123
```

### Step 2: Test Each Role

For each role:

1. **Logout** from current user
2. **Login** with role credentials
3. **Verify sidebar** shows ONLY allowed modules
4. **Verify** restricted modules are NOT visible
5. **Check console** for any errors (F12)

---

## ✅ Test Checklist

### Sales Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Sales visible
- [ ] CRM visible
- [ ] Inventory visible
- [ ] Reports visible
- [ ] Procurement NOT visible
- [ ] Manufacturing NOT visible
- [ ] Accounting NOT visible
- [ ] No console errors

### Purchase Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Procurement visible
- [ ] Inventory visible
- [ ] Store visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Manufacturing NOT visible
- [ ] Accounting NOT visible
- [ ] No console errors

### Inventory Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Inventory visible
- [ ] Store visible
- [ ] Goods Receipt visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Procurement NOT visible
- [ ] Manufacturing NOT visible
- [ ] No console errors

### Production Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Manufacturing visible
- [ ] MRP visible
- [ ] Quality Control visible
- [ ] Goods Receipt visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Accounting NOT visible
- [ ] Inventory NOT visible
- [ ] No console errors

### Accountant Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Accounting visible
- [ ] Accounting Periods visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Manufacturing NOT visible
- [ ] Inventory NOT visible
- [ ] No console errors

### Finance Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Accounting visible
- [ ] Accounting Periods visible
- [ ] Budget Planning visible
- [ ] Forecasting visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Manufacturing NOT visible
- [ ] Inventory NOT visible
- [ ] No console errors

### HR Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Manufacturing NOT visible
- [ ] Accounting NOT visible
- [ ] All operational modules NOT visible
- [ ] No console errors

### Quality Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Quality Control visible
- [ ] Manufacturing visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Accounting NOT visible
- [ ] Inventory NOT visible
- [ ] No console errors

### Store Manager Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] Store visible
- [ ] Inventory visible
- [ ] Goods Receipt visible
- [ ] Reports visible
- [ ] Sales NOT visible
- [ ] Manufacturing NOT visible
- [ ] Accounting NOT visible
- [ ] No console errors

### Basic User Test
- [ ] Login successful
- [ ] Home visible
- [ ] Dashboard visible
- [ ] All operational modules NOT visible
- [ ] No console errors

### Super Admin Test
- [ ] Login successful
- [ ] ALL modules visible
- [ ] No restrictions
- [ ] No console errors

### Admin Test
- [ ] Login successful
- [ ] ALL modules visible (except Backup & Restore)
- [ ] Backup & Restore NOT visible
- [ ] No console errors

---

## 🔍 Verification Commands

### Check User Role in Browser Console

```javascript
// Get user data
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);

// Get user role
console.log('Role:', user.roles[0].role);

// Get all roles
console.log('All Roles:', user.roles);
```

### Check Filtered Menu Items

```javascript
// Import the function
import { filterMenuItemsByRole, getUserRole } from '/src/utils/rolePermissions.ts';

// Get current role
const role = getUserRole();
console.log('Current Role:', role);

// Get allowed menus
import { ROLE_PERMISSIONS } from '/src/utils/rolePermissions.ts';
console.log('Allowed Menus:', ROLE_PERMISSIONS[role]);
```

---

## 🐛 Troubleshooting

### Issue: All modules still visible
**Solution:**
1. Clear browser cache: Ctrl+Shift+Delete
2. Clear localStorage: `localStorage.clear()`
3. Logout and login again
4. Refresh page: Ctrl+F5

### Issue: Sidebar not updating after role change
**Solution:**
1. Logout completely
2. Clear browser cache
3. Login with new role
4. Refresh page

### Issue: User role not detected
**Solution:**
1. Check localStorage: `localStorage.getItem('user')`
2. Verify user has a role assigned
3. Check role name matches configuration
4. Check browser console for errors

### Issue: Console errors
**Solution:**
1. Open DevTools: F12
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify rolePermissions.ts is imported correctly

---

## 📊 Expected Results

### Before RBAC:
```
All users see ALL modules regardless of role
❌ WRONG
```

### After RBAC:
```
Sales Manager sees: Home, Dashboard, Sales, CRM, Orders, Inventory, Reports
Purchase Manager sees: Home, Dashboard, Procurement, Inventory, Store, Reports
Production Manager sees: Home, Dashboard, Manufacturing, MRP, Quality Control, Goods Receipt, Reports
Accountant sees: Home, Dashboard, Accounting, Accounting Periods, Reports
Finance Manager sees: Home, Dashboard, Accounting, Accounting Periods, Budget Planning, Forecasting, Reports
HR Manager sees: Home, Dashboard, Reports
Quality Manager sees: Home, Dashboard, Quality Control, Manufacturing, Reports
Store Manager sees: Home, Dashboard, Store, Inventory, Goods Receipt, Reports
Basic User sees: Home, Dashboard
Super Admin sees: ALL modules
Admin sees: ALL modules (except Backup & Restore)
✅ CORRECT
```

---

## 🎯 Success Criteria

✅ Each role sees only their allowed modules
✅ Each role cannot see restricted modules
✅ Super Admin sees all modules
✅ Admin sees all modules (except Backup & Restore)
✅ No console errors
✅ Sidebar renders correctly
✅ Menu items properly filtered
✅ Role detection working

---

## 📝 Test Results Template

```
Role: [Role Name]
Email: [Email]
Password: [Password]

Visible Modules:
- [ ] Home
- [ ] Dashboard
- [ ] [Other modules]

Hidden Modules:
- [ ] [Restricted modules]

Console Errors: [None/List errors]
Status: [PASS/FAIL]
Notes: [Any observations]
```

---

## 🚀 Next Steps

1. **Complete Testing**
   - Test all 12 roles
   - Verify sidebar filtering
   - Check for console errors

2. **Backend Validation** (Future)
   - Add permission checks to API endpoints
   - Validate user role on every request
   - Return 403 for unauthorized access

3. **Feature-Level RBAC** (Future)
   - Restrict buttons and actions by role
   - Hide edit/delete for read-only users
   - Implement feature-level permissions

---

**Last Updated:** April 17, 2026
**Status:** ✅ Ready for Complete Testing
