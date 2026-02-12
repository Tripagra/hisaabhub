# Quick Start: Apply RLS Policy Migration

This guide helps you quickly apply the RLS policy migration to your Supabase database.

## Prerequisites

- ✅ Migration 001 already applied (user roles added)
- ✅ Access to Supabase Dashboard
- ✅ At least one user account in Supabase Auth

## 3-Step Process

### Step 1: Apply Migration (2 minutes)

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `002_update_rls_policies_admin_role.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success" message

### Step 2: Set Admin Role (1 minute)

In the same SQL Editor, run:

```sql
-- Replace with your admin email
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin@email.com';

-- Verify it worked
SELECT id, email, role FROM public.users WHERE role = 'admin';
```

You should see your admin user with `role = 'admin'`.

### Step 3: Verify (1 minute)

Check that policies are active:

```sql
-- Should show 8 policies for articles
SELECT policyname FROM pg_policies 
WHERE tablename = 'articles';

-- Should show 8 policies for questions
SELECT policyname FROM pg_policies 
WHERE tablename = 'questions';
```

## Done! 🎉

Your RLS policies are now using role-based authentication.

## Test It

### Test Admin Access

1. Log in to your app as the admin user
2. Try to create/edit/delete an article
3. Should work ✅

### Test Regular User Access

1. Log in as a regular user (or create one)
2. Try to create an article
3. Should fail with permission error ✅

## Troubleshooting

### "User not found in users table"

Your user exists in Auth but not in the users table. Fix:

```sql
-- Get user ID from Auth
SELECT id, email FROM auth.users WHERE email = 'your-admin@email.com';

-- Insert into users table (replace UUID with actual ID)
INSERT INTO public.users (id, email, name, role)
VALUES (
  'user-uuid-from-above',
  'your-admin@email.com',
  'Admin Name',
  'admin'
);
```

### "Admin operations still fail"

Check the user's role:

```sql
SELECT id, email, role FROM public.users WHERE email = 'your-admin@email.com';
```

If role is not 'admin', update it:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### "Regular users can still create articles"

You might be using the service role key. Check your code:

```typescript
// ❌ Wrong - bypasses RLS
const supabase = createClient(url, SERVICE_ROLE_KEY);

// ✅ Correct - enforces RLS
const supabase = createClient(url, ANON_KEY);
```

## Need More Help?

See detailed documentation:
- `RLS_TESTING_GUIDE.md` - Comprehensive testing guide
- `README.md` - Full migration documentation
- `002_test_rls_policies.sql` - Manual test queries

## Rollback

If something goes wrong, rollback:

```sql
-- Drop new policies
DROP POLICY IF EXISTS "Admins can view all articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can view all questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

-- Recreate old policies
CREATE POLICY "Admins can update articles"
    ON public.articles FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');
-- (repeat for other policies)
```

---

**Total Time**: ~4 minutes  
**Difficulty**: Easy  
**Risk**: Low (can be rolled back)
