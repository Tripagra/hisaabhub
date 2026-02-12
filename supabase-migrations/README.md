# Database Migrations

This directory contains SQL migration files for the HisaabHub platform.

## Migration Files

### 001_add_user_roles.sql
- **Date**: 2026-02-12
- **Description**: Adds role column to users table for role-based access control
- **Changes**:
  - Adds `role` column with default value 'user'
  - Adds check constraint for valid roles ('user', 'admin')
  - Creates indexes for efficient role-based queries
  - Updates existing users to have 'user' role

### 002_update_rls_policies_admin_role.sql
- **Date**: 2026-02-12
- **Description**: Updates RLS policies to use role-based authentication instead of hardcoded email checks
- **Changes**:
  - Drops existing hardcoded email-based policies
  - Creates new role-based policies for articles table
  - Creates new role-based policies for questions table
  - Policies check `users.role = 'admin'` instead of specific email

### 002_test_rls_policies.sql
- **Date**: 2026-02-12
- **Description**: Manual testing script for RLS policies
- **Usage**: Run in Supabase SQL Editor to manually verify RLS policies

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of the migration file
4. Paste into the SQL Editor
5. Click "Run" to execute

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migration
supabase db push
```

### Option 3: Manual Execution

```bash
# Using psql
psql -h your-db-host -U postgres -d postgres -f supabase-migrations/001_add_user_roles.sql
psql -h your-db-host -U postgres -d postgres -f supabase-migrations/002_update_rls_policies_admin_role.sql
```

## Migration Order

**IMPORTANT**: Migrations must be applied in order:

1. `001_add_user_roles.sql` - Must be applied first
2. `002_update_rls_policies_admin_role.sql` - Depends on migration 001

## Testing Migrations

After applying migrations, test the RLS policies:

### Automated Testing

1. Copy `.env.test.example` to `.env.test`
2. Fill in test user credentials
3. Create test users in Supabase Auth
4. Set user roles in database:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'admin@test.com';
   UPDATE public.users SET role = 'user' WHERE email = 'user@test.com';
   ```
5. Run tests:
   ```bash
   npm run test src/test/rls-policies.test.ts
   ```

### Manual Testing

Follow the guide in `RLS_TESTING_GUIDE.md` for detailed manual testing instructions.

## Rollback

If you need to rollback a migration:

### Rollback 002_update_rls_policies_admin_role.sql

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

-- Recreate old policies (hardcoded email)
CREATE POLICY "Admins can view all articles"
    ON public.articles FOR SELECT
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

CREATE POLICY "Admins can insert articles"
    ON public.articles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

CREATE POLICY "Admins can update articles"
    ON public.articles FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

CREATE POLICY "Admins can delete articles"
    ON public.articles FOR DELETE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Repeat for questions table...
```

### Rollback 001_add_user_roles.sql

```sql
-- Drop indexes
DROP INDEX IF EXISTS idx_users_admin_role;
DROP INDEX IF EXISTS idx_users_role;

-- Drop constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Drop column
ALTER TABLE public.users DROP COLUMN IF EXISTS role;
```

## Verification

After applying migrations, verify they were successful:

```sql
-- Check if role column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'role';

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('articles', 'questions')
ORDER BY tablename, policyname;

-- Check user roles
SELECT id, email, role
FROM public.users
ORDER BY role DESC;
```

## Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution**: The migration has already been applied. Check if the changes are already in place.

### Issue: RLS policies not working

**Solution**: 
1. Verify RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
2. Check user roles: `SELECT email, role FROM public.users;`
3. Verify you're using the anon key, not service role key

### Issue: Admin user cannot perform operations

**Solution**: Ensure the user has `role = 'admin'` in the users table:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

## Support

For issues or questions:
1. Check the `RLS_TESTING_GUIDE.md` for detailed testing instructions
2. Review the migration SQL files for implementation details
3. Consult the main project documentation in the root README.md
