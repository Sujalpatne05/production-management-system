# Quick Start Guide - Production Management ERP System

## 🚀 System Status: FULLY OPERATIONAL ✅

Your production management ERP system is completely set up and ready to use!

---

## 📋 What's Working

✅ **Backend Server** - Running on port 5000
✅ **Frontend Application** - Running on port 3000
✅ **Database** - Connected to Neon PostgreSQL
✅ **Authentication** - Login, Registration, OTP verification
✅ **Dashboard** - Real-time metrics, alerts, analytics
✅ **API Endpoints** - 82+ endpoints implemented

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Access the Application
Open your browser and go to:
```
http://localhost:3000
```

### Step 2: Login with Default Credentials
- **Username**: `admin`
- **Password**: `password`

### Step 3: Explore the Dashboard
You'll see:
- Production metrics (OEE, Efficiency, Uptime, Defect Rate)
- Real-time alerts and notifications
- Production data table
- Drill-down analytics

---

## 📝 Register a New Account

### Option 1: Quick Registration
1. Click **"Register"** on the login page
2. Fill in the form:
   - **Full Name**: Your name
   - **Username**: Choose a username
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Role**: Select User, Admin, or Super Admin
3. Click **"Register"**
4. Enter the **6-digit OTP** (check backend console)
5. Click **"Verify OTP"**
6. You're logged in!

### Option 2: Test Accounts
Use these pre-created accounts:
- **admin** / **password** (Admin role)
- **superadmin** / **password** (Super Admin role)
- **user** / **password** (User role)

---

## 🔧 Running the System

### Terminal 1: Start Backend
```bash
cd backend
npm run dev:prisma
```
You should see:
```
✓ Seeded default users
Server running on port 5000
```

### Terminal 2: Start Frontend
```bash
npm run dev
```
You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

## 📊 Dashboard Features

### 1. Production Metrics
- **OEE**: Overall Equipment Effectiveness (Target: 75%+)
- **Efficiency**: Production efficiency (Target: 80%+)
- **Uptime**: Equipment uptime (Target: 85%+)
- **Defect Rate**: Quality metrics (Target: <5%)

### 2. Real-Time Updates
- Auto-refreshes every 30 seconds
- Manual refresh button available
- Last update timestamp displayed

### 3. Alerts & Notifications
- **Low Stock Alerts**: When inventory is below minimum
- **Payment Due Alerts**: 3 days before due date
- **Production Delay Alerts**: When production is delayed
- **Production Complete Alerts**: When production finishes

### 4. Drill-Down Analytics
- Click any metric to see detailed data
- View trend charts
- See transaction history
- Filter by date range

---

## 🔐 Authentication Flow

### Login Flow
```
User enters credentials
    ↓
Backend validates username/password
    ↓
JWT token generated
    ↓
User logged in and redirected to dashboard
```

### Registration Flow
```
User fills registration form
    ↓
Backend creates user account
    ↓
OTP generated and sent (logged to console)
    ↓
User enters OTP
    ↓
OTP verified
    ↓
User logged in and redirected to dashboard
```

---

## 🗄️ Database

### Connection Details
- **Provider**: PostgreSQL (Neon)
- **Region**: ap-southeast-1 (Singapore)
- **Models**: 24 database tables
- **Status**: Connected and seeded

### Default Data
- 3 default users (admin, superadmin, user)
- Sample production data
- Sample orders and sales
- Sample inventory items

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user info

### Resources (CRUD)
- `/api/users` - User management
- `/api/orders` - Orders
- `/api/production` - Production data
- `/api/sales` - Sales
- `/api/inventory` - Inventory
- `/api/expenses` - Expenses
- `/api/payments` - Payments
- And 15+ more resources...

### Dashboard
- `GET /api/dashboard/metrics` - Production metrics
- `GET /api/dashboard/alerts` - Alerts and notifications
- `GET /api/dashboard/production-stats` - Production statistics

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process
kill -9 <PID>

