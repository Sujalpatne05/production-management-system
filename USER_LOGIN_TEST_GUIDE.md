# User Login Test Guide

## 📝 Updated: Add User with Password

The AddUser component has been updated to include password fields. Now when creating a user, you need to provide:

1. **Full Name** - User's full name
2. **Email** - Unique email address
3. **Password** - At least 6 characters
4. **Confirm Password** - Must match the password
5. **Role** - Select from available roles
6. **Status** - Active or Inactive

---

## 🔄 Steps to Create User with Password

### Step 1: Navigate to Add User
1. Login as admin (testadmin@example.com / TestAdmin@123)
2. Go to **Users** section in sidebar
3. Click **"Add User"** button

### Step 2: Fill User Details

```
Full Name:           John Sales Manager
Email:               john.sales@testcompany.com
Password:            User@123456
Confirm Password:    User@123456
Role:                Sales Manager (or any role)
Status:              Active
```

### Step 3: Submit
- Click **"Create User"** button
- Should see success message
- Should redirect to user list

---

## 🔐 Test New User Login

### Step 1: Logout from Admin
- Click profile icon or logout button
- Navigate to `/login`

### Step 2: Login with New User Credentials
```
Email:    john.sales@testcompany.com
Password: User@123456
```

### Step 3: Verify Login
- ✅ Should successfully login
- ✅ Should redirect to dashboard
- ✅ Should see company-specific data
- ✅ Should have role-based permissions

---

## ✅ What to Verify

After new user login, check:

- [ ] Dashboard loads without errors
- [ ] Can see company name in header
- [ ] Can access menu items based on role
- [ ] Cannot access admin-only features
- [ ] Can see only company-specific data
- [ ] User profile shows correct role
- [ ] Can access role-specific features

---

## 🎯 Test Scenarios

### Scenario 1: Create Sales Manager User
```
Name:     Sarah Sales
Email:    sarah.sales@testcompany.com
Password: SalesPass@123
Role:     Sales Manager
Status:   Active
```

**Expected:** User can login and access sales features

### Scenario 2: Create Inventory Manager User
```
Name:     Mike Inventory
Email:    mike.inventory@testcompany.com
Password: InventoryPass@123
Role:     Inventory Manager
Status:   Active
```

**Expected:** User can login and access inventory features

### Scenario 3: Create Inactive User
```
Name:     Inactive User
Email:    inactive@testcompany.com
Password: InactivePass@123
Role:     Any Role
Status:   Inactive
```

**Expected:** User cannot login (account inactive)

---

## 🐛 Troubleshooting

### Issue: "Password must be at least 6 characters"
**Solution:** Enter a password with at least 6 characters

### Issue: "Passwords do not match"
**Solution:** Ensure both password fields have the same value

### Issue: "Invalid credentials" on login
**Solution:** 
- Verify email and password are correct
- Check if user status is "Active"
- Try creating the user again

### Issue: User cannot access certain features
**Solution:**
- Check if user has the correct role
- Verify role has required permissions
- Check if user status is "Active"

---

## 📊 User Roles Available

The system typically has these roles:
- Sales Manager
- Purchase Manager
- Inventory Manager
- Production Manager
- Accountant
- HR Manager
- Quality Manager
- Store Manager
- And others...

---

## 🔑 Password Requirements

- Minimum 6 characters
- Can contain letters, numbers, and special characters
- Must match in both password fields
- Will be hashed before storage

---

## 📝 Notes

- Each user must have a unique email address
- Users can only access their company's data
- User role determines available features
- Inactive users cannot login
- Admin can edit or delete users later

---

## ✅ Success Criteria

✅ User created with password
✅ User can login with email and password
✅ User sees company-specific data
✅ User has role-based permissions
✅ User cannot access other companies' data
✅ User cannot access admin-only features

---

**Last Updated:** April 17, 2026
**Status:** ✅ Ready for Testing
