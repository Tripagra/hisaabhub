-- Migration: Create Admin User
-- Task: 1.4 Create admin user
-- Date: February 12, 2026
-- Description: SQL helper script for creating and verifying admin user

-- ============================================================================
-- STEP 1: Verify auth.users table has the admin user
-- ============================================================================
-- Run this query to check if the user exists in auth.users
-- Replace 'admin@hisaabhub.com' with your actual admin email

SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users
WHERE email = 'sahilucifer97@gmail.com';  -- Replace with your admin email

-- Expected: Should return 1 row with user details
-- If no rows: User hasn't been created in Supabase Auth dashboard yet


-- ============================================================================
-- STEP 2: Create or update user in public.users table with admin role
-- ============================================================================
-- This will insert the user if they don't exist, or update their role if they do

INSERT INTO public.users (id, email, name, role)
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'name',
        raw_user_meta_data->>'full_name',
        'Admin User'
    ) as name,
    'admin' as role
FROM auth.users
WHERE email = 'sahilucifer97@gmail.com'  -- Replace with your admin email
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- Expected: 1 row inserted or updated


-- ============================================================================
-- STEP 3: Verify the admin user in public.users table
-- ============================================================================

SELECT 
    id,
    email,
    name,
    role,
    created_at,
    updated_at
FROM public.users
WHERE email = 'sahilucifer97@gmail.com'  -- Replace with your admin email
AND role = 'admin';

-- Expected: Should return 1 row with role = 'admin'


-- ============================================================================
-- STEP 4: Verify admin can bypass RLS policies (optional check)
-- ============================================================================
-- This checks if there are any RLS policies that might block admin access

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('articles', 'questions', 'users')
ORDER BY tablename, policyname;

-- Review the output to ensure admin users have appropriate access


-- ============================================================================
-- STEP 5: List all admin users (for verification)
-- ============================================================================

SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.role = 'admin'
ORDER BY u.created_at DESC;

-- Expected: Should show all users with admin role


-- ============================================================================
-- OPTIONAL: Create additional admin users
-- ============================================================================
-- If you need to promote an existing user to admin:

-- UPDATE public.users 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'another-admin@hisaabhub.com';


-- ============================================================================
-- OPTIONAL: Demote admin user back to regular user
-- ============================================================================
-- If you need to remove admin privileges:

-- UPDATE public.users 
-- SET role = 'user', updated_at = NOW()
-- WHERE email = 'admin@hisaabhub.com';


-- ============================================================================
-- OPTIONAL: Delete admin user (use with caution!)
-- ============================================================================
-- This will delete the user from public.users
-- The auth.users record will remain (managed by Supabase Auth)

-- DELETE FROM public.users 
-- WHERE email = 'admin@hisaabhub.com';


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count total admin users
SELECT COUNT(*) as admin_count
FROM public.users
WHERE role = 'admin';

-- Count total regular users
SELECT COUNT(*) as user_count
FROM public.users
WHERE role = 'user';

-- Show role distribution
SELECT 
    role,
    COUNT(*) as count
FROM public.users
GROUP BY role
ORDER BY role;


-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Always create the user in Supabase Auth dashboard FIRST
-- 2. Then run the INSERT query to add them to public.users with admin role
-- 3. Test login and admin panel access after creation
-- 4. Document credentials securely (password manager)
-- 5. Never commit credentials to version control
-- 6. Use strong passwords (min 16 characters recommended)
-- 7. Enable 2FA if available
-- 8. Rotate passwords every 90 days
-- 9. Monitor admin activity through audit logs
-- 10. Limit admin access to trusted team members only

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If user can't access admin panel:
-- 1. Verify role is 'admin' in public.users
-- 2. Log out and log back in to refresh session
-- 3. Clear browser cookies
-- 4. Check middleware logs for errors
-- 5. Verify RLS policies aren't blocking access

-- If user not found in public.users:
-- 1. User hasn't logged in yet (profile not created)
-- 2. Run the INSERT query above to create the record
-- 3. Or have the user login first, then update their role

-- If "Access denied" errors:
-- 1. Check middleware code in src/middleware.ts
-- 2. Verify session is valid
-- 3. Check browser console for errors
-- 4. Review Supabase logs in dashboard
