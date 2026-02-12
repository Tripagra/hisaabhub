# Admin User Setup Guide

**Feature**: HisaabHub Platform Improvements  
**Task**: 1.4 Create Admin User  
**Date**: February 12, 2026

---

## Overview

This guide walks you through creating an admin user for the HisaabHub platform. The admin user will have full access to the admin panel at `/admin/aeo` for managing articles and content.

---

## Prerequisites

- Access to Supabase Dashboard: https://supabase.com/dashboard
- Project URL: https://hpaguyquajofazmuytwd.supabase.co
- Admin email address (recommended: use a secure company email)

---

## Step 1: Create Admin User in Supabase Auth Dashboard

### 1.1 Navigate to Authentication

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **hpaguyquajofazmuytwd**
3. Click on **Authentication** in the left sidebar
4. Click on **Users** tab

### 1.2 Create New User

1. Click the **"Add user"** button (top right)
2. Select **"Create new user"**
3. Fill in the form:
   - **Email**: Enter the admin email (e.g., `admin@hisaabhub.com`)
   - **Password**: Generate a strong password (min 8 characters)
   - **Auto Confirm User**: ✅ Check this box (to skip email verification)
   
4. Click **"Create user"**

### 1.3 Save Credentials

**IMPORTANT**: Save these credentials securely!

```
Admin Email: [your-admin-email]
Admin Password: [your-secure-password]
User ID: [will be shown after creation]
```

**Recommended**: Store in a password manager (1Password, LastPass, etc.)

---

## Step 2: Update User Role to 'admin' in Database

### 2.1 Navigate to SQL Editor

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**

### 2.2 Run SQL to Update Role

Copy and paste this SQL query:

```sql
-- Update user role to admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@hisaabhub.com';  -- Replace with your admin email

-- Verify the update
SELECT id, email, name, role, created_at 
FROM public.users 
WHERE email = 'admin@hisaabhub.com';  -- Replace with your admin email
```

**Important**: Replace `'admin@hisaabhub.com'` with the actual email you used in Step 1.

### 2.3 Execute Query

1. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
2. Verify the output shows:
   - `role` column = `'admin'`
   - User details are correct

### 2.4 If User Not Found in public.users Table

If the SELECT query returns no results, the user hasn't logged in yet and their profile hasn't been created. You have two options:

**Option A: Login First (Recommended)**
1. Go to your app: http://hisaabhub.vercel.app
2. Click "Login" and sign in with the admin credentials
3. This will trigger the user profile creation
4. Then run the UPDATE query again

**Option B: Manually Insert User Record**
```sql
-- Insert user record manually
INSERT INTO public.users (id, email, name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', 'Admin User') as name,
    'admin' as role
FROM auth.users
WHERE email = 'admin@hisaabhub.com'  -- Replace with your admin email
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify
SELECT id, email, name, role FROM public.users WHERE email = 'admin@hisaabhub.com';
```

---

## Step 3: Test Admin Login and Access

### 3.1 Test Login

1. Open your app: http://hisaabhub.vercel.app
2. Click **"Login"** button in the navbar
3. Enter admin credentials:
   - Email: [your-admin-email]
   - Password: [your-admin-password]
4. Click **"Sign In"**

**Expected Result**: Successfully logged in, redirected to homepage

### 3.2 Test Admin Panel Access

1. Navigate to: http://hisaabhub.vercel.app/admin/aeo
2. Or click on admin links if available in the UI

**Expected Result**: 
- ✅ Access granted to admin panel
- ✅ Can view the "Create New Article" page
- ✅ No redirect to login or homepage

### 3.3 Test Admin Permissions

1. Try to create a new article at `/admin/aeo/new`
2. Fill in the form with test data
3. Submit the form

**Expected Result**:
- ✅ Article created successfully
- ✅ No authorization errors
- ✅ Redirected to article page

### 3.4 Verify Middleware Protection