# Restart backend
npm run dev:prisma
```

### Frontend Can't Connect to Backend
1. Check if backend is running on port 5000
2. Check browser console (F12) for errors
3. Verify API_URL in `src/config/apiConfig.ts`
4. Check CORS configuration in `backend/server-prisma.js`

### Database Connection Error
1. Verify DATABASE_URL in `backend/.env`
2. Check Neon PostgreSQL connection
3. Run: `npm run prisma:migrate`

### OTP Not Appearing
- OTP is logged to backend console in development
- Check the terminal where backend is running
- Look for: `📧 OTP for [email]: [code]`

---

## 📱 Features Overview

### Current Implementation
✅ User authentication (login/register)
✅ OTP verification
✅ Role-based access control
✅ Production metrics dashboard
✅ Real-time data updates
✅ Alerts and notifications
✅ Drill-down analytics
✅ CRUD operations for 23 resources
✅ JWT token management
✅ CORS enabled for multiple domains

### Coming Soon
🔄 Email integration for OTP
🔄 Password hashing with bcrypt
🔄 Token refresh mechanism
🔄 Multi-tenancy support
🔄 Advanced reporting
🔄 Data export (PDF/Excel)
🔄 Mobile app
🔄 API documentation (Swagger)

---

## 📚 Documentation

For more detailed information, see:
- `SYSTEM_STATUS_REPORT.md` - Complete system status
- `DASHBOARD_QUICK_START.md` - Dashboard features
- `BACKEND_INTEGRATION_STEPS.md` - Backend setup
- `API_INTEGRATION_GUIDE.md` - API documentation

---

## 🎓 Example: Create a New Production Record

### Via API
```bash
curl -X POST http://localhost:5000/api/production \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceNo": "PRO-1024",
    "productId": "prod-123",
    "quantity": 100,
    "startDate": "2026-04-11T10:00:00Z",
    "status": "Running",
    "stage": "Assembly"
  }'
```

### Via Frontend
1. Login to dashboard
2. Navigate to Production section
3. Click "New Production"
4. Fill in the form
5. Click "Create"

---

## 🚀 Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Connect Render to GitHub
3. Set environment variables
4. Deploy

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Connect Vercel to GitHub
3. Set VITE_API_URL to production backend
4. Deploy

---

## 💡 Tips & Tricks

### Tip 1: Check Backend Logs
The backend console shows:
- User registrations
- OTP generation
- API requests
- Database operations
- Errors and warnings

### Tip 2: Use Browser DevTools
- Press F12 to open DevTools
- Check Network tab for API calls
- Check Console for errors
- Check Application tab for localStorage

### Tip 3: Reset Database
```bash
cd backend
npm run fix:db
```
This will delete all users and reseed default users.

### Tip 4: View Database
```bash
cd backend
npm run prisma:studio
```
Opens Prisma Studio to view and edit database directly.

---

## ❓ FAQ

**Q: How do I change the default password?**
A: Edit `backend/prisma/seed.js` and run `npm run prisma:seed`

**Q: Can I use a different database?**
A: Yes, update DATABASE_URL in `backend/.env` and run migrations

**Q: How do I add more users?**
A: Use the registration form or API endpoint

**Q: Is the system production-ready?**
A: It's ready for development and testing. For production, add email integration, password hashing, and security hardening.

**Q: How do I backup the database?**
A: Neon PostgreSQL provides automatic backups. Check your Neon dashboard.

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review backend console logs
3. Check browser console (F12)
4. Verify environment configuration
5. Check database connection

---

## 🎉 You're All Set!

Your production management ERP system is ready to use. Start by logging in with the default credentials and exploring the dashboard.

**Happy coding! 🚀**

---

**Last Updated**: April 11, 2026
**System Version**: 1.0.0
**Status**: ✅ FULLY OPERATIONAL
