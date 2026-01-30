# Docker & Database Setup Guide

## Current Status
❌ Docker Desktop is not installed or not running on your system

## Option 1: Install Docker Desktop (Recommended)

### Windows Installation Steps

1. **Download Docker Desktop**
   - Visit: https://www.docker.com/products/docker-desktop
   - Download for Windows

2. **Install Docker Desktop**
   - Run the installer
   - Accept license agreement
   - Choose installation type (WSL 2 recommended for Windows)
   - Restart your computer when prompted

3. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Start Services**
   ```bash
   cd C:\Users\sujal\Desktop\Production Management\server
   docker-compose up -d
   ```

5. **Verify Services Running**
   ```bash
   docker-compose ps
   ```

Expected output:
```
NAME                COMMAND                  SERVICE             STATUS
postgres-db         "docker-entrypoint.s…"   postgres            Up X seconds
redis-cache         "redis-server --appe…"   redis               Up X seconds
```

---

## Option 2: Use PostgreSQL Directly (No Docker)

If you prefer not to use Docker, install PostgreSQL locally:

### Windows Installation
1. Download PostgreSQL 16: https://www.postgresql.org/download/
2. Run installer with these settings:
   - Port: 5432 (default)
   - Password: "password" (match your .env file)
   - Superuser: "postgres"

3. Create database:
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE production_management;
   \q
   ```

4. Update `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/production_management"
   ```

---

## Option 3: Quick Start with Docker Desktop Running

Once Docker Desktop is installed and running:

### Step 1: Start Services
```bash
cd server
docker-compose up -d
```

### Step 2: Wait for Database Ready
```bash
# Check if containers are running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres
```

### Step 3: Run Migrations
```bash
npx prisma migrate dev --name initial_schema
```

Expected output:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "production_management", schema "public" at "localhost:5432"

✔ Enter a name for the new migration: … initial_schema
✔ Created ./prisma/migrations/20231201000000_initial_schema/migration.sql
✔ Sent to database
✔ Generated Prisma Client

✔ Your database is now in sync with your Prisma schema
```

### Step 4: Seed Database with Demo Data
```bash
npx prisma db seed
```

Expected output:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

Running seed command `node prisma/seed.ts` ...
✅ Roles created
✅ Permissions created
✅ Role permissions assigned
✅ Demo tenant created
✅ Demo user created
✅ Admin role assigned to demo user
✅ Default currency created
✅ Production stages created
✅ Product categories created
✅ Products created
✅ Raw material categories created
✅ Raw materials created
✅ Product stocks created
✅ Raw material stocks created
✅ Customers created
✅ Suppliers created
✅ Factory created
✅ Expense categories created
✅ Chart of accounts created
✅ Seeding complete!
```

### Step 5: View Database in Prisma Studio
```bash
npx prisma studio
# Opens http://localhost:5555 in browser
```

### Step 6: Start Backend Server
```bash
npm run start:dev
# Server runs on http://localhost:3000
```

Test the API:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'

# Response includes JWT token
```

---

## Troubleshooting

### Error: "Can't reach database server at localhost:5432"
- Docker containers not running: Run `docker-compose up -d`
- PostgreSQL not started yet: Wait 10-15 seconds for container to initialize
- Wrong port: Check .env DATABASE_URL is correct

### Error: "ECONNREFUSED 127.0.0.1:5432"
- Database service crashed: Check logs with `docker-compose logs postgres`
- Port 5432 already in use: Change port in docker-compose.yml and .env

### Error: "unknown shorthand flag: 'd'" on Windows
- Update Docker: `docker --version` should be 20.10+
- Use long form: `docker-compose --detach` instead of `-d`

### Containers won't start
```bash
# Check Docker service status
docker ps

# Check container logs
docker-compose logs

# Remove and restart
docker-compose down
docker-compose up -d
```

---

## Database Connection String

Your `.env` file should have:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/production_management"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
REDIS_URL="redis://localhost:6379"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

---

## Next Steps After Setup

1. ✅ Install Docker Desktop
2. ✅ Start containers: `docker-compose up -d`
3. ✅ Run migrations: `npx prisma migrate dev --name initial_schema`
4. ✅ Seed database: `npx prisma db seed`
5. ✅ Start backend: `npm run start:dev`
6. ✅ Frontend already running: `npm run dev` (from root directory)
7. ✅ Login to app: http://localhost:5173

### Test Credentials
```
Email: admin@demo.com
Password: (set during user creation, default might be empty)
```

---

## Docker Commands Reference

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View running containers
docker-compose ps

# Check logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Execute command in container
docker-compose exec postgres psql -U postgres -d production_management

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild images
docker-compose build

# Restart services
docker-compose restart
```

---

## Database Info

**PostgreSQL**
- Host: localhost
- Port: 5432
- Database: production_management
- User: postgres
- Password: password

**Redis**
- Host: localhost
- Port: 6379
- No password (default)

**Adminer (optional database GUI)**
- Access at: http://localhost:8080 (if added to docker-compose.yml)
- Server: postgres
- Username: postgres
- Password: password
- Database: production_management
