-- =====================================================
-- RLS Policy Testing Script
-- =====================================================
-- This script tests the RLS policies for articles and questions
-- Run this after applying the migration 002_update_rls_policies_admin_role.sql
--
-- IMPORTANT: This is a manual testing script to be run in Supabase SQL Editor
-- You need to have:
-- 1. At least one admin user with role='admin' in the users table
-- 2. At least one regular user with role='user' in the users table
-- 3. Some test articles and questions in the database
--
-- Instructions:
-- 1. Apply the migration first: 002_update_rls_policies_admin_role.sql
-- 2. Create test users if they don't exist
-- 3. Run each test section below and verify the results
-- =====================================================

-- =====================================================
-- SETUP: Create test users (if they don't exist)
-- =====================================================

-- Note: You need to create these users in Supabase Auth first
-- Then run these queries to set their roles

-- Example: Set admin role for a user
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@test.com';

-- Example: Set regular user role
-- UPDATE public.users SET role = 'user' WHERE email = 'user@test.com';

-- =====================================================
-- TEST 1: Verify admin user can view all articles
-- =====================================================

-- Expected: Should return all articles (published and unpublished)
-- Run this query while authenticated as admin user
-- SELECT * FROM public.articles;

-- =====================================================
-- TEST 2: Verify regular user can only view published articles
-- =====================================================

-- Expected: Should only return published articles
-- Run this query while authenticated as regular user
-- SELECT * FROM public.articles;

-- =====================================================
-- TEST 3: Verify admin user can insert articles
-- =====================================================

-- Expected: Should succeed
-- Run this query while authenticated as admin user
/*
INSERT INTO public.articles (slug, keyword, summary, published)
VALUES ('test-article-admin', 'Test Article', 'This is a test article created by admin', true)
RETURNING *;
*/

-- =====================================================
-- TEST 4: Verify regular user CANNOT insert articles
-- =====================================================

-- Expected: Should fail with permission denied error
-- Run this query while authenticated as regular user
/*
INSERT INTO public.articles (slug, keyword, summary, published)
VALUES ('test-article-user', 'Test Article', 'This should fail', true)
RETURNING *;
*/

-- =====================================================
-- TEST 5: Verify admin user can update articles
-- =====================================================

-- Expected: Should succeed
-- Run this query while authenticated as admin user
/*
UPDATE public.articles
SET summary = 'Updated summary by admin'
WHERE slug = 'test-article-admin'
RETURNING *;
*/

-- =====================================================
-- TEST 6: Verify regular user CANNOT update articles
-- =====================================================

-- Expected: Should fail with permission denied error
-- Run this query while authenticated as regular user
/*
UPDATE public.articles
SET summary = 'This should fail'
WHERE slug = 'test-article-admin'
RETURNING *;
*/

-- =====================================================
-- TEST 7: Verify admin user can delete articles
-- =====================================================

-- Expected: Should succeed
-- Run this query while authenticated as admin user
/*
DELETE FROM public.articles
WHERE slug = 'test-article-admin'
RETURNING *;
*/

-- =====================================================
-- TEST 8: Verify regular user CANNOT delete articles
-- =====================================================

-- Expected: Should fail with permission denied error
-- Run this query while authenticated as regular user
/*
DELETE FROM public.articles
WHERE slug = 'test-article-admin'
RETURNING *;
*/

-- =====================================================
-- TEST 9: Verify admin user can insert questions
-- =====================================================

-- Expected: Should succeed
-- Run this query while authenticated as admin user
/*
INSERT INTO public.questions (article_id, question_text, answer_text, position)
VALUES (
    (SELECT id FROM public.articles LIMIT 1),
    'Test question by admin?',
    'This is a test answer by admin',
    999
)
RETURNING *;
*/

-- =====================================================
-- TEST 10: Verify regular user CANNOT insert questions
-- =====================================================

-- Expected: Should fail with permission denied error
-- Run this query while authenticated as regular user
/*
INSERT INTO public.questions (article_id, question_text, answer_text, position)
VALUES (
    (SELECT id FROM public.articles LIMIT 1),
    'Test question by user?',
    'This should fail',
    999
)
RETURNING *;
*/

-- =====================================================
-- TEST 11: Verify admin user can update questions
-- =====================================================

-- Expected: Should succeed
-- Run this query while authenticated as admin user
/*
UPDATE public.questions
SET answer_text = 'Updated answer by admin'
WHERE position = 999
RETURNING *;
*/

-- =====================================================
-- TEST 12: Verify regular user CANNOT update questions
-- =====================================================

-- Expected: Should fail with permission denied error
-- Run this query while authenticated as regular user
/*
UPDATE public.questions
SET answer_text = 'This should fail'
WHERE position = 999
RETURNING *;
*/

-- =====================================================
-- TEST 13: Verify admin user can delete questions
-- =====================================================

-- Expected: Should succeed
-- Run this query while authenticated as admin user
/*
DELETE FROM public.questions
WHERE position = 999
RETURNING *;
*/

-- =====================================================
-- TEST 14: Verify regular user CANNOT delete questions
-- =====================================================

-- Expected: Should fail with permission denied error
-- Run this query while authenticated as regular user
/*
DELETE FROM public.questions
WHERE position = 999
RETURNING *;
*/

-- =====================================================
-- CLEANUP: Remove test data
-- =====================================================

-- Run these queries to clean up test data after testing
/*
DELETE FROM public.articles WHERE slug LIKE 'test-article-%';
DELETE FROM public.questions WHERE position = 999;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('articles', 'questions');

-- List all policies on articles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'articles';

-- List all policies on questions table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'questions';

-- Check users and their roles
SELECT id, email, role, created_at
FROM public.users
ORDER BY role DESC, created_at DESC;
