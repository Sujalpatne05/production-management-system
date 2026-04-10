@echo off
REM 🚀 Quick Start Script for Prisma + Neon DB Setup (Windows)
REM Run this after updating .env with your Neon connection string

echo.
echo 🚀 Starting Prisma + Neon DB Setup...
echo.

REM Step 1: Generate Prisma Client
echo 📦 Step 1: Generating Prisma Client...
cd backend
call npm run prisma:generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)
echo ✅ Prisma Client generated
echo.

REM Step 2: Run Migrations
echo 🗄️  Step 2: Running database migrations...
call npm run prisma:migrate
if errorlevel 1 (
    echo ❌ Failed to run migrations
    exit /b 1
)
echo ✅ Migrations completed
echo.

REM Step 3: Seed Database
echo 🌱 Step 3: Seeding database...
call npm run prisma:seed
if errorlevel 1 (
    echo ❌ Failed to seed database
    exit /b 1
)
echo ✅ Database seeded
echo.

REM Step 4: Start Server
echo 🚀 Step 4: Starting backend server...
echo.
echo Backend will start on http://localhost:5000
echo API endpoints: http://localhost:5000/api
echo.
echo Default login credentials:
echo   Username: admin
echo   Password: password
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev:prisma
