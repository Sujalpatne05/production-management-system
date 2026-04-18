# Quick Reference - System Overview

## 🚀 Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:8081
- Backend: http://localhost:5001/api

---

## 🔐 Login Credentials

### Admin
```
Email: admin@example.com
Password: password
```

### Test Users
```
Email: sujalpatne05@gmail.com
Password: Sujal@123

Email: john@example.com
Password: User@123456

Email: jane@example.com
Password: User@123456

Email: bob@example.com
Password: User@123456
```

---

## 📊 What Works

### ✅ Login
- Users can login with email and password
- Passwords are securely hashed
- JWT tokens generated
- Tokens stored in localStorage

### ✅ User Management (Admin Only)
- View all users
- Create new users with password
- Edit user details
- Delete users
- See available roles

### ✅ Route Protection
- Admin routes protected
- Non-admin users redirected
- Automatic role-based access control

### ✅ User Directory (All Users)
- View all users (read-only)
- Export to CSV
- Search and filter

---

## 🎯 Key Features

### Password Security
- Bcrypt hashing (10 salt rounds)
- Minimum 6 characters
- Never stored as plain text

### Authentication
- JWT tokens (8-hour expiration)
- Token validation on every request
- Automatic logout on token expiration

### Authorization
- Role-based access control
- Frontend route protection
- Backend endpoint protection

### User Roles
- **admin** - Can manage users
- **HR Manager, Sales Manager, etc.** - Regular users

---

## 📝 Common Tasks

### Create New User
1. Login as admin
2. Go to Admin Panel → User Management
3. Click "Add User"
4. Enter: name, email, role, password
5. Click "Create User"

### Edit User
1. Go to Admin Panel → User Management
2. Click edit button (pencil icon)
3. Update details
4. Click "Save Changes"

### Delete User
1. Go to Admin Panel → User Management
2. Click delete button (trash icon)
3. Confirm deletion

### Login as Different User
1. Logout (click profile → Logout)
2. Enter different email and password
3. Click "Sign In"

---

## 🔧 Troubleshooting

### Login Not Working
- Check email and password
- Verify backend is running
- Check browser console (F12)

### User Management Page Blank
- Refresh page (F5)
- Check browser console (F12)
- Verify you're logged in as admin

### Can't Create User
- Verify password is 6+ characters
- Verify email is not already in use
- Check backend logs

### Can't Access Admin Panel
- Verify you're logged in as admin
- Check user role in localStorage
- Refresh page (F5)

---

## 📂 Important Files

### Backend
- `backend/server-prisma.js` - Main server file
- `backend/user-module.js` - User management endpoints
- `backend/.env` - Environment variables

### Frontend
- `src/App.tsx` - Routes and app structure
- `src/pages/Login.tsx` - Login page
- `src/pages/dashboard/admin/UserManagement.tsx` - User management
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/services/authService.ts` - Authentication service
- `src/services/companyAdminUserService.ts` - User API service

### Database
- `backend/prisma/schema.prisma` - Database schema

---

## 🧪 Test Scenarios

### Scenario 1: Admin Login
1. Login as admin@example.com / password
2. Go to Admin Panel → User Management
3. See user list
4. Create new user
5. Edit user
6. Delete user

### Scenario 2: Non-Admin Login
1. Login as sujalpatne05@gmail.com / Sujal@123
2. See regular dashboard
3. Try to access /dashboard/admin/users
4. Get redirected to /dashboard/overview

### Scenario 3: Create & Login New User
1. Login as admin
2. Create new user: test@example.com / TestPass123
3. Logout
4. Login as test@example.com / TestPass123
5. See dashboard

---

## 📊 API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Users (Admin)
- `GET /api/company-admin/users` - Get users
- `POST /api/company-admin/users` - Create user
- `PUT /api/company-admin/users/:id` - Update user
- `DELETE /api/company-admin/users/:id` - Delete user
- `GET /api/company-admin/roles` - Get roles

### Users (All)
- `GET /api/users` - Get all users (read-only)

---

## 🔒 Security

### ✅ Implemented
- Password hashing (bcrypt)
- JWT authentication
- Role-based access control
- CORS configuration
- Token validation

### ⚠️ To Do (Production)
- Change default passwords
- Update JWT_SECRET
- Configure HTTPS
- Set up monitoring
- Configure backups

---

## 📞 Support

### Check These First
1. Backend logs: `npm run dev` output
2. Browser console: F12 → Console tab
3. Network tab: F12 → Network tab
4. Database: Check .env file

### Common Commands
```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm run dev

# Check health
curl http://localhost:5001/api/health

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## ✅ Verification

- [x] Backend running on port 5001
- [x] Frontend running on port 8081
- [x] Database connected
- [x] Users can login
- [x] User Management works
- [x] Route protection works
- [x] Passwords hashed
- [x] JWT tokens working

---

## 🎉 Status

**COMPLETE AND READY TO USE**

All systems operational. Ready for testing and deployment.

---

## 📚 Full Documentation

For detailed information, see:
- `README_LOGIN_FIX.md` - Login fix overview
- `ROUTING_FIX_COMPLETE.md` - Route protection details
- `COMPLETE_SYSTEM_STATUS.md` - Full system status
- `QUICK_START_LOGIN.md` - Detailed quick start

---

**Last Updated:** April 17, 2026  
**Status:** ✅ COMPLETE
