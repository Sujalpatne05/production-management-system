# ✅ System Testing & Verification Guide

## 1️⃣ Check Frontend is Working

### Open Browser
```
http://localhost:8081
```

**You should see:**
- Login page or Dashboard
- No error messages in browser console
- Responsive UI

### Check Browser Console
```
Press F12 (or Ctrl+Shift+I)
→ Click "Console" tab
→ Should be no red errors (yellow warnings are okay)
```

---

## 2️⃣ Check Backend is Working

### Method 1: Check Server Logs
```bash
# Look at the terminal running "npm run start:dev"
# You should see: "Application is running on: http://localhost:3000"
```

### Method 2: Test Backend with curl
```bash
# Open PowerShell or Command Prompt
# Test if backend is responding

curl http://localhost:3000/api

# Or test with a simpler command
curl -I http://localhost:3000/api/auth/login
```

**Expected Response:**
- Status: 200 OK (or 404 for not found routes)
- Headers appear
- No connection refused error

### Method 3: Test API in Browser
```
http://localhost:3000/api/auth/login
```
Shows JSON response (may be an error, but that's okay - it means backend is responding)

---

## 3️⃣ Check Database is Connected & Working

### Method A: Use Prisma Studio (BEST WAY)

**Step 1: Open new terminal**
```bash
cd C:\Users\sujal\Desktop\Production Management\server
```

**Step 2: Run Prisma Studio**
```bash
npx prisma studio
```

**Step 3: Open in Browser**
```
http://localhost:5555
```

**Step 4: Check Tables**
- Click on "Role" → Should see 4 roles (Admin, Manager, Supervisor, User)
- Click on "Tenant" → Should see "Demo Company"
- Click on "User" → Should see admin@demo.com
- Click on "Product" → Should see products (Smart Speaker, Office Chair, Cotton Fabric)

✅ **If you see data, database is working!**

---

### Method B: Use PostgreSQL Client

**Step 1: Install DBeaver or pgAdmin (optional)**
- Download: https://dbeaver.io/ or https://www.pgadmin.org/

**Step 2: Connect to Database**
```
Host: localhost
Port: 5432
Database: production_management
Username: postgres
Password: password
```

**Step 3: Query Tables**
```sql
-- Check roles
SELECT * FROM "Role";

-- Check users
SELECT * FROM "User";

-- Check products
SELECT * FROM "Product";

-- Check tenants
SELECT * FROM "Tenant";

-- Count records
SELECT COUNT(*) FROM "Product";
```

---

## 4️⃣ Test API Endpoints

### Method A: Using curl (PowerShell)

**Step 1: Get Login Token**
```powershell
$body = @{
    email = "admin@demo.com"
    password = "admin123"
} | ConvertTo-Json

curl -X POST "http://localhost:3000/api/auth/login" `
  -H "Content-Type: application/json" `
  -Body $body
```

**Step 2: Copy the `access_token` from response**

**Step 3: Test Get Products**
```powershell
curl -X GET "http://localhost:3000/api/products" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "id": "...",
    "name": "Smart Speaker",
    "sku": "SPK-001",
    "cost": 25,
    "sellingPrice": 49.99
  }
]
```

---

### Method B: Using Postman (Easier)

**Step 1: Download Postman**
```
https://www.postman.com/downloads/
```

**Step 2: Create New Request**
- Type: POST
- URL: http://localhost:3000/api/auth/login
- Body (JSON):
```json
{
  "email": "admin@demo.com",
  "password": "admin123"
}
```

**Step 3: Click Send**
- You'll get a response with `access_token`

**Step 4: Create Another Request**
- Type: GET
- URL: http://localhost:3000/api/products
- Headers:
  - Key: Authorization
  - Value: Bearer YOUR_TOKEN_FROM_STEP_3

**Step 5: Click Send**
- You should see list of products in response

---

### Method C: Using Browser Network Tab

**Step 1: Open http://localhost:8081 in browser**

**Step 2: Open Developer Tools**
```
Press F12 → Click "Network" tab
```

**Step 3: Try Login**
- If frontend is connected to backend, you'll see:
  - Request to POST /api/auth/login
  - Response with token and user data

**Step 4: Check Response**
- Click on the request
- Click "Response" tab
- You should see JSON with user data

✅ **If you see response with data, API is working!**

---

## 5️⃣ Verify Data Storage

### Check 1: Seeded Demo Data

**In Prisma Studio (http://localhost:5555):**

| Table | Expected Data | Where |
|-------|---------------|-------|
| Role | 4 roles | Admin, Manager, Supervisor, User |
| Permission | 12 permissions | orders.read, orders.write, etc. |
| Tenant | Demo Company | Name = "Demo Company" |
| User | admin@demo.com | Email = "admin@demo.com" |
| Product | 3 products | Smart Speaker, Office Chair, Cotton Fabric |
| RawMaterial | 2 materials | ABS Plastic Pellets, Cotton Thread |
| Stock | 5 stocks | For products and raw materials |
| Customer | 2 customers | ABC Corp, XYZ Industries |
| Supplier | 2 suppliers | Global Supplies Inc, Premium Materials Ltd |
| Account | 8 accounts | Chart of accounts for accounting |

✅ **If all these exist, seeding worked!**

---

### Check 2: Create New Data via API

**Test Creating a New Product:**

```bash
# 1. Get token (copy from login response)

# 2. Create Product
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tenantId": "demo-tenant-id",
    "categoryId": "YOUR_CATEGORY_ID",
    "name": "Test Product",
    "sku": "TEST-001",
    "unitOfMeasure": "piece",
    "cost": 10,
    "sellingPrice": 25,
    "reorderLevel": 5
  }'

# 3. Check Prisma Studio
# Go to http://localhost:5555
# Click "Product" table
# You should see "Test Product" in the list
```

✅ **If new product appears in database, writes are working!**

---

## 6️⃣ Complete Testing Checklist

### Frontend
- [ ] Open http://localhost:8081 - Page loads
- [ ] No errors in browser console (F12)
- [ ] Can see UI elements (buttons, forms, etc.)
- [ ] Layout is responsive

### Backend
- [ ] Terminal shows "Application is running on: http://localhost:3000"
- [ ] Can access http://localhost:3000/api in browser
- [ ] Responds to requests (not connection refused)

### Database
- [ ] Docker: `docker-compose ps` shows 2 containers (postgres, redis)
- [ ] Can open Prisma Studio: `npx prisma studio`
- [ ] Can see tables and data in Prisma Studio

### API Endpoints
- [ ] Login endpoint works: POST /api/auth/login
- [ ] Get Products works: GET /api/products
- [ ] Returns JSON with data
- [ ] Token-based auth working

### Data Storage
- [ ] Demo data exists in all tables
- [ ] Can create new records via API
- [ ] New records appear in Prisma Studio
- [ ] Data persists after refresh

---

## 7️⃣ Troubleshooting

### Issue: "Connection Refused" on Backend
**Solution:**
```bash
# Check if backend is running
# Terminal should show: "Application is running on: http://localhost:3000"

# If not, restart:
cd server
npm run start:dev
```

### Issue: Prisma Studio won't open
**Solution:**
```bash
cd server
npx prisma studio
# Wait for "Prisma Studio is running on..."
# Open http://localhost:5555 in browser
```

### Issue: No data in database
**Solution:**
```bash
# Reseed database
cd server
npx prisma db seed

# Or reset completely
npx prisma migrate reset --force
```

### Issue: Docker containers not running
**Solution:**
```bash
cd server

# Check status
docker-compose ps

# If stopped, start them
docker-compose up -d

# Check logs
docker-compose logs postgres
```

### Issue: API returns error "Unauthorized"
**Solution:**
- Make sure you're including Authorization header
- Use the `access_token` from login response
- Format: `Authorization: Bearer YOUR_TOKEN`

### Issue: API returns error "Tenant not found"
**Solution:**
```bash
# Use the correct tenant ID
# In Prisma Studio → Tenant table
# Copy the ID and use in API calls

# Or use demo tenant ID: "demo-tenant-id"
```

---

## 8️⃣ Quick Test Script

**Create a file: test.ps1**

```powershell
# PowerShell Test Script

Write-Host "🔍 Testing Production Management System"
Write-Host ""

# Test 1: Frontend
Write-Host "1️⃣ Frontend Check"
try {
    $response = curl -s http://localhost:8081
    if ($response) {
        Write-Host "✅ Frontend is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend not responding" -ForegroundColor Red
}

# Test 2: Backend
Write-Host "2️⃣ Backend Check"
try {
    $response = curl -s http://localhost:3000/api
    Write-Host "✅ Backend is responding" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
}

# Test 3: Database
Write-Host "3️⃣ Database Check"
$containers = docker-compose -f "C:\Users\sujal\Desktop\Production Management\server\docker-compose.yml" ps
if ($containers -like "*postgres*" -and $containers -like "*redis*") {
    Write-Host "✅ Docker containers running" -ForegroundColor Green
} else {
    Write-Host "❌ Docker containers not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing complete!"
```

**Run it:**
```bash
cd server
.\test.ps1
```

---

## ✅ Success Indicators

### All Systems Working ✅
```
✅ Frontend loads without errors
✅ Backend responds to requests
✅ Database shows seeded data
✅ API endpoints return data
✅ Can create new records
✅ New records appear in database
```

### If You See This
```
Browser Console: No red errors
Backend Logs: "Application is running on: http://localhost:3000"
Prisma Studio: Shows all tables with data
API Response: JSON with products/users/etc
Database: Contains demo data + any new records
```

**Then Everything is Working Properly! 🎉**

---

## 📊 What Data Should Exist

**After successful seeding:**

| Table | Count | Sample |
|-------|-------|--------|
| Role | 4 | Admin, Manager, Supervisor, User |
| Permission | 12 | orders.read, orders.write, ... |
| Tenant | 1+ | Demo Company |
| User | 1+ | admin@demo.com |
| Product | 3+ | Smart Speaker, Office Chair, ... |
| ProductCategory | 4 | Electronics, Furniture, ... |
| RawMaterial | 2+ | ABS Plastic Pellets, ... |
| Customer | 2+ | ABC Corp, XYZ Industries |
| Supplier | 2+ | Global Supplies Inc, ... |
| Account | 8+ | Cash, Sales Revenue, ... |
| Stock | 5+ | For products and materials |

**Total: 100+ records**

---

## 🎯 Next Steps if Everything Works

1. ✅ Open Frontend: http://localhost:8081
2. ✅ Try Login: admin@demo.com
3. ✅ Explore Dashboard
4. ✅ View Products/Orders/etc
5. ✅ Test creating new records
6. ✅ Check if they appear in Prisma Studio

**System is operational!** Ready for development. 🚀
