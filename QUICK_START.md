# Quick Start Guide - Multi-Tenant ERP System

## 🚀 Getting Started

### **1. Start Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5001
```

### **2. Start Frontend Dev Server**
```bash
npm run dev
# Frontend runs on http://localhost:8081
```

### **3. Open Browser**
```
http://localhost:8081
```

---

## 🔐 Login Credentials

### **Super Admin** (Full Access)
```
Email: superadmin@example.com
Password: SuperAdmin@123
```
- Access: All companies, all modules
- Dashboard: Super Admin Panel

### **Zeptac Technologies Admin**
```
Email: sujalpatne583@gmail.com
Password: Sujal@123
```
- Access: Zeptac company only
- Dashboard: Zeptac Technologies - Company Dashboard

### **Test Company Admin**
```
Email: admin@example.com
Password: Admin@123
```
- Access: Test Company only
- Dashboard: Test Company - Company Dashboard

---

## 📊 What You Can Do

### **As Super Admin**
- ✅ Create new companies
- ✅ Create company admins
- ✅ View all companies' data
- ✅ Manage all users
- ✅ View audit logs
- ✅ Access all modules

### **As Company Admin**
- ✅ Manage users in their company
- ✅ View company dashboard
- ✅ Create sales, purchases, inventory
- ✅ View company-specific reports
- ✅ Cannot access other companies' data

### **As Regular User**
- ✅ View dashboard
- ✅ Access assigned modules based on role
- ✅ Create and manage data
- ✅ Cannot access other companies' data

---

## 🔒 Data Isolation

**Company A data is completely separate from Company B data**

```
Company A
├── Users (only Company A users)
├── Sales (only Company A sales)
├── Purchases (only Company A purchases)
└── All data tagged with Company A ID

Company B
├── Users (only Company B users)
├── Sales (only Company B sales)
├── Purchases (only Company B purchases)
└── All data tagged with Company B ID
```

**When you login:**
1. System identifies your company
2. All data is filtered by your company
3. You only see your company's data
4. You cannot access other companies' data

---

## 📝 Common Tasks

### **Create a New Company**
1. Login as Super Admin
2. Go to Super Admin → Companies
3. Click "Add Company"
4. Fill in company details
5. Create admin user for company
6. New company is ready to use

### **Add User to Company**
1. Login as Company Admin
2. Go to Dashboard → Users
3. Click "Add User"
4. Fill in user details
5. Select role (Finance Manager, Sales Manager, etc.)
6. Set password
7. User is created and can login

### **View Company Dashboard**
1. Login as Company Admin
2. Dashboard automatically shows company metrics
3. Header displays company name
4. All data is company-specific

### **Switch Companies (Super Admin)**
1. Login as Super Admin
2. Go to Super Admin → Companies
3. Click on company name
4. View that company's data
5. Can manage that company

---

## 🎯 Key Features

### **Multi-Tenant Isolation**
- Each company has separate data
- Users can only see their company's data
- Super admin can see all companies

### **Role-Based Access Control**
- 12 different roles available
- Each role has specific module access
- Menu automatically filters based on role

### **Company Dashboard**
- Shows company-specific metrics
- Displays company name in header
- Real-time data from database

### **User Management**
- Company admins manage their users
- User limits based on subscription plan
- Password hashing with bcrypt

### **Audit Logging**
- All operations logged
- Company context captured
- Full compliance trail

---

## 🔧 API Endpoints

### **Authentication**
```
POST /api/auth/login
  - Login with email/password
  - Returns: token, user, company

GET /api/auth/me
  - Get current user info
```

### **Company Isolation**
```
GET /api/dashboard/metrics?companyId={id}
  - Get company-specific metrics
  - Filtered by company

GET /api/sales
  - Get sales (filtered by user's company)

POST /api/sales
  - Create sale (auto-assigned to user's company)
```

### **User Management**
```
GET /api/company-admin/users
  - Get users in company

POST /api/company-admin/users
  - Create user in company

PUT /api/company-admin/users/:id
  - Update user

DELETE /api/company-admin/users/:id
  - Delete user
```

### **Super Admin**
```
GET /api/super-admin/companies
  - Get all companies

POST /api/super-admin/companies-with-admin
  - Create company with admin

GET /api/super-admin/users
  - Get all users
```

---

## 📱 Dashboard Sections

### **Company Admin Dashboard**
- **Overview**: Company metrics (sales, purchases, profit)
- **Sales**: Create and manage sales
- **Purchases**: Create and manage purchases
- **Inventory**: Manage inventory items
- **Users**: Manage company users
- **Reports**: View company reports

### **Super Admin Dashboard**
- **Companies**: Manage all companies
- **Admins**: Manage company admins
- **Users**: Manage all users
- **Audit Logs**: View all operations
- **Analytics**: Platform-wide analytics

---

## 🛠️ Troubleshooting

### **Company Name Not Showing**
1. Clear browser cache
2. Logout and login again
3. Check localStorage: `JSON.parse(localStorage.getItem('tenant'))`
4. Should show company data

### **Cannot See Other Company's Data**
- This is correct! Data isolation is working
- You can only see your company's data
- Super admin can see all companies

### **User Cannot Login**
1. Check email is correct
2. Check password is correct
3. Check user is active (not deactivated)
4. Check user belongs to a company

### **Dashboard Shows No Data**
1. New companies start with no data
2. Create some sales/purchases to see metrics
3. Dashboard will update automatically

---

## 📚 Documentation

- **IMPLEMENTATION_COMPLETE.md** - Full implementation details
- **MULTI_TENANT_DATA_ISOLATION_COMPLETE.md** - Data isolation guide
- **SYSTEM_ARCHITECTURE.md** - System architecture
- **MULTI_TENANT_QUICK_REFERENCE.md** - Quick reference

---

## ✅ Verification

**To verify everything is working:**

1. ✅ Backend running on port 5001
2. ✅ Frontend running on port 8081
3. ✅ Can login with super admin
4. ✅ Can login with company admin
5. ✅ Dashboard shows company name
6. ✅ Dashboard shows company metrics
7. ✅ Can create users
8. ✅ Can create sales/purchases
9. ✅ Data is isolated by company
10. ✅ Audit logs are created

---

## 🎉 You're Ready!

The multi-tenant ERP system is ready to use. Start by:

1. Login as Super Admin
2. Create a new company
3. Create company admin
4. Login as company admin
5. Explore the dashboard
6. Create some data
7. Verify data isolation

**Enjoy your multi-tenant ERP system!**
