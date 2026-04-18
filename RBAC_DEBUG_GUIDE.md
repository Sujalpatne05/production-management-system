# RBAC Debugging Guide - Blank Sidebar Issue

## 🔍 Problem: Blank Sidebar

If you see a blank sidebar after login, it means the role detection is failing.

## 🧪 Debugging Steps

### Step 1: Check Browser Console

1. Open DevTools: **F12**
2. Go to **Console** tab
3. Look for console logs that show:
   - `Filtering menu items for role: [role name]`
   - `Allowed menus for role: [array of menus]`
   - `Filtered menu items count: [number]`

### Step 2: Check localStorage

In the Console, run:

```javascript
// Check if user data exists
const user = JSON.parse(localStorage.getItem('user'));
console.log('User data:', user);

// Check if roles exist
console.log('User roles:', user.roles);

// Check first role
console.log('First role:', user.roles[0]);

// Check role name
console.log('Role name:', user.roles[0].role);
```

### Step 3: Check Role Normalization

In the Console, run:

```javascript
// Import the function
import { getUserRole } from '/src/utils/rolePermissions.ts';

// Get the normalized role
const role = getUserRole();
console.log('Normalized role:', role);
```

### Step 4: Check Role Permissions

In the Console, run:

```javascript
// Import the permissions
import { ROLE_PERMISSIONS } from '/src/utils/rolePermissions.ts';

// Get the role
import { getUserRole } from '/src/utils/rolePermissions.ts';
const role = getUserRole();

// Check if role exists in permissions
console.log('Role exists in ROLE_PERMISSIONS:', role in ROLE_PERMISSIONS);

// Check allowed menus
console.log('Allowed menus:', ROLE_PERMISSIONS[role]);
```

---

## 🐛 Common Issues and Solutions

### Issue 1: "No user data in localStorage"

**Cause:** User is not logged in or session expired

**Solution:**
1. Logout completely
2. Clear browser cache: Ctrl+Shift+Delete
3. Clear localStorage: `localStorage.clear()`
4. Login again

### Issue 2: "No roles found in user data"

**Cause:** User data doesn't have roles array

**Solution:**
1. Check if user was created with a role
2. Verify backend is returning roles in user data
3. Check user creation form includes role selection

### Issue 3: "Role not found in ROLE_PERMISSIONS"

**Cause:** Role name doesn't match configuration

**Solution:**
1. Check the raw role name: `user.roles[0].role`
2. Check if it matches one in rolePermissions.ts
3. Update role name if needed

### Issue 4: "Filtered menu items count: 0"

**Cause:** Role has no allowed menus

**Solution:**
1. Check ROLE_PERMISSIONS for the role
2. Verify role is spelled correctly
3. Check if role is in the allowed list

---

## 📊 Expected Console Output

### For Finance Manager:

```
Filtering menu items for role: finance_manager
Allowed menus for role: (7) ['Home', 'Dashboard', 'Accounting', 'Accounting Periods', 'Budget Planning', 'Forecasting', 'Reports']
Filtering out menu item: Factories
Filtering out menu item: Procurement
Filtering out menu item: Sales
...
Filtered menu items count: 7
```

### For Sales Manager:

```
Filtering menu items for role: sales_manager
Allowed menus for role: (7) ['Home', 'Dashboard', 'Sales', 'CRM', 'Orders', 'Inventory', 'Reports']
Filtering out menu item: Factories
Filtering out menu item: Procurement
Filtering out menu item: Manufacturing
...
Filtered menu items count: 7
```

### For Super Admin:

```
Filtering menu items for role: super_admin
Super admin detected, showing all menus
Filtered menu items count: 22
```

---

## 🔧 How to Fix Blank Sidebar

### Step 1: Check Console Logs
- Open DevTools (F12)
- Look for error messages
- Note the role name shown

### Step 2: Verify User Data
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log(user);
```

### Step 3: Check Role Name
```javascript
console.log('Role:', user.roles[0].role);
```

### Step 4: Verify Role Exists
```javascript
import { ROLE_PERMISSIONS } from '/src/utils/rolePermissions.ts';
const role = user.roles[0].role.toLowerCase().replace(/\s+/g, '_');
console.log('Role exists:', role in ROLE_PERMISSIONS);
```

### Step 5: If Role Doesn't Exist
- Add the role to `ROLE_PERMISSIONS` in `rolePermissions.ts`
- Add the role to `UserRole` type
- Add the role to `ROLE_DISPLAY_NAMES`

---

## 📝 Troubleshooting Checklist

- [ ] User is logged in
- [ ] localStorage has user data
- [ ] User has roles array
- [ ] Role name is correct
- [ ] Role is in ROLE_PERMISSIONS
- [ ] Console shows role name
- [ ] Console shows allowed menus
- [ ] Filtered menu items count > 0
- [ ] No console errors

---

## 🔍 Advanced Debugging

### Check AppSidebar Component

In the Console:

```javascript
// Check if AppSidebar is rendering
console.log('AppSidebar component loaded');

// Check if filterMenuItemsByRole is called
import { filterMenuItemsByRole } from '/src/utils/rolePermissions.ts';
console.log('filterMenuItemsByRole function:', filterMenuItemsByRole);
```

### Check Menu Items

In the Console:

```javascript
// Import menu items from AppSidebar
// Note: This might not work if menuItems is not exported
// But you can check the filtered result

import { filterMenuItemsByRole } from '/src/utils/rolePermissions.ts';
const filtered = filterMenuItemsByRole([]);
console.log('Filtered items:', filtered);
```

---

## 📞 Getting Help

If sidebar is still blank:

1. **Check console logs** - Look for error messages
2. **Verify user data** - Ensure user has roles
3. **Check role name** - Ensure role matches configuration
4. **Clear cache** - Ctrl+Shift+Delete + logout/login
5. **Refresh page** - Ctrl+F5

---

## ✅ Success Indicators

✅ Console shows role name
✅ Console shows allowed menus
✅ Filtered menu items count > 0
✅ Sidebar displays menu items
✅ No console errors

---

**Last Updated:** April 17, 2026
**Status:** ✅ Debugging Guide Ready
