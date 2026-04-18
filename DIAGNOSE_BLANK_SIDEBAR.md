# Diagnose Blank Sidebar - Step by Step

## 🔍 For User: Mukesh (Finance Manager)

### Step 1: Open Browser Console
1. Press **F12**
2. Go to **Console** tab
3. You should see detailed logs starting with `=== RBAC Filtering ===`

### Step 2: Check the Console Output

Look for these messages:

```
=== RBAC Filtering ===
Detected role: [role name]
Allowed menus for role: [array of menus]
Filtered menu items count: [number]
=== End RBAC Filtering ===
```

### Step 3: Copy the Console Output

1. Right-click in console
2. Select "Save as..."
3. Save the console output
4. Share it with me

### Step 4: Check User Data

Run this in the console:

```javascript
// Check user data
const user = JSON.parse(localStorage.getItem('user'));
console.log('=== USER DATA ===');
console.log('Full user object:', JSON.stringify(user, null, 2));
console.log('User name:', user.name || user.fullName);
console.log('User email:', user.email);
console.log('User roles:', user.roles);
if (user.roles && user.roles[0]) {
  console.log('First role object:', JSON.stringify(user.roles[0], null, 2));
  console.log('Role name:', user.roles[0].role || user.roles[0].roleName);
}
console.log('=== END USER DATA ===');
```

### Step 5: Check Role Detection

Run this in the console:

```javascript
// Check role detection
import { getUserRole } from '/src/utils/rolePermissions.ts';
const role = getUserRole();
console.log('Detected role:', role);

// Check if role is in permissions
import { ROLE_PERMISSIONS } from '/src/utils/rolePermissions.ts';
console.log('Role in ROLE_PERMISSIONS:', role in ROLE_PERMISSIONS);
console.log('Allowed menus:', ROLE_PERMISSIONS[role]);
```

### Step 6: Check Menu Filtering

Run this in the console:

```javascript
// Check menu filtering
import { filterMenuItemsByRole } from '/src/utils/rolePermissions.ts';

// Create a test menu
const testMenus = [
  { title: 'Home' },
  { title: 'Dashboard' },
  { title: 'Sales' },
  { title: 'Accounting' },
  { title: 'Manufacturing' },
];

const filtered = filterMenuItemsByRole(testMenus);
console.log('Test filtered menus:', filtered.map(m => m.title));
```

---

## 📊 Expected Output for Finance Manager

### Console Should Show:

```
=== RBAC Filtering ===
Full user object: {
  "id": "...",
  "name": "Mukesh",
  "email": "mukesh@...",
  "roles": [
    {
      "roleId": "...",
      "role": "Finance Manager",
      "tenant": {...}
    }
  ]
}
Raw role name: Finance Manager
Normalized role: finance_manager
✅ Role found in ROLE_PERMISSIONS
Allowed menus for role: ['Home', 'Dashboard', 'Accounting', 'Accounting Periods', 'Budget Planning', 'Forecasting', 'Reports']
Filtered menu items count: 7
=== End RBAC Filtering ===
```

---

## 🐛 Possible Issues

### Issue 1: Role Name Format
**If you see:**
```
Raw role name: Finance Manager
Normalized role: finance_manager
```

**This is CORRECT** ✅

### Issue 2: Role Not Found
**If you see:**
```
⚠️ Role not found in ROLE_PERMISSIONS: finance_manager
Available roles: ['super_admin', 'admin', 'sales_manager', ...]
```

**This means:** The role name doesn't match our configuration

**Solution:** Check the exact role name and update configuration

### Issue 3: No Role Detected
**If you see:**
```
⚠️ No role detected - showing all menus as fallback
```

**This means:** User data doesn't have role information

**Solution:** Check if user was created with a role

### Issue 4: Empty Allowed Menus
**If you see:**
```
Allowed menus for role: []
Filtered menu items count: 0
```

**This means:** Role exists but has no allowed menus

**Solution:** Check ROLE_PERMISSIONS configuration

---

## 🔧 What to Do Next

### If Sidebar Shows Menus:
✅ RBAC is working!
- Verify menus are correct for the role
- Test with other roles

### If Sidebar is Still Blank:
1. **Check console output** - Look for error messages
2. **Share the console output** - Copy and paste the logs
3. **Check user data** - Verify role is assigned
4. **Check role name** - Verify it matches configuration

---

## 📝 Information to Share

When reporting the issue, please provide:

1. **Console output** - Copy all logs from console
2. **User data** - Output from `localStorage.getItem('user')`
3. **Role name** - The exact role name shown
4. **Expected menus** - What menus should be visible

---

## 🎯 Temporary Workaround

If sidebar is blank, the system will show ALL menus as a fallback. This is temporary until we fix the role detection.

To enable proper RBAC:
1. Check the console logs
2. Identify the issue
3. Fix the role name or configuration
4. Refresh the page

---

**Last Updated:** April 17, 2026
**Status:** ✅ Diagnostic Guide Ready
