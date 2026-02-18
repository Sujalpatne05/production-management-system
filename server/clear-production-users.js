// Clear Users from PRODUCTION Database on Render
// This connects to the Render PostgreSQL database and deletes all users

const { PrismaClient } = require('@prisma/client');

// Use production database URL from environment or command line
const DATABASE_URL = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: No database URL provided');
  console.error('Usage: PRODUCTION_DATABASE_URL="your-render-db-url" node clear-production-users.js');
  console.error('');
  console.error('Get your database URL from Render:');
  console.error('1. Go to https://dashboard.render.com/');
  console.error('2. Click on your PostgreSQL database');
  console.error('3. Copy the "External Database URL"');
  console.error('4. Run: PRODUCTION_DATABASE_URL="postgresql://..." node clear-production-users.js');
  process.exit(1);
}

console.log('🔗 Connecting to production database...');
console.log('   URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Hide password

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function clearProductionUsers() {
  try {
    console.log('📊 Checking production database...');
    
    // Count users before deletion
    const beforeCount = await prisma.user.count();
    console.log(`   Found ${beforeCount} users in production database`);
    
    if (beforeCount === 0) {
      console.log('✅ Production database is already clean - no users to delete');
      return;
    }
    
    // Ask for confirmation (in production, be careful!)
    console.log('');
    console.log('⚠️  WARNING: You are about to delete ALL users from PRODUCTION!');
    console.log(`   This will delete ${beforeCount} user(s)`);
    console.log('');
    
    // Delete all users
    console.log('🗑️  Deleting all users...');
    const result = await prisma.user.deleteMany({});
    console.log(`✅ Successfully deleted ${result.count} users from PRODUCTION`);
    
    // Verify deletion
    const afterCount = await prisma.user.count();
    console.log(`📊 Remaining users: ${afterCount}`);
    
    if (afterCount === 0) {
      console.log('🎉 Production database is now clean and ready for new registrations!');
    } else {
      console.log('⚠️  Warning: Some users still remain in the database');
    }
    
  } catch (error) {
    console.error('❌ Error clearing production users:', error);
    console.error('Error details:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('');
      console.error('💡 Tips:');
      console.error('   - Check your database URL is correct');
      console.error('   - Ensure the database URL includes username and password');
      console.error('   - Try copying the URL again from Render dashboard');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
clearProductionUsers();
