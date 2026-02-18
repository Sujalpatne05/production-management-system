-- SQL Script to Delete User (For Testing Only)
-- Run this ONLY in development/staging, NOT in production with real users!

-- Option 1: Delete specific test user
DELETE FROM "User" WHERE email = 'sujalpatne05@gmail.com';

-- Option 2: Check if user exists first
SELECT id, email, "fullName", "createdAt" 
FROM "User" 
WHERE email = 'sujalpatne05@gmail.com';

-- Option 3: Delete all test users (be careful!)
-- DELETE FROM "User" WHERE email LIKE '%+test%@gmail.com';

-- Note: This will also delete related records due to CASCADE constraints:
-- - UserRole entries
-- - User's orders, sales, productions, etc.
