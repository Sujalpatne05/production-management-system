# ✅ Prisma + Neon DB Setup Checklist

## Pre-Setup Requirements
- [ ] Node.js installed (v14+)
- [ ] npm installed
- [ ] Git installed
- [ ] Internet connection
- [ ] Text editor (VS Code recommended)

---

## Phase 1: Neon DB Account (5 minutes)

### Create Account
- [ ] Go to https://console.neon.tech
- [ ] Sign up with email/GitHub/Google
- [ ] Verify email (if needed)
- [ ] Log in to dashboard

### Create Database
- [ ] Click "Create a new project"
- [ ] Choose region (e.g., US East)
- [ ] Wait for project creation
- [ ] See "Connection string" button

### Get Connection String
- [ ] Click "Connection string"
- [ ] Copy the full URL
- [ ] Save it somewhere safe
- [ ] Format: `postgresql://user:password@host/database?sslmode=require`

---

## Phase 2: Backend Configuration (3 minutes)

### Update Environment File
- [ ] Open `backend/.env`
- [ ] Find `DATABASE_URL=`
- [ ] Replace with your Neon connection string
- [ ] Save the file
- [ ] Verify no typos in URL

### Verify Dependencies
- [ ] Open terminal
- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Wait for completion
- [ ] No errors shown

---

## Phase 3: Database Setup (5 minutes)

### Generate Prisma Client
- [ ] Run: `npm run prisma:generate`
- [ ] Wait for completion
- [ ] See: "Generated Prisma Client"
- [ ] No errors shown

### Run Migrations
- [ ] Run: `npm run prisma:migrate`
- [ ] Choose migration name (e.g., "init")
- [ ] Wait for completion
- [ ] See: "Your database is now in sync"
- [ ] No errors shown

### Seed Database
- [ ] Run: `npm run prisma:seed`
- [ ] Wait for completion
- [ ] See: "Database seeding completed!"
- [ ] No errors shown

---

## Phase 4: Start Backend (2 minutes)

### Stop Old Backend (if running)
- [ ] If JSON backend is running, stop it
- [ ] Close the terminal or press Ctrl+C

### Start Prisma Backend
- [ ] Run: `npm run dev:prisma`
- [ ] Wait for startup
- [ ] See: "Backend Server Running!"
- [ ] See: "Database: PostgreSQL (Neon)"
- [ ] See: "http://localhost:5000"

---

## Phase 5: Test Backend (5 minutes)

### Test Login Endpoint
- [ ] Open new terminal
- [ ] Run login curl command (see below)
- [ ] Get response with token
- [ ] Copy the token

### Test Get Orders
- [ ] Run get orders curl command
- [ ] Use token from login
- [ ] Get empty array response
- [ ] See: `"success": true`

### Test Create Order
- [ ] Run create order curl command
- [ ] Use token from login
- [ ] Get created order back
- [ ] See: `"orderNumber": "ORD-001"`

### Test Prisma Studio (Optional)
- [ ] Run: `npm run prisma:studio`
- [ ] Open http://localhost:5555
- [ ] See all database tables
- [ ] See seeded data
- [ ] Close browser

---

## Phase 6: Frontend Integration (2 minutes)

### Verify API Configuration
- [ ] Open `src/config/apiConfig.ts`
- [ ] Check: `API_URL: 'http://localhost:5000/api'`
- [ ] If different, update it
- [ ] Save the file

### Test Frontend Login
- [ ] Go to http://localhost:8081
- [ ] Enter username: `admin`
- [ ] Enter password: `password`
- [ ] Click "Sign In"
- [ ] See dashboard (no error)

### Verify Frontend Connected
- [ ] Check browser console (F12)
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] See successful API calls

---

## Phase 7: Verification (5 minutes)

### Backend Health Check
- [ ] Open http://localhost:5000/api/health
- [ ] See: `"status": "healthy"`
- [ ] See: `"database": "PostgreSQL (Neon)"`

### Database Connection
- [ ] Backend console shows no errors
- [ ] See: "Database connected successfully"
- [ ] See: "Created 3 users"

### API Endpoints Working
- [ ] Login endpoint works
- [ ] Get orders endpoint works
- [ ] Create order endpoint works
- [ ] Update order endpoint works
- [ ] Delete order endpoint works

### Frontend Working
- [ ] Login page loads
- [ ] Can login with admin/password
- [ ] Dashboard displays
- [ ] No console errors

---

## 🎉 Success Indicators

You're done when you see:

✅ Backend running on http://localhost:5000
✅ Database: PostgreSQL (Neon)
✅ Login successful with admin/password
✅ Frontend dashboard loads
✅ No errors in console
✅ API endpoints responding

---

## 🆘 Troubleshooting

### If you see: "password authentication failed"
- [ ] Check DATABASE_URL in .env
- [ ] Verify username and password
- [ ] Check for special characters
- [ ] Try URL encoding special chars
- [ ] Check IP whitelist in Neon console

### If you see: "Cannot find module '@prisma/client'"
- [ ] Run: `npm run prisma:generate`
- [ ] Run: `npm install`

### If you see: "relation does not exist"
- [ ] Run: `npm run prisma:migrate`
- [ ] Run: `npm run prisma:seed`

### If you see: "Port 5000 already in use"
- [ ] Run: `npm run kill-port`
- [ ] Run: `npm run dev:prisma`

### If frontend shows "Invalid credentials"
- [ ] Check backend is running
- [ ] Check API_URL in frontend config
- [ ] Check browser console for CORS errors
- [ ] Verify login endpoint works with curl

### If you see: "CORS error"
- [ ] Check backend CORS configuration
- [ ] Verify frontend URL is whitelisted
- [ ] Check API_URL matches backend URL

---

## 📞 Quick Reference

### Important URLs
- Frontend: http://localhost:8081
- Backend: http://localhost:5000
- API: http://localhost:5000/api
- Prisma Studio: http://localhost:5555
- Neon Console: https://console.neon.tech

### Important Commands
```bash
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run dev:prisma         # Start dev server
npm run prisma:studio      # Open Prisma Studio
npm run kill-port          # Kill port 5000
```

### Default Credentials
- Username: `admin`
- Password: `password`
- Role: `admin`

### Test Commands
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get Orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN"

# Create Order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"orderNumber":"ORD-001","customer":"ABC","total":1500}'
```

---

## 📝 Notes

- Keep your DATABASE_URL secret (don't commit to git)
- Change JWT_SECRET in production
- Use strong passwords for Neon account
- Backup your database regularly
- Monitor Neon usage (free tier has limits)

---

## ✨ Next Steps After Setup

1. Test all API endpoints
2. Create sample data
3. Build frontend features
4. Add PDF generation
5. Implement email notifications
6. Add advanced features

---

## 📚 Documentation

- Full setup: `SETUP_INSTRUCTIONS.md`
- Neon specific: `NEON_DB_SETUP.md`
- What's included: `PRISMA_SETUP_COMPLETE.md`
- Summary: `PRISMA_NEON_SUMMARY.md`

---

**Total Setup Time:** ~20 minutes

**Questions?** Check the console output for detailed error messages.

---

## ✅ Final Checklist

- [ ] All phases completed
- [ ] All tests passed
- [ ] Frontend login works
- [ ] Backend running
- [ ] Database connected
- [ ] No errors in console
- [ ] Ready to build features

🎉 **You're all set! Happy coding!**
