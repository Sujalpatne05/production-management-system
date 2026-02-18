-- Clear All User Registrations
-- WARNING: This will DELETE ALL users from the database!
-- Use with caution in production

-- Delete all users
DELETE FROM "User";

-- Verify deletion
SELECT COUNT(*) as remaining_users FROM "User";

-- Show result
SELECT 'All users deleted successfully!' as status;
