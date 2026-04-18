# RBAC Testing Guide

## 🎯 Quick Test - Finance Manager Should See Limited Modules

### Step 1: Logout
- Click profile icon or logout button
- Navigate to `/login`

### Step 2: Login as Finance Manager
```
Email:    john.sales@testcompany.com (or your finance manager email)
Password: User@123456 (or the password you set)
```

### Step 3: Verify Sidebar Modules

**Finance Manager SHOULD see:**
- ✅ Home
- ✅ Dashboard
- ✅ Accounting
- ✅ Accounting Periods
- ✅ Budget Planning
- ✅ Forecasting
- ✅ Reports

**Finance Manager SHOULD NOT see:**
- ❌ Factories
- ❌ Procurement
- ❌ Sales
- ❌ CRM
- ❌ MRP
- ❌ Manufacturing
- ❌ Quality Control
- ❌ Goods Receipt
- ❌ Inventory
- ❌ Store
- ❌ Approvals
- ❌ Audit
- ❌ Backup & Restore
- ❌ PDF Center
- ❌ Settings

---

## 🧪 Test Different Roles

### Test 1: Sales Manager
**Create a Sales Manager user:**
```
Name:     Sarah Sales
Email:    sarah.sales@testcompany.com
Password: SalesPass@123
Role:     Sales Manager
```

**Expected Sidebar:**
- Home, Dashboard
- Sales, CRM, Orders
- Inventory, Reports

---

### Test 2: Production Manager
**Create a Production Manager user:**
```
Name:     Mike Production
Email:    mike.production@testcompany.com
Password: ProductionPass@123
Role:     Production Manager
```

**Expected Sidebar:**
- Home, Dashboard
- Manufacturing, MRP
- Quality Control, Goods Receipt
- Reports

---

### Test 3: Accountant
**Create an Accountant user:**
```
Name:     Alice Accountant
Email:    alice.accountant@testcompany.com
Password: AccountantPass@123
Role:     Accountant
```

**Expected Sidebar:**
- Home, Dashboard
- Accounting, Accounting Periods
- Reports

---

### Test 4: Super Admin
**Login as Super Admin:**
```
Email:    superadmin@example.com
Password: SuperAdmin@123
```

**Expected Sidebar:**
- ALL modules visible
- No restrictions

---

## ✅ Verification Checklist

### For Each Role Test:

- [ ] User can login successfully
- [ ] Sidebar displays only allowed modules
- [ ] Sidebar does NOT display restricted modules
- [ ] Dashboard loads without errors
- [ ] Can click on allowed menu items
- [ ] Cannot access restricted modules via URL (if protected)

### Finance Manager Specific:

- [ ] Accounting module visible
- [ ] Accounting Periods module visible
- [ ] Budget Planning module visible
- [ ] Forecasting module visible
- [ ] Reports module visible
- [ ] Sales module NOT visible
- [ ] Manufacturing module NOT visible
- [ ] Procurement module NOT visible
- [ ] Inventory module NOT visible

---

## 🐛 Troubleshooting

### Issue: All modules still visible
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage: Open DevTools → Console → `localStorage.clear()`
3. Logout and login again
4. Refresh page (Ctrl+F5)

### Issue: Sidebar not updating
**Solution:**
1. Check browser console for errors (F12)
2. Verify user role is stored in localStorage
3. Check if rolePermissions.ts is imported correctly

### Issue: User role not found
**Solution:**
1. Verify user was created with a role
2. Check localStorage for user data: `localStorage.getItem('user')`
3. Verify role name matches one in rolePermissions.ts

---

## 📊 Expected Results

### Before RBAC Fix:
```
Finance Manager sees:
- Home, Dashboard, Factories, Procurement, Sales, CRM, MRP, 
  Manufacturing, Quality Control, Goods Receipt, Budget Planning, 
  Forecasting, Inventory, Accounting, Store, Approvals, Audit, 
  Accounting Periods, Backup & Restore, PDF Center, Reports, Settings
❌ WRONG - Too many modules!
```

### After RBAC Fix:
```
Finance Manager sees:
- Home, Dashboard, Accounting, Accounting Periods, 
  Budget Planning, Forecasting, Reports
✅ CORRECT - Only Finance-related modules!
```

---

## 🔍 How to Check User Role

### In Browser Console:
```javascript
// Check stored user data
const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

// Check user role
console.log(user.roles[0].role);

// Check all permissions
const { getUserRole } = await import('/src/utils/rolePermissions.ts');
console.log(getUserRole());
```

---

## 📝 Test Cases

### Test Case 1: Finance Manager Limited Access
```
Given: Finance Manager user is logged in
When: User views the sidebar
Then: Only Finance-related modules should be visible
And: Sales, Manufacturing, etc. should be hidden
```

### Test Case 2: Sales Manager Limited Access
```
Given: Sales Manager user is logged in
When: User views the sidebar
Then: Only Sales-related modules should be visible
And: Accounting, Manufacturing, etc. should be hidden
```

### Test Case 3: Super Admin Full Access
```
Given: Super Admin user is logged in
When: User views the sidebar
Then: All modules should be visible
And: No restrictions should apply
```

### Test Case 4: Role Change
```
Given: User is logged in as Finance Manager
When: User role is changed to Sales Manager
Then: User must logout and login again
And: Sidebar should show Sales-related modules
```

---

## 🎯 Success Criteria

✅ Finance Manager sees only Finance modules
✅ Sales Manager sees only Sales modules
✅ Production Manager sees only Production modules
✅ Each role sees appropriate modules
✅ Super Admin sees all modules
✅ No console errors
✅ Sidebar renders correctly
✅ Menu items are properly filtered

---

**Last Updated:** April 17, 2026
**Status:** ✅ Ready for Testing
