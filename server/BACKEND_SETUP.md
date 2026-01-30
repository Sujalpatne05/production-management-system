# Production Management System - Backend Setup Guide

## Current Status

### ✅ Completed
1. **Environment Setup** - .env file with database and JWT configuration
2. **Authentication System** - Login, register, JWT refresh endpoints
3. **Users Module** - Full CRUD with role assignment
4. **Tenants Module** - Multi-tenant organization management  
5. **Roles & Permissions Module** - RBAC system with role-permission assignment
6. **Orders Module** - Order management with tenant isolation
7. **Database Schema** - Prisma schema with multi-tenancy support
8. **Database Seed** - Demo data with roles, permissions, tenant, and user
9. **CORS Configuration** - Enabled for frontend communication
10. **Docker Compose** - PostgreSQL and Redis services

### 📋 Remaining Modules to Implement

Based on the frontend application, these modules still need to be created:

1. **Products Module** - Product catalog, categories, inventory
2. **Productions Module** - Production tracking, stages, losses, forecasting
3. **Customers & Suppliers Module** - Party management
4. **Sales Module** - Sales transactions and invoices
5. **Purchases Module** - Purchase orders and invoices
6. **Raw Materials Module** - Raw material inventory and categories
7. **Stock Module** - Stock tracking for products and raw materials
8. **Quotations Module** - Quotation management
9. **Expenses Module** - Expense tracking with categories
10. **Payments Module** - Supplier payments and customer receives
11. **Accounting Module** - Accounts, transactions, trial balance, balance sheet
12. **Wastes Module** - Raw material and product waste tracking
13. **Reports Module** - Sales, purchase, production, profit/loss reports
14. **Settings Module** - Units, currencies, production stages, company profile
15. **Factories/Outlets Module** - Factory/outlet management

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Installation Steps

1. **Start Database Services**
```bash
cd server
docker-compose up -d
```

2. **Install Dependencies** (if not done)
```bash
npm install
```

3. **Run Database Migrations**
```bash
npx prisma migrate dev --name init
```

4. **Seed Database**
```bash
npx prisma db seed
```

5. **Start Development Server**
```bash
npm run start:dev
```

Server will run on: `http://localhost:3000`
API endpoints at: `http://localhost:3000/api`

### Demo Credentials
```json
{
  "email": "admin@demo.com",
  "password": "any-password"
}
```
*Note: Password validation is not implemented yet for demo purposes*

## API Endpoints (Implemented)

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login  
- `POST /api/auth/refresh` - Refresh token

### Users (Admin/Manager only)
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/assign-roles` - Assign roles

### Tenants (Admin only)
- `GET /api/tenants` - List tenants
- `GET /api/tenants/:id` - Get tenant
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Roles (Admin only)
- `GET /api/roles` - List roles
- `GET /api/roles/:id` - Get role
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role
- `POST /api/roles/assign-permissions` - Assign permissions

### Permissions (Admin only)
- `GET /api/permissions` - List permissions
- `GET /api/permissions/:id` - Get permission
- `POST /api/permissions` - Create permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

### Orders (Authenticated)
- `GET /api/orders?tenantId=xxx` - List orders
- `GET /api/orders/:id` - Get order
- `GET /api/orders/stats/:tenantId` - Get statistics
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Next Steps

To complete the backend implementation:

1. **Extend Database Schema** - Add tables for products, productions, customers, suppliers, sales, purchases, etc.
2. **Create Remaining Modules** - Implement services, controllers, and DTOs for each module
3. **Add Business Logic** - Implement production forecasting, stock calculations, financial reporting
4. **File Uploads** - Add support for product images, documents
5. **Real-time Updates** - Implement WebSockets for live production tracking
6. **API Documentation** - Add Swagger/OpenAPI documentation
7. **Testing** - Unit and e2e tests
8. **Security** - Password hashing, rate limiting, input sanitization
9. **Logging** - Structured logging and monitoring
10. **Performance** - Query optimization, caching strategies

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6
- **Authentication**: JWT with Passport
- **Caching**: Redis 7
- **Queue**: BullMQ
- **Validation**: class-validator
- **Language**: TypeScript

## Docker Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

## Database Tools

```bash
# Prisma Studio (GUI)
npx prisma studio

# View migrations
npx prisma migrate status

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seed file
├── src/
│   ├── auth/             # ✅ Authentication module
│   ├── users/            # ✅ Users module
│   ├── tenants/          # ✅ Tenants module
│   ├── roles/            # ✅ Roles & Permissions
│   ├── orders/           # ✅ Orders module
│   ├── prisma/           # ✅ Prisma service
│   ├── app.module.ts     # Main app module
│   └── main.ts           # App entry point
├── .env                  # Environment variables
├── docker-compose.yml    # Docker services
└── package.json          # Dependencies
```

## Support

For issues or questions:
1. Check if Docker services are running: `docker ps`
2. View logs: `docker-compose logs`
3. Verify database connection in `.env`
4. Ensure migrations are run: `npx prisma migrate status`
