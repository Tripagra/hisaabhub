# RLS Policy Testing Guide

This guide explains how to test the Row Level Security (RLS) policies for the HisaabHub platform after applying migration `002_update_rls_policies_admin_role.sql`.

## Prerequisites

Before testing, ensure you have:

1. Applied migration `001_add_user_roles.sql` (adds role column to users table)
2. Applied migration `002_update_rls_policies_admin_role.sql` (updates RLS policies)
3. At least two test users in Supabase Auth:
   - One admin user (role='admin')
   - One regular user (role='user')

## Setup Test Users

### Step 1: Create Users in Supabase Auth

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" and create:
   - Admin user: `admin@test.com` (or your preferred email)
   - Regular user: `user@test.com` (or your preferred email)

### Step 2: Set User Roles

Run these SQL commands in Supabase SQL Editor:

```sql
-- Set admin role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@test.com';

-- Set regular user role (should already be 'user' by default)
UPDATE public.users 
SET role = 'user' 
WHERE email = 'user@test.com';

-- Verify roles
SELECT id, email, role FROM public.users;
```

## Testing Methodology

The RLS policies are tested by attempting operations as different users. Supabase uses the authenticated user's JWT token to enforce RLS policies.

### Testing in Supabase SQL Editor

The Supabase SQL Editor runs queries as the service role by default, which bypasses RLS. To test RLS properly, you need to:

1. Use the Supabase client library in your application
2. Authenticate as different users
3. Attempt operations and verify results

### Testing via Application Code

Create a test script or use your application's API endpoints to test:

```typescript
// Example test with Supabase client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test as admin user
async function testAsAdmin() {
  // Sign in as admin
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'admin-password'
  });

  // Try to insert article (should succeed)
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug: 'test-admin-article',
      keyword: 'Test',
      summary: 'Test article by admin'
    });

  console.log('Admin insert:', { data, error });
}

// Test as regular user
async function testAsUser() {
  // Sign in as regular user
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'user@test.com',
    password: 'user-password'
  });

  // Try to insert article (should fail)
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug: 'test-user-article',
      keyword: 'Test',
      summary: 'Test article by user'
    });

  console.log('User insert:', { data, error });
  // Expected: error with message about RLS policy violation
}
```

## Test Cases

### Articles Table Tests

| Test | User Role | Operation | Expected Result |
|------|-----------|-----------|-----------------|
| 1 | Admin | SELECT all articles | Success - returns all articles |
| 2 | User | SELECT all articles | Success - returns only published articles |
| 3 | Anonymous | SELECT all articles | Success - returns only published articles |
| 4 | Admin | INSERT article | Success |
| 5 | User | INSERT article | Fail - RLS policy violation |
| 6 | Anonymous | INSERT article | Fail - RLS policy violation |
| 7 | Admin | UPDATE article | Success |
| 8 | User | UPDATE article | Fail - RLS policy violation |
| 9 | Admin | DELETE article | Success |
| 10 | User | DELETE article | Fail - RLS policy violation |

### Questions Table Tests

| Test | User Role | Operation | Expected Result |
|------|-----------|-----------|-----------------|
| 11 | Admin | SELECT all questions | Success - returns all questions |
| 12 | User | SELECT questions | Success - returns questions for published articles only |
| 13 | Admin | INSERT question | Success |
| 14 | User | INSERT question | Fail - RLS policy violation |
| 15 | Admin | UPDATE question | Success |
| 16 | User | UPDATE question | Fail - RLS policy violation |
| 17 | Admin | DELETE question | Success |
| 18 | User | DELETE question | Fail - RLS policy violation |

## Verification Queries

Run these queries in Supabase SQL Editor to verify the policies are correctly configured:

```sql
-- 1. Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('articles', 'questions');
-- Expected: rowsecurity = true for both tables

-- 2. List all policies on articles table
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'articles';
-- Expected: Should see policies for SELECT, INSERT, UPDATE, DELETE

-- 3. List all policies on questions table
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'questions';
-- Expected: Should see policies for SELECT, INSERT, UPDATE, DELETE

-- 4. Verify user roles
SELECT id, email, role
FROM public.users
ORDER BY role DESC;
-- Expected: Should see users with 'admin' and 'user' roles
```

## Expected Policy Behavior

### Articles Policies

1. **Public can view published articles**: Anyone can SELECT articles where `published = true`
2. **Admins can view all articles**: Users with `role = 'admin'` can SELECT all articles
3. **Admins can insert articles**: Only users with `role = 'admin'` can INSERT
4. **Admins can update articles**: Only users with `role = 'admin'` can UPDATE
5. **Admins can delete articles**: Only users with `role = 'admin'` can DELETE

### Questions Policies

1. **Public can view questions for published articles**: Anyone can SELECT questions for published articles
2. **Admins can view all questions**: Users with `role = 'admin'` can SELECT all questions
3. **Admins can insert questions**: Only users with `role = 'admin'` can INSERT
4. **Admins can update questions**: Only users with `role = 'admin'` can UPDATE
5. **Admins can delete questions**: Only users with `role = 'admin'` can DELETE

## Troubleshooting

### Issue: All operations succeed even for non-admin users

**Cause**: You might be using the service role key instead of the anon key.

**Solution**: Ensure you're using `SUPABASE_ANON_KEY` in your client, not `SUPABASE_SERVICE_ROLE_KEY`.

### Issue: Admin operations fail

**Cause**: The user might not have `role = 'admin'` in the users table.

**Solution**: Verify the user's role:
```sql
SELECT id, email, role FROM public.users WHERE email = 'admin@test.com';
```

If the role is not 'admin', update it:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@test.com';
```

### Issue: User not found in users table

**Cause**: The user exists in Supabase Auth but not in the public.users table.

**Solution**: Insert the user into the users table:
```sql
INSERT INTO public.users (id, email, name, role)
VALUES (
  'user-uuid-from-auth',
  'admin@test.com',
  'Admin User',
  'admin'
);
```

## Automated Testing

For automated testing, create a test suite using your preferred testing framework:

```typescript
// Example with Jest/Vitest
describe('RLS Policies', () => {
  describe('Articles - Admin User', () => {
    beforeEach(async () => {
      await supabase.auth.signInWithPassword({
        email: 'admin@test.com',
        password: 'admin-password'
      });
    });

    it('should allow admin to insert articles', async () => {
      const { data, error } = await supabase
        .from('articles')
        .insert({ slug: 'test', keyword: 'Test', summary: 'Test' });
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    // Add more tests...
  });

  describe('Articles - Regular User', () => {
    beforeEach(async () => {
      await supabase.auth.signInWithPassword({
        email: 'user@test.com',
        password: 'user-password'
      });
    });

    it('should prevent regular user from inserting articles', async () => {
      const { data, error } = await supabase
        .from('articles')
        .insert({ slug: 'test', keyword: 'Test', summary: 'Test' });
      
      expect(error).toBeDefined();
      expect(error.message).toContain('policy');
    });

    // Add more tests...
  });
});
```

## Conclusion

After running all tests, you should verify that:

1. ✅ Admin users can perform all CRUD operations on articles and questions
2. ✅ Regular users can only view published articles and their questions
3. ✅ Regular users cannot insert, update, or delete articles or questions
4. ✅ Anonymous users can only view published articles and their questions
5. ✅ All RLS policies are properly enforced

If all tests pass, the RLS policies are correctly configured and the migration was successful.
