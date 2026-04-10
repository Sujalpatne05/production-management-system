#!/bin/bash

# 🚀 Quick Start Script for Prisma + Neon DB Setup
# Run this after updating .env with your Neon connection string

echo "🚀 Starting Prisma + Neon DB Setup..."
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
cd backend
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi
echo "✅ Prisma Client generated"
echo ""

# Step 2: Run Migrations
echo "🗄️  Step 2: Running database migrations..."
npm run prisma:migrate
if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi
echo "✅ Migrations completed"
echo ""

# Step 3: Seed Database
echo "🌱 Step 3: Seeding database..."
npm run prisma:seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✅ Database seeded"
echo ""

# Step 4: Start Server
echo "🚀 Step 4: Starting backend server..."
echo ""
echo "Backend will start on http://localhost:5000"
echo "API endpoints: http://localhost:5000/api"
echo ""
echo "Default login credentials:"
echo "  Username: admin"
echo "  Password: password"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev:prisma
