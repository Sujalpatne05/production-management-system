# Quick Start - Login & User Management

## 🚀 Getting Started

### 1. Start the Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. Access the Application
- Frontend: http://localhost:8081
- Backend API: http://localhost:5001/api

---

## 🔐 Login Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** password
- **Role:** Admin

### Test Accounts
- **Email:** sujalpatne05@gmail.com
- **Password:** Sujal@123
- **Role:** HR Manager

- **Email:** john@example.com
- **Password:** User@123456
- **Role:** Sales Manager

---

## 👥 User Management

### Create New User
1. Login as admin
2. Go to **Admin Panel** → **User Management**
3. Click **Add User**
4. Fill in:
   - Full Name
   - Email
   - Role (select from 9 business roles)
   - Password (minimum 6 characters)
5. Click **Create User**

### Available Roles
- CEO
- Finance Manager
- Sales Manager
- Procurement Manager
- Production Manager
- Quality Manager
- Warehouse Manager
- HR Manager
- System Administrator

### Edit User
1. Go to **Admin Panel** → **User Management**
2. Click the **Edit** button (pencil icon)
3. Update name, email, or role
4. Click **Save Changes**

### Delete User
1. Go to **Admin Panel** → **User Management**
2. Click the **Delete** button (trash icon)
3. Confirm deletion

---

## 🔑 Password Requirements

- **Minimum Length:** 6 characters
- **Hashing:** bcrypt (10 salt rounds)
- **Storage:** Hashed in database (not plain text)
- **Verification:** bcrypt.compareSync()

---

## 📊 User Directory vs User Management

### User Directory (`/dashboard/users/list`)
- **Purpose:** View all users in the system
- **Features:** Read-only, export to CSV
- **Access:** All authenticated users

### User Management (`/dashboard/admin/users`)
- **Purpose:** Create, edit, delete users
- **Features:** Full CRUD operations, role assignment, password setup
- **Access:** Admin only

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Can login with admin@example.com / password
- [ ] Can access User Management page
- [ ] Can see 9 business roles in dropdown
- [ ] Can create new user with password
- [ ] Can login with newly created user
- [ ] Can edit user details
- [ ] Can delete user
- [ ] User Directory shows all users (read-only)

---

## 🐛 Troubleshooting

### Login Not Working
1. Check email and password are correct
2. Verify backend is running (http://localhost:5001/api/health)
3. Check browser console for errors (F12)
4. Check backend logs for error messages

### User Management Page Blank
1. Refresh the page (F5)
2. Check browser console for errors (F12)
3. Verify you're logged in as admin
4. Check backend logs

### Can't Create User
1. Verify password is at least 6 characters
2. Verify email is not already in use
3. Verify you haven't reached user limit (10 users max)
4. Check backend logs for error message

### Password Not Working After Creation
1. Verify password was entered correctly
2. Verify password is at least 6 characters
3. Try resetting password (if available)
4. Check backend logs

---

## 📝 API Endpoints

### Authentication
- **POST** `/api/auth/login` - Login with email and password
- **GET** `/api/auth/me` - Get current user info

### User Management
- **GET** `/api/company-admin/users` - Get all users
- **POST** `/api/company-admin/users` - Create new user
- **PUT** `/api/company-admin/users/:id` - Update user
- **DELETE** `/api/company-admin/users/:id` - Delete user
- **GET** `/api/company-admin/roles` - Get available roles

---

## 🔒 Security Notes

### ✅ What's Secure
- Passwords are hashed using bcrypt
- Passwords are never stored as plain text
- JWT tokens are used for authentication
- Tokens expire after 8 hours

### ⚠️ Best Practices
1. Change default passwords in production
2. Use strong passwords (8+ characters, mix of letters/numbers/symbols)
3. Don't share login credentials
4. Logout when done
5. Use HTTPS in production

---

## 📞 Support

For issues:
1. Check the logs in terminal
2. Check browser console (F12)
3. Verify backend is running
4. Verify database connection
5. Check .env file for correct configuration

---

## 🎯 Next Steps

1. ✅ Login with admin account
2. ✅ Create a test user
3. ✅ Login with test user
4. ✅ Explore the dashboard
5. ✅ Create more users as needed

**Status:** Ready to use! 🚀