**Test 1: Access admin panel while logged out**
1. Log out from the app
2. Try to access: http://hisaabhub.vercel.app/admin/aeo

**Expected Result**: 
- ❌ Access denied
- ✅ Redirected to login page with `redirectTo` parameter

**Test 2: Access admin panel as regular user**
1. Create a regular user account (or use existing)
2. Login with regular user credentials
3. Try to access: http://hisaabhub.vercel.app/admin/aeo

**Expected Result**:
- ❌ Access denied
- ✅ Redirected to homepage (not admin panel)

---

## Step 4: Document Admin Credentials Securely

### 4.1 Update Environment Documentation

The admin credentials should be documented in a secure location. **DO NOT** commit credentials to Git.

### 4.2 Recommended Storage Locations

**For Team Access**:
- Password manager (1Password, LastPass, Bitwarden)
- Secure note in project management tool
- Encrypted document in secure cloud storage

**For Personal Use**:
- Password manager
- Encrypted note on local machine

### 4.3 Credential Rotation Policy

**Recommended**: Change admin password every 90 days

To change password:
1. Go to Supabase Dashboard > Authentication > Users
2. Find the admin user
3. Click the three dots menu > "Reset password"
4. Or use the "Send password reset email" option

### 4.4 Security Best Practices

✅ **DO**:
- Use a strong, unique password (min 16 characters)
- Enable 2FA if available
- Limit admin access to trusted team members only
- Monitor admin activity through audit logs
- Use different passwords for dev/staging/production

❌ **DON'T**:
- Share admin credentials via email or chat
- Use the same password across environments
- Store credentials in plain text files
- Commit credentials to version control
- Use weak or common passwords

---

## Troubleshooting

### Issue 1: "User already exists" error

**Solution**: The email is already registered. Either:
- Use a different email address
- Delete the existing user and recreate
- Update the existing user's role to admin

### Issue 2: Cannot access admin panel after login

**Possible Causes**:
1. Role not updated in database
2. Middleware not checking role correctly
3. Session not refreshed

**Solutions**:
1. Verify role in database:
   ```sql
   SELECT email, role FROM public.users WHERE email = 'your-admin-email';
   ```
2. Log out and log back in to refresh session
3. Clear browser cookies and try again
4. Check middleware logs for errors

### Issue 3: "Access denied" even with admin role

**Possible Causes**:
1. Middleware not reading role from database
2. RLS policies blocking access
3. Session expired

**Solutions**:
1. Check middleware code in `src/middleware.ts`
2. Verify RLS policies allow admin access
3. Log out and log back in
4. Check browser console for errors

### Issue 4: User not found in public.users table

**Solution**: See Step 2.4 above - either login first or manually insert the user record.

---

## Verification Checklist

After completing all steps, verify:

- [ ] Admin user created in Supabase Auth
- [ ] User role set to 'admin' in public.users table
- [ ] Can login with admin credentials
- [ ] Can access `/admin/aeo` routes
- [ ] Can create new articles
- [ ] Regular users cannot access admin panel
- [ ] Logged-out users redirected to login
- [ ] Admin credentials documented securely
- [ ] Password stored in password manager
- [ ] Team members informed of admin access

---

## Next Steps

After admin user is set up:

1. **Test all admin features**:
   - Create article
   - Edit article (when implemented)
   - Delete article (when implemented)
   - View admin dashboard (when implemented)

2. **Set up additional admins** (if needed):
   - Repeat this process for each admin user
   - Use different email addresses
   - Document all admin accounts

3. **Configure audit logging**:
   - Monitor admin actions
   - Set up alerts for critical operations
   - Review logs regularly

4. **Proceed to Phase 2 tasks**:
   - Task 2.1: Create admin dashboard
   - Task 2.2: Create admin API endpoints
   - Task 3.1: Edit article feature

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review middleware code: `src/middleware.ts`
3. Check Supabase logs in dashboard
4. Review browser console for errors
5. Check network tab for API errors

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Status**: Ready for Use
