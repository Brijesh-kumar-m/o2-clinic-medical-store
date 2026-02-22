-- GRANT ADMIN ACCESS
-- Run this script in the Supabase SQL Editor to make yourself an admin.

-- 1. Update the role for your specific email
UPDATE profiles
SET role = 'admin'
WHERE email = 'brijeshmaurya8858@gmail.com';

-- 2. Verify the update
SELECT email, role, first_name FROM profiles WHERE email = 'brijeshmaurya8858@gmail.com';
