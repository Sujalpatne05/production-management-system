// Clear All User Registrations Script
// Run with: node clear-users.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearAllUsers() {
  try {
    console.log('🗑️  Starting to clear all user registrations...');
    
    // Count users before deletion
    const beforeCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${beforeCount}`);
    
    if (beforeCount === 0) {
      console.log('✅ Database is already clean - no users to delete');
      return;
    }
    
    // Delete all users
    const result = await prisma.user.deleteMany({});
    console.log(`✅ Successfully deleted ${result.count} users`);
    
    // Verify deletion
    const afterCount = await prisma.user.count();
    console.log(`📊 Remaining users: ${afterCount}`);
    
    console.log('🎉 Database is now clean and ready for new registrations!');
    
  } catch (error) {
    console.error('❌ Error clearing users:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
clearAllUsers();
