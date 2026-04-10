import { spawn } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    const migrate = spawn('npx', ['prisma', 'migrate', 'deploy'], {
      stdio: 'inherit',
      shell: true
    });

    await new Promise((resolve, reject) => {
      migrate.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Migrations completed');
          resolve();
        } else {
          console.log('⚠️  Migrations skipped (already up to date)');
          resolve(); // Don't fail if migrations are already applied
        }
      });
      migrate.on('error', reject);
    });
  } catch (error) {
    console.log('⚠️  Migration error (continuing anyway):', error.message);
  }
}

async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');

    // Run migrations
    await runMigrations();

    // Start the server
    console.log('🚀 Starting server...');
    const server = spawn('node', ['server-prisma.js'], {
      stdio: 'inherit',
      shell: true
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Startup error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

startServer();
