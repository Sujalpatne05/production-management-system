# Blank Sidebar - Quick Fix Guide

## 🚨 Problem: Sidebar is Blank

If you see a blank sidebar after login, follow these steps:

---

## ✅ Quick Fix (Try These First)

### Step 1: Clear Cache and Logout
```
1. Press Ctrl+Shift+Delete (Clear browsing data)
2. Select "All time"
3. Check "Cookies and other site data"
4. Click "Clear data"
5. Logout from the application
```

### Step 2: Clear localStorage
```
1. Open DevTools: F12
2. Go to Console tab
3. Run: localStorage.clear()
4. Refresh page: Ctrl+F5
```

### Step 3: Login Again
```
1. Go to login page
2. Enter credentials
3. Login
4. Check if sidebar appears
```

---

## 🔍 Debug the Issue

### Step 1: Open Browser Console
- Press **F12**
- Go to **Console** tab

### Step 2: Check for Errors
Look for messages like:
- `No user data in localStorage`
- `No roles found in user data`
- `Role not found in ROLE_PERMISSIONS`

### Step 3: Check User Data
Run in console:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Roles:', user.roles);
console.log('Role name:', user.roles[0].role);
```

### Step 4: Check Role Normalization
Run in console:
```javascript
import { getUserRole } from '/src/utils/rolePermissions.ts';
const role = getUserRole();
console.log('Detected role:', role);
```

### Step 5: Check Allowed Menus
Run in console:
```javascript
import { ROLE_PERMISSIONS } from '/src/utils/rolePermissions.ts';
import { getUserRole } from '/src/utils/rolePermissions.ts';
const role = getUserRole();
console.log('Allowed menus:', ROLE_PERMISSIONS[role]);
```

---

## 🔧 Common Fixes

### Fix 1: Role Name Mismatch

**Problem:** Role name doesn't match configuration

**Solution:**
1. Check the role name in console: `user.roles[0].role`
2. Compare with roles in `rolePermissions.ts`
3. If different, update the role name in the database

**Example:**
```
Database has: "Finance Manager"
Config expects: "finance_manager"
Solution: Update database or config to match
```

### Fix 2: Missing Role in Configuration

**Problem:** Role exists but not in ROLE_PERMISSIONS

**Solution:**
1. Open `src/utils/rolePermissions.ts`
2. Add the role to `UserRole` type
3. Add the role to `ROLE_DISPLAY_NAMES`
4. Add the role to `ROLE_PERMISSIONS` with allowed menus

**Example:**
```typescript
export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'new_role'  // Add here
  | ...

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  'new_role': 'New Role',  // Add here
  ...
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'new_role': [  // Add here
    'Home',
    'Dashboard',
    'Sales',
    'Reports',
  ],
  ...
};
```

### Fix 3: User Not Logged In

**Problem:** localStorage doesn't have user data

**Solution:**
1. Logout completely
2. Clear browser cache
3. Login again
4. Verify user data is stored

### Fix 4: Roles Array Empty

**Problem:** User data exists but roles array is empty

**Solution:**
1. Check if user was created with a role
2. Verify backend is returning roles
3. Re-create user with a role assigned

---

## 📊 Expected Results

### Before Fix:
```
Sidebar: [BLANK]
Console: "No roles found in user data"
❌ WRONG
```

### After Fix:
```
Sidebar: [Shows menu items for user's role]
Console: "Filtering menu items for role: finance_manager"
Console: "Filtered menu items count: 7"
✅ CORRECT
```

---

## 🧪 Test After Fix

1. **Login** with user credentials
2. **Check sidebar** - Should show menu items
3. **Open console** - Should show role name
4. **Verify menus** - Should only show allowed modules

---

## 📝 Verification Checklist

- [ ] Cache cleared
- [ ] localStorage cleared
- [ ] Logged out and back in
- [ ] Console shows role name
- [ ] Console shows allowed menus
- [ ] Sidebar displays menu items
- [ ] No console errors
- [ ] Menu items are correct for role

---

## 🆘 If Still Blank

### Check These:

1. **Is user logged in?**
   ```javascript
   localStorage.getItem('token')  // Should return a token
   ```

2. **Does user have roles?**
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'));
   console.log(user.roles);  // Should be an array with at least 1 item
   ```

3. **Is role name correct?**
   ```javascript
   console.log(user.roles[0].role);  // Check the exact role name
   ```

4. **Is role in configuration?**
   ```javascript
   import { ROLE_PERMISSIONS } from '/src/utils/rolePermissions.ts';
   console.log(Object.keys(ROLE_PERMISSIONS));  // List all configured roles
   ```

---

## 🎯 Success Criteria

✅ Sidebar displays menu items
✅ Menu items match user's role
✅ No console errors
✅ User can navigate to allowed modules
✅ User cannot access restricted modules

---

## 📞 Need More Help?

1. Check `RBAC_DEBUG_GUIDE.md` for detailed debugging
2. Check `COMPLETE_RBAC_TESTING.md` for testing procedures
3. Check `RBAC_QUICK_REFERENCE.md` for role permissions

---

**Last Updated:** April 17, 2026
**Status:** ✅ Quick Fix Guide Ready
