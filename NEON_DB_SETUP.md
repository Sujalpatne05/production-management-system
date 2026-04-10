# 🚀 Neon DB + Prisma Setup Guide

## Step 1: Create Neon DB Account & Database

1. Go to https://console.neon.tech
2. Sign up or log in
3. Create a new project
4. Copy your connection string (looks like: `postgresql://user:password@host/database?sslmode=require`)

## Step 2: Update Backend .env File

Edit `backend/.env` and replace the DATABASE_URL:

```env
DATABASE_URL="postgresql://neondb_owner:your_password@ep-xxx.us-east-1.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
NODE_ENV="development"
```

## Step 3: Run Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

## Step 4: Start the Backend with Prisma

```bash
# Development mode with auto-reload
npm run dev:prisma

# Or production mode
npm run start:prisma
```

## Step 5: View Database (Optional)

Open Prisma Studio to view/edit data:

```bash
npm run prisma:studio
```

Then open http://localhost:5555

---

## 🔧 Troubleshooting

### Connection Error: "password authentication failed"
- Check your DATABASE_URL is correct
- Verify username and password
- Make sure IP is whitelisted in Neon console

### Migration Error: "relation already exists"
- Run: `npx prisma migrate reset` (⚠️ This deletes all data)
- Then run: `npm run prisma:migrate`

### Port 5000 already in use
```bash
# Kill the process
npm run kill-port

# Then start again
npm run dev:prisma
```

### Prisma Client not found
```bash
npm run prisma:generate
```

---

## 📊 Available Endpoints

All endpoints require authentication (JWT token from login)

### Auth
- `POST /api/auth/login` - Login with username/email and password
- `GET /api/auth/me` - Get current user

### Resources (CRUD)
- `GET /api/{resource}` - List all
- `GET /api/{resource}/:id` - Get one
- `POST /api/{resource}` - Create
- `PUT /api/{resource}/:id` - Update
- `DELETE /api/{resource}/:id` - Delete

### Available Resources
- users, orders, sales, purchases, inventory
- production, expenses, payments, payroll
- attendance, outlets, parties, quotations
- wastes, settings, reports, accounting
- product-categories, rm-categories, expense-categories
- non-inventory-items, accounts, transactions, units

---

## 🔐 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| superadmin | password | Super Admin |
| admin | password | Admin |
| user | password | User |

---

## 📝 Example API Calls

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Get All Orders
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create New Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderNumber":"ORD-001",
    "customer":"ABC Corp",
    "total":1500.00,
    "status":"pending"
  }'
```

---

## 🎯 Next Steps

1. ✅ Set up Neon DB
2. ✅ Configure Prisma
3. ✅ Run migrations
4. ✅ Seed data
5. ⏭️ Test API endpoints
6. ⏭️ Connect frontend to backend
7. ⏭️ Build features

---

## 📚 Resources

- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Questions?** Check the backend console for detailed error messages.
