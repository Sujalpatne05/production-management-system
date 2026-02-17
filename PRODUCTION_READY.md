# Production Management System - Production Ready

## 🚀 System Overview

A comprehensive multi-tenant ERP/Production Management System built with:
- **Backend**: NestJS + Prisma ORM + PostgreSQL
- **Frontend**: React + Vite + TypeScript
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Backend on Render, Frontend on Vercel

## 📦 Deployment Status

### ✅ Backend (Live)
- **URL**: https://production-management-system.onrender.com
- **Database**: PostgreSQL on Render
- **Features**: REST API, JWT Auth, Multi-tenant RBAC, Prisma ORM

### ✅ Frontend
- **Platform**: Vercel
- **Environment**: Production-ready with configured API endpoints

## 🔐 Authentication

**Production Mode Enabled** - All demo features have been disabled:
- ✅ Password validation enabled (bcrypt hashing)
- ✅ No automatic demo data seeding
- ✅ Seed endpoint protected with JWT authentication
- ✅ Real password verification on login

### Creating Users

Users must be registered with real passwords:

```bash
# Register a new user
POST /api/auth/register
{
  "email": "user@company.com",
  "password": "SecurePassword123!",
  "fullName": "User Name"
}

# Login
POST /api/auth/login
{
  "email": "user@company.com",
  "password": "SecurePassword123!"
}
```

## 🗄️ Database Setup

### Initial Seed (Admin Only)

The seed endpoint is now **protected** and requires authentication:

```bash
# 1. Login to get token
curl -X POST https://production-management-system.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"YourSecurePassword"}'

# 2. Use token to seed demo data (if needed for testing)
curl -X POST https://production-management-system.onrender.com/api/seed/demo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Database Migrations

Migrations run automatically on deployment via the build script:

```bash
npx prisma@6.1.0 generate && npx prisma@6.1.0 migrate deploy && nest build
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis (optional, for BullMQ)

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment (.env file)
DATABASE_URL="postgresql://user:password@localhost:5432/production_management"
JWT_SECRET="your-secure-jwt-secret"
CORS_ORIGIN="http://localhost:5173"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Configure environment (.env file)
VITE_API_URL="http://localhost:3000"

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (Render)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-secret
CORS_ORIGIN=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```env
VITE_API_URL=https://production-management-system.onrender.com
VITE_BASE_URL=/
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Protected Endpoints (Require JWT)
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `POST /api/seed/demo` - Seed demo data (admin only)

### Usage Example
```bash
# Get JWT token
TOKEN=$(curl -X POST https://production-management-system.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@company.com","password":"password"}' \
  | jq -r '.accessToken')

# Use token to access protected endpoints
curl https://production-management-system.onrender.com/api/sales \
  -H "Authorization: Bearer $TOKEN"
```

## 🔄 Production Changes Made

### Security Enhancements
1. **Password Authentication**: Enabled bcrypt password hashing and verification
2. **Seed Protection**: Added JWT guard to seed endpoint
3. **Auto-Seeding Disabled**: Removed OnModuleInit auto-seeding on startup

### Code Changes
- ✅ [server/src/seed/demo-seed.service.ts](server/src/seed/demo-seed.service.ts) - Removed OnModuleInit, converted to manual method
- ✅ [server/src/seed/seed.controller.ts](server/src/seed/seed.controller.ts) - Added JwtAuthGuard
- ✅ [server/src/auth/auth.service.ts](server/src/auth/auth.service.ts) - Enabled password hashing and verification

## 🚨 Important Notes

### For Production Use:
1. **Change JWT Secret**: Update `JWT_SECRET` in Render environment variables
2. **Set Strong Passwords**: All user accounts must have secure passwords
3. **Database Backups**: Configure automatic backups in Render dashboard
4. **Monitor Logs**: Check Render logs regularly for errors
5. **HTTPS Only**: All production traffic uses HTTPS

### Security Checklist:
- ✅ JWT authentication enabled
- ✅ Password hashing with bcrypt
- ✅ CORS properly configured
- ✅ Seed endpoint protected
- ✅ No hardcoded credentials
- ✅ Environment variables secured

## 📊 Database Schema

Key models:
- **Tenant**: Multi-tenant organization
- **User**: System users with password authentication
- **Role**: User roles (Admin, User, etc.)
- **Product**: Inventory items
- **Order**: Purchase/production orders
- **Sale**: Sales transactions
- **Customer**: Customer records

See [server/prisma/schema.prisma](server/prisma/schema.prisma) for full schema.

## 🐛 Troubleshooting

### "Invalid credentials" error
- Ensure password is correct
- Check user exists in database
- Verify JWT secret matches between frontend/backend

### "Unauthorized" on API calls
- Token may be expired (refresh token)
- Check Authorization header format: `Bearer <token>`

### Database connection issues
- Verify DATABASE_URL is correct
- Check Render PostgreSQL is running
- Ensure migrations are applied

## 📞 Support

For issues or questions about this production deployment:
1. Check Render logs: https://dashboard.render.com
2. Check Vercel logs: https://vercel.com/dashboard
3. Review API error responses for specific error codes

---

**System Status**: ✅ Production Ready  
**Last Updated**: February 17, 2026  
**Version**: 1.0.0
