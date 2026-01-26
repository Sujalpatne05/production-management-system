# Quick Start Checklist

## 🚀 Before You Can Run Migrations

You need **Docker Desktop** or **PostgreSQL installed locally**.

### ❌ Current Status
Docker Desktop is NOT installed on your computer.

---

## 📋 Two Options

### Option A: Docker (Recommended - Easiest)

```
1. Download & Install Docker Desktop
   └─ https://www.docker.com/products/docker-desktop
   
2. Run these commands:
   cd C:\Users\sujal\Desktop\Production Management\server
   docker-compose up -d
   
3. Verify containers running:
   docker-compose ps
```

### Option B: Local PostgreSQL (No Docker needed)

```
1. Download & Install PostgreSQL 16
   └─ https://www.postgresql.org/download/
   
2. During install, set password to: "password"

3. Create database:
   psql -U postgres
   CREATE DATABASE production_management;
   \q
```

---

## ⏭️ Once Database is Ready

### Command 1: Run Migrations
```bash
cd server
npx prisma migrate dev --name initial_schema
```
⏱️ Takes: ~5 seconds
📊 Creates: All 40+ database tables

### Command 2: Seed Demo Data
```bash
npx prisma db seed
```
⏱️ Takes: ~2 seconds
📦 Adds: Products, customers, suppliers, accounts, etc.

### Command 3: View Database (Optional)
```bash
npx prisma studio
```
Opens: http://localhost:5555

### Command 4: Start Backend Server
```bash
npm run start:dev
```
Runs on: http://localhost:3000

---

## 🎯 Full Timeline

```
Install Docker Desktop (5 min)
    ↓
Start containers (30 sec + 10 sec warmup)
    ↓
Run migrations (5 sec) ✅
    ↓
Seed database (2 sec) ✅
    ↓
Start server (10 sec) ✅
    ↓
Open http://localhost:3000 in browser ✅
```

---

## 📝 What Gets Created

**Database Tables**: 40+ models
- Tenants, Users, Roles, Permissions
- Products, RawMaterials, Stock
- Sales, Purchases, Orders
- Productions, Waste Logs
- Accounts, Transactions
- Customers, Suppliers
- And more...

**Demo Data** (in seed):
- 4 Roles (Admin, Manager, Supervisor, User)
- 12 Permissions
- 1 Tenant: "Demo Company"
- 1 User: admin@demo.com
- 3 Products (Smart Speaker, Office Chair, Cotton Fabric)
- 2 Raw Materials
- 2 Customers, 2 Suppliers
- Full Chart of Accounts

---

## ✅ Success Indicators

When migrations complete, you'll see:
```
✔ Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client
```

When seed completes, you'll see:
```
✅ Seeding complete!
```

When server starts, you'll see:
```
[Nest] 12345  - 12/27/2025, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/27/2025, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
...
[Nest] 12345  - 12/27/2025, 10:00:00 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 12/27/2025, 10:00:00 AM     LOG Server running on http://localhost:3000
```

---

## 🔑 Login Credentials

**Email**: admin@demo.com
**Password**: (no password set - set during registration or auth implementation)

---

## 📚 Full Documentation

See: `DOCKER_SETUP.md` for detailed troubleshooting and alternatives
See: `SCHEMA_EXTENDED.md` for database schema reference
See: `IMPLEMENTATION_COMPLETE.md` for API endpoints
