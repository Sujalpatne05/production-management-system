# Quick Start - Running Frontend & Backend

**Date:** April 15, 2026
**Status:** ✅ READY TO RUN

---

## 🚀 Start Both Servers

### Option 1: Run in Separate Terminals (Recommended)

#### Terminal 1 - Backend Server
```bash
cd production-management-system/backend
npm install
npm run dev
```

**Expected Output:**
```
✓ Database connected successfully
🚀 ================================
   Backend Server Running!
   ================================
   📡 URL: http://localhost:5000
   📊 API: http://localhost:5000/api
   ❤️  Health: http://localhost:5000/api/health
   🐘 Database: PostgreSQL (Neon)
   ================================
```

#### Terminal 2 - Frontend Server
```bash
cd production-management-system
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.4.19  ready in 2047 ms
➜  Local:   http://localhost:8081/
➜  Network: http://192.168.x.x:8081/
```

---

## 🔐 Login Credentials

### Super Admin (Full Access)
```
Email:    superadmin@example.com
Username: superadmin
Password: password
```

### Company Admin (Company Access)
```
Email:    admin@example.com
Username: admin
Password: password
```

### Regular User (Read-Only)
```
Email:    user@example.com
Username: user
Password: password
```

---

## 🌐 Access URLs

| Component | URL | Port |
|-----------|-----|------|
| **Frontend** | http://localhost:8081 | 8081 |
| **Backend API** | http://localhost:5000 | 5000 |
| **API Health** | http://localhost:5000/api/health | 5000 |
| **Prisma Studio** | http://localhost:5555 | 5555 |

---

## 📋 Available Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/logout
```

### Super Admin
```
GET    /api/super-admin/companies
POST   /api/super-admin/companies
PUT    /api/super-admin/companies/:id
DELETE /api/super-admin/companies/:id

GET    /api/super-admin/users
POST   /api/super-admin/users
PUT    /api/super-admin/users/:id
DELETE /api/super-admin/users/:id

GET    /api/super-admin/plans
POST   /api/super-admin/plans
PUT    /api/super-admin/plans/:id
DELETE /api/super-admin/plans/:id

GET    /api/super-admin/subscriptions
PUT    /api/super-admin/subscriptions/:id

GET    /api/super-admin/admins
POST   /api/super-admin/admins
PUT    /api/super-admin/admins/:id
DELETE /api/super-admin/admins/:id

GET    /api/super-admin/audit-logs
GET    /api/super-admin/audit-logs/:id
GET    /api/super-admin/audit-logs/export/csv
GET    /api/super-admin/audit-stats

GET    /api/super-admin/api-keys
POST   /api/super-admin/api-keys
PUT    /api/super-admin/api-keys/:id
DELETE /api/super-admin/api-keys/:id

GET    /api/super-admin/tickets
POST   /api/super-admin/tickets
PUT    /api/super-admin/tickets/:id
POST   /api/super-admin/tickets/:id/close
```

### Company Admin
```
GET    /api/company-admin/users
POST   /api/company-admin/users
PUT    /api/company-admin/users/:id
DELETE /api/company-admin/users/:id

GET    /api/company-admin/settings
PUT    /api/company-admin/settings

GET    /api/company-admin/subscription

GET    /api/company-admin/audit-logs

GET    /api/company-admin/analytics
```

### ERP Modules
```
GET    /api/users
GET    /api/orders
GET    /api/sales
GET    /api/purchases
GET    /api/inventory
GET    /api/production
GET    /api/hr/employees
GET    /api/hr/attendance
GET    /api/hr/payroll
GET    /api/hr/leaves
GET    /api/analytics/*
```

---

## 🧪 Test Login

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "password"
  }'

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "role": "super_admin",
    "name": "Super Admin",
    "email": "superadmin@example.com"
  }
}
```

### Using Postman
1. Open Postman
2. Create new POST request
3. URL: `http://localhost:5000/api/auth/login`
4. Body (JSON):
```json
{
  "email": "superadmin@example.com",
  "password": "password"
}
```
5. Send request
6. Copy token from response
7. Use token in Authorization header for other requests

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Database Connection Error
1. Check DATABASE_URL in `backend/.env`
2. Verify PostgreSQL is running
3. Check network connectivity
4. Run migrations: `npm run prisma:migrate`

### CORS Issues
- Check CORS configuration in `backend/server-prisma.js`
- Verify frontend URL is in allowed origins
- Check browser console for CORS errors

### Module Not Found
```bash
# Reinstall dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Token Expired
- Re-login to get new token
- Token expires after 8 hours
- Use refresh endpoint to get new token

---

## 📊 System Architecture

```
Frontend (Vite + React)
    ↓
    ↓ HTTP/REST
    ↓
Backend (Express + Prisma)
    ↓
    ↓ SQL
    ↓
Database (PostgreSQL - Neon)
```

---

## 🎯 Next Steps

1. **Start Servers**
   - Backend: `npm run dev` in backend folder
   - Frontend: `npm run dev` in root folder

2. **Login**
   - Open http://localhost:8081
   - Use credentials above

3. **Explore**
   - Navigate Super Admin Panel
   - Create companies and users
   - View analytics and reports

4. **Test API**
   - Use Postman or cURL
   - Test endpoints documented above
   - Verify authentication and authorization

---

## 📚 Documentation

- **LOGIN_CREDENTIALS.md** - Detailed login information
- **CONSOLIDATED_MODULES_GUIDE.md** - Module documentation
- **PHASE_3_COMPLETION_REPORT.md** - Architecture changes
- **CLEANUP_FINAL_STATUS.md** - System status

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 8081
- [ ] Database connected successfully
- [ ] Can login with superadmin credentials
- [ ] Can access Super Admin Panel
- [ ] Can view companies and users
- [ ] Can create new company
- [ ] Can create new user
- [ ] Can view analytics
- [ ] API endpoints responding

---

**Status:** ✅ READY TO RUN
**Last Updated:** April 15, 2026

