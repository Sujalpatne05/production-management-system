# PostgreSQL Setup Guide

## 🚀 Quick Setup for Windows

### Step 1: Install PostgreSQL

**Download PostgreSQL:**
1. Visit: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 16.x installer
3. Run installer and follow these settings:
   - Installation Directory: Default (C:\Program Files\PostgreSQL\16)
   - Port: 5432 (default)
   - Superuser Password: **Choose a strong password** (remember this!)
   - Locale: Default

### Step 2: Verify Installation

Open PowerShell and test:
```powershell
psql --version
```

If command not found, add to PATH:
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
```

### Step 3: Create Database

Open PowerShell as Administrator:

```powershell
# Connect to PostgreSQL (enter password when prompted)
psql -U postgres

# Inside PostgreSQL prompt:
CREATE DATABASE production_management;

# List databases to verify
\l

# Exit
\q
```

### Step 4: Run Schema Script

```powershell
cd backend

# Run the schema file
psql -U postgres -d production_management -f db-schema.sql
```

Expected output:
```
CREATE TABLE
CREATE TABLE
...
CREATE INDEX
```

### Step 5: Configure Environment

1. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

2. Edit `.env` file and set your password:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=production_management
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD
JWT_SECRET=your-secret-key-123456
```

### Step 6: Test Connection

```powershell
# Install dependencies (if not already done)
npm install

# Start PostgreSQL backend
npm start
```

Expected output:
```
🚀 Backend Server Running at: http://localhost:5000
   ✅ Environment: development
   🐘 Database: PostgreSQL
   ✅ Connected to PostgreSQL database: production_management
```

## 🧪 Verify Everything Works

Test the health endpoint:
```powershell
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "PostgreSQL",
  "connected": true
}
```

## 🔧 Troubleshooting

### PostgreSQL service not running?
```powershell
# Start PostgreSQL service
Start-Service postgresql-x64-16
```

### Connection refused error?
- Check PostgreSQL is running: `Get-Service postgresql-x64-16`
- Verify port 5432 is open: `netstat -an | Select-String "5432"`
- Check credentials in `.env` file

### Schema errors?
```powershell
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS production_management;"
psql -U postgres -c "CREATE DATABASE production_management;"
psql -U postgres -d production_management -f db-schema.sql
```

## 📊 Database Management

### View tables:
```powershell
psql -U postgres -d production_management -c "\dt"
```

### Check data:
```powershell
psql -U postgres -d production_management -c "SELECT * FROM users;"
```

### Backup database:
```powershell
pg_dump -U postgres production_management > backup.sql
```

### Restore database:
```powershell
psql -U postgres production_management < backup.sql
```

## 🎯 Next Steps

1. ✅ PostgreSQL installed
2. ✅ Database created
3. ✅ Schema loaded
4. ✅ Server running
5. ➡️ Start your frontend and test the full stack!

## 🔄 Switching Between JSON and PostgreSQL

**Use PostgreSQL (default):**
```powershell
npm start
```

**Use JSON files:**
```powershell
npm run start:json
```

Your frontend will work with either backend!
