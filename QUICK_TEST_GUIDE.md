# Quick Test Guide - Super Admin Panel

## 🚀 Quick Start

### 1. Login
```
URL: http://localhost:8081/login
Email: superadmin@example.com
Password: SuperAdmin@123
```

### 2. Navigate to Companies
- Click "Companies" in the left sidebar
- You should see the companies list

### 3. Add New Company & Admin
- Click "Add New Company & Admin" button
- Fill in the form:

```
COMPANY INFORMATION:
├─ Company Name: Test Company
├─ Company Email: testcompany@example.com
├─ Company Phone: +1-234-567-8900
├─ Address: 123 Test Street
├─ Website: https://testcompany.com
└─ Subscription Plan: Starter

ADMIN INFORMATION:
├─ Admin Name: Test Admin
├─ Admin Email: testadmin@example.com
├─ Admin Phone: +1-234-567-8901
├─ Password: TestAdmin@123
└─ Confirm Password: TestAdmin@123
```

### 4. Submit
- Click "Create Company & Admin" button
- Should redirect to companies list
- New company should appear in the list

---

## ✅ Verification Checklist

- [ ] Form displays correctly
- [ ] All fields are visible
- [ ] Form validation works (try submitting empty form)
- [ ] Company is created successfully
- [ ] Admin user is created
- [ ] Redirect to companies list works
- [ ] New company appears in list
- [ ] Admin can login with provided credentials

---

## 🔍 Testing Scenarios

### Scenario 1: Valid Data
**Expected:** Company and admin created successfully
```
Company Email: testcompany1@example.com
Admin Email: testadmin1@example.com
Password: TestAdmin@123
```

### Scenario 2: Duplicate Company Email
**Expected:** Error message "Company email already in use"
```
Company Email: superadmin@example.com (already exists)
```

### Scenario 3: Duplicate Admin Email
**Expected:** Error message "Admin email already in use"
```
Admin Email: superadmin@example.com (already exists)
```

### Scenario 4: Invalid Email Format
**Expected:** Error message "Invalid email format"
```
Company Email: invalid-email
Admin Email: invalid-email
```

### Scenario 5: Short Password
**Expected:** Error message "Password must be at least 6 characters"
```
Password: 12345
```

### Scenario 6: Password Mismatch
**Expected:** Error message "Passwords do not match"
```
Password: TestAdmin@123
Confirm Password: TestAdmin@124
```

---

## 🛠️ Troubleshooting

### Issue: Form not submitting
**Solution:** 
- Check browser console for errors
- Verify backend is running on port 5001
- Check network tab to see API response

### Issue: "Invalid or expired token"
**Solution:**
- Login again
- Clear browser cache
- Check localStorage for valid token

### Issue: "Company email already in use"
**Solution:**
- Use a different email address
- Check if company already exists in the list

### Issue: Redirect not working
**Solution:**
- Check if `/super-admin/companies` route exists
- Verify ProtectedRoute component is working
- Check browser console for routing errors

---

## 📊 API Endpoint

**Endpoint:** `POST /api/super-admin/companies-with-admin`

**Request Body:**
```json
{
  "company": {
    "name": "Test Company",
    "email": "testcompany@example.com",
    "phone": "+1-234-567-8900",
    "address": "123 Test Street",
    "website": "https://testcompany.com",
    "subscriptionPlan": "starter"
  },
  "admin": {
    "name": "Test Admin",
    "email": "testadmin@example.com",
    "phone": "+1-234-567-8901",
    "password": "TestAdmin@123"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "company-id",
      "name": "Test Company",
      "email": "testcompany@example.com",
      ...
    },
    "admin": {
      "id": "admin-id",
      "userId": "user-id",
      "companyId": "company-id",
      ...
    }
  },
  "message": "Company and admin created successfully"
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "adminPassword": "Password must be at least 6 characters"
  }
}
```

---

## 🔐 Security Features

✅ Password hashing with bcrypt (10 salt rounds)
✅ Role-based access control (super_admin only)
✅ Input validation for all fields
✅ Duplicate email prevention
✅ Transactional database operations
✅ Audit logging for compliance
✅ Token-based authentication required

---

## 📝 Notes

- All passwords are hashed with bcrypt before storage
- Company and admin are created in a single database transaction
- If any step fails, the entire operation is rolled back
- Audit logs are created for all operations
- Email addresses must be unique across the system
- Passwords must be at least 6 characters

---

## 🎯 Success Criteria

✅ Form displays without errors
✅ Form validation works correctly
✅ Company is created in database
✅ Admin user is created in database
✅ Company admin record is created
✅ Redirect to companies list works
✅ New company appears in list
✅ Admin can login with provided credentials
✅ Audit log is created for the operation

---

**Last Updated:** April 17, 2026
**Status:** ✅ Ready for Testing
