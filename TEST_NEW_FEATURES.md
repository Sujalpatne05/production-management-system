# 🧪 TEST NEW FEATURES

**Date:** April 16, 2026  
**Features to Test:** Company + Admin Creation, Delete Users, Delete Admins

---

## 🔐 LOGIN CREDENTIALS

**Super Admin:**
- Email: `superadmin@example.com`
- Password: `superadmin123`

---

## ✅ TEST 1: Create Company + Admin in ONE Step

### Steps:
1. Open: http://localhost:8081
2. Login with Super Admin credentials
3. Go to: Super Admin → Companies → Add Company
4. Fill Company Details:
   - Company Name: `Test Company A`
   - Company Email: `testcompanya@example.com`
   - Company Phone: `+1-555-0001`
   - Address: `123 Main St, City, State`
   - Website: `https://testcompanya.com`
   - Subscription Plan: `Professional`

5. Fill Admin Details:
   - Admin Name: `John Admin`
   - Admin Email: `john.admin@testcompanya.com`
   - Admin Phone: `+1-555-0101`
   - Password: `SecurePass123`
   - Confirm Password: `SecurePass123`

6. Click: "Create Company & Admin"

### Expected Result:
- ✅ Success message appears
- ✅ Redirected to Companies list
- ✅ New company appears in list
- ✅ Admin appears in Admins list
- ✅ Both created with same timestamp

### Verify:
1. Go to: Super Admin → Companies
2. Find: `Test Company A`
3. Go to: Super Admin → Admins
4. Find: `John Admin` with email `john.admin@testcompanya.com`

---

## ✅ TEST 2: Admin Can Login with New Credentials

### Steps:
1. Logout from Super Admin
2. Go to: http://localhost:8081/login
3. Enter:
   - Email: `john.admin@testcompanya.com`
   - Password: `SecurePass123`
4. Click: "Sign In"

### Expected Result:
- ✅ Login successful
- ✅ Redirected to Admin Dashboard
- ✅ Can see company name: `Test Company A`
- ✅ Can see all 23 modules
- ✅ Can access User Management

---

## ✅ TEST 3: Super Admin Can Delete Users

### Steps:
1. Login as Super Admin
2. Go to: Super Admin → Users
3. Find any user (e.g., `john@example.com`)
4. Click: Delete button (trash icon)
5. Confirm deletion

### Expected Result:
- ✅ Confirmation dialog appears
- ✅ User removed from list
- ✅ User no longer appears in Super Admin Users
- ✅ Audit log created

### Verify:
1. Refresh the page
2. User should not appear in list

---

## ✅ TEST 4: Super Admin Can Delete Admins

### Steps:
1. Login as Super Admin
2. Go to: Super Admin → Admins
3. Find any admin (e.g., `admin@example.com`)
4. Click: Delete button (trash icon)
5. Confirm deletion

### Expected Result:
- ✅ Confirmation dialog appears
- ✅ Admin removed from list
- ✅ Admin no longer appears in Super Admin Admins
- ✅ Audit log created

### Verify:
1. Refresh the page
2. Admin should not appear in list

---

## ✅ TEST 5: "Add Admin" Button is Removed

### Steps:
1. Login as Super Admin
2. Go to: Super Admin → Admins

### Expected Result:
- ✅ "Add Admin" button is NOT visible
- ✅ Only "Company Admins" title visible
- ✅ List of existing admins visible
- ✅ Delete buttons visible for each admin

---

## ✅ TEST 6: Form Validation

### Steps:
1. Go to: Super Admin → Companies → Add Company
2. Try to submit with empty fields
3. Try to submit with invalid email
4. Try to submit with short password (< 8 chars)
5. Try to submit with mismatched passwords

### Expected Result:
- ✅ Error messages appear for each field
- ✅ Form does not submit
- ✅ Specific error message for each validation failure

### Test Cases:
- Empty Company Name → "Company name is required"
- Empty Company Email → "Company email is required"
- Invalid Email → "Invalid email format"
- Empty Admin Name → "Admin name is required"
- Empty Admin Email → "Admin email is required"
- Short Password → "Password must be at least 8 characters"
- Mismatched Passwords → "Passwords do not match"

---

## ✅ TEST 7: Duplicate Email Prevention

### Steps:
1. Create Company A with admin email: `admin1@test.com`
2. Try to create Company B with same admin email: `admin1@test.com`

### Expected Result:
- ✅ Error message: "Admin email already in use"
- ✅ Form does not submit
- ✅ Company B not created

---

## ✅ TEST 8: Data Isolation

### Steps:
1. Create Company A with Admin A
2. Create Company B with Admin B
3. Login as Admin A
4. Check if you can see Company B data

### Expected Result:
- ✅ Admin A can only see Company A data
- ✅ Admin A cannot see Company B data
- ✅ Admin A cannot see Company B users
- ✅ Admin A cannot see Company B modules

---

## 📊 TEST SUMMARY

| Test | Status | Notes |
|------|--------|-------|
| Create Company + Admin | ⏳ Pending | Should create both in one step |
| Admin Login | ⏳ Pending | Should login with new credentials |
| Delete Users | ⏳ Pending | Should remove user from system |
| Delete Admins | ⏳ Pending | Should remove admin from system |
| "Add Admin" Removed | ⏳ Pending | Button should not be visible |
| Form Validation | ⏳ Pending | All validations should work |
| Duplicate Prevention | ⏳ Pending | Should prevent duplicate emails |
| Data Isolation | ⏳ Pending | Companies should be isolated |

---

## 🐛 TROUBLESHOOTING

### Issue: "Company email already in use"
- **Solution:** Use a unique email for each company

### Issue: "Admin email already in use"
- **Solution:** Use a unique email for each admin

### Issue: Password validation error
- **Solution:** Password must be at least 8 characters

### Issue: Form not submitting
- **Solution:** Check for red error messages and fix all fields

### Issue: Admin cannot login
- **Solution:** Verify email and password are correct

### Issue: Cannot see new company
- **Solution:** Refresh the page or logout/login

---

## ✅ FINAL CHECKLIST

After testing all features:

- [ ] Company + Admin creation works
- [ ] Admin can login with new credentials
- [ ] Super Admin can delete users
- [ ] Super Admin can delete admins
- [ ] "Add Admin" button is removed
- [ ] Form validation works
- [ ] Duplicate email prevention works
- [ ] Data isolation works
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## 🎉 READY FOR PRODUCTION

Once all tests pass, the system is ready for:
- ✅ Production deployment
- ✅ User training
- ✅ Live usage

---

**Test Date:** _______________  
**Tested By:** _______________  
**Status:** _______________

