# Admin Access Testing Checklist

**Task**: 1.4.3 Test admin login and access  
**Date**: February 12, 2026

---

## Overview

This document provides a comprehensive checklist for testing admin authentication and authorization in the HisaabHub platform.

---

## Automated Testing

### Run the Test Script

```bash
node scripts/test-admin-access.js admin@hisaabhub.com YourPassword123!
```

**Expected Output**:
- ✅ All 8 tests pass
- No error messages
- Success summary displayed

**If tests fail**: Review error messages and follow the troubleshooting steps provided.

---

## Manual Testing Checklist

### Test 1: Admin Login (Browser)

**Steps**:
1. Open browser and navigate to: http://hisaabhub.vercel.app
2. Click "Login" button in navbar
3. Enter admin credentials:
   - Email: [your-admin-email]
   - Password: [your-admin-password]
4. Click "Sign In"

**Expected Results**:
- [ ] Login successful (no error messages)
- [ ] Redirected to homepage or dashboard
- [ ] User menu shows admin email
- [ ] No console errors in browser DevTools

**If Failed**:
- Check credentials are correct
- Verify user exists in Supabase Auth
- Check browser console for errors
- Verify email is confirmed in Supabase

---

### Test 2: Admin Panel Access

**Steps**:
1. While logged in as admin, navigate to: http://hisaabhub.vercel.app/admin/aeo
2. Or navigate to: http://hisaabhub.vercel.app/admin/aeo/new

**Expected Results**:
- [ ] Page loads successfully
- [ ] No redirect to login page
- [ ] No redirect to homepage
- [ ] Admin interface is visible
- [ ] Can see "Create New Article" form (if on /new page)

**If Failed**:
- Verify role is 'admin' in database
- Check middleware code in `src/middleware.ts`
- Review browser console for errors
- Check network tab for 401/403 errors

---

### Test 3: Create Article (Admin Permission)

**Steps**:
1. Navigate to: http://hisaabhub.vercel.app/admin/aeo/new
2. Fill in the form:
   - Keyword: "Test Admin Access"
   - Summary: "Testing admin user creation and permissions"
   - Add at least one question and answer
3. Click "Create Article"

**Expected Results**:
- [ ] Form submits successfully
- [ ] No authorization errors
- [ ] Redirected to article page
- [ ] Article is visible on /aeo page
- [ ] Success message displayed

**If Failed**:
- Check RLS policies in database
- Verify admin role in public.users
- Check API route logs
- Review browser console for errors

---

### Test 4: Unauthorized Access Prevention (Logged Out)

**Steps**:
1. Log out from the application
2. Try to access: http://hisaabhub.vercel.app/admin/aeo

**Expected Results**:
- [ ] Access denied
- [ ] Redirected to login page
- [ ] URL includes `redirectTo` parameter
- [ ] After login, redirected back to admin panel

**If Failed**:
- Check middleware is protecting /admin routes
- Verify session validation is working
- Review middleware code

---

### Test 5: Unauthorized Access Prevention (Regular User)

**Steps**:
1. Create a regular user account (or use existing)
2. Login with regular user credentials
3. Try to access: http://hisaabhub.vercel.app/admin/aeo

**Expected Results**:
- [ ] Access denied
- [ ] Redirected to homepage (not admin panel)
- [ ] No error messages visible to user
- [ ] Cannot see admin interface

**If Failed**:
- Check middleware role validation
- Verify RLS policies
- Check that regular user has role='user'

---

### Test 6: Session Persistence

**Steps**:
1. Login as admin
2. Navigate to admin panel
3. Refresh the page (F5)
4. Close browser and reopen
5. Navigate to admin panel again

**Expected Results**:
- [ ] Session persists after page refresh
- [ ] Session persists after browser restart (if "Remember me" enabled)
- [ ] Still have admin access
- [ ] No need to login again

**If Failed**:
- Check cookie settings
- Verify session storage
- Check Supabase Auth configuration

---

### Test 7: Article Viewing (Public Access)

**Steps**:
1. Log out from admin account
2. Navigate to: http://hisaabhub.vercel.app/aeo
3. Click on any article

**Expected Results**:
- [ ] Can view article listing without login
- [ ] Can view article details without login
- [ ] View count increments
- [ ] No admin controls visible

**If Failed**:
- Check RLS policies allow public read
- Verify published articles are visible
- Check article page rendering

---

### Test 8: Database Access Verification

**Steps**:
1. Go to Supabase Dashboard > SQL Editor
2. Run this query:
   ```sql
   SELECT id, email, name, role, created_at 
   FROM public.users 
   WHERE email = 'your-admin-email@example.com';
   ```

**Expected Results**:
- [ ] Query returns 1 row
- [ ] role = 'admin'
- [ ] email matches admin email
- [ ] created_at is recent

**If Failed**:
- Run: `node scripts/create-admin-user.js your-admin-email`
- Check database connection
- Verify table exists

---

### Test 9: RLS Policy Verification

**Steps**:
1. Go to Supabase Dashboard > SQL Editor
2. Run this query:
   ```sql
   SELECT tablename, policyname, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public'
   AND tablename = 'articles'
   AND policyname LIKE '%admin%';
   ```

**Expected Results**:
- [ ] Returns admin-specific policies
- [ ] Policies check for admin role
- [ ] UPDATE and DELETE policies exist

**If Failed**:
- Run migration: `supabase-migrations/002_update_rls_policies_admin_role.sql`
- Check policy definitions
- Verify policies are enabled

---

### Test 10: Middleware Protection

**Steps**:
1. Open `src/middleware.ts` in code editor
2. Verify these conditions exist:
   - Admin routes require authentication
   - Admin routes check user role
   - Non-admin users are redirected

**Expected Code**:
```typescript
// Check if route is admin route
const isAdminRoute = adminRoutes.some(route =>
  req.nextUrl.pathname.startsWith(route)
);

if (isAdminRoute) {
  // Require authentication
  if (!session) {
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.redirect(homeUrl);
  }
}
```

**Expected Results**:
- [ ] Middleware checks authentication
- [ ] Middleware checks admin role
- [ ] Proper redirects in place

**If Failed**:
- Review middleware implementation
- Check if admin bypass was removed
- Verify role check logic

---

## Browser Testing Matrix

Test admin access in multiple browsers:

| Browser | Version | Login | Admin Access | Create Article | Status |
|---------|---------|-------|--------------|----------------|--------|
| Chrome  | Latest  | [ ]   | [ ]          | [ ]            | [ ]    |
| Firefox | Latest  | [ ]   | [ ]          | [ ]            | [ ]    |
| Safari  | Latest  | [ ]   | [ ]          | [ ]            | [ ]    |
| Edge    | Latest  | [ ]   | [ ]          | [ ]            | [ ]    |

---

## Mobile Testing

Test admin access on mobile devices:

| Device | OS | Browser | Login | Admin Access | Status |
|--------|----|---------| ------|--------------|--------|
| iPhone | iOS | Safari  | [ ]   | [ ]          | [ ]    |
| Android| Android | Chrome | [ ]   | [ ]          | [ ]    |

---

## Performance Testing

### Load Time Testing

**Steps**:
1. Open browser DevTools > Network tab
2. Navigate to admin panel
3. Measure load time

**Expected Results**:
- [ ] Admin panel loads in < 2 seconds
- [ ] No failed requests
- [ ] All assets load successfully

---

## Security Testing

### Test 1: SQL Injection Prevention

**Steps**:
1. Try to login with: `admin@test.com' OR '1'='1`
2. Try to create article with SQL in fields

**Expected Results**:
- [ ] Login fails (invalid credentials)
- [ ] SQL not executed
- [ ] Input properly sanitized

---

### Test 2: XSS Prevention

**Steps**:
1. Try to create article with: `<script>alert('XSS')</script>`
2. View the article

**Expected Results**:
- [ ] Script not executed
- [ ] Content properly escaped
- [ ] No alert popup

---

### Test 3: CSRF Protection

**Steps**:
1. Check if CSRF tokens are used
2. Try to submit form without valid token

**Expected Results**:
- [ ] CSRF protection enabled
- [ ] Invalid requests rejected

---

## Troubleshooting Guide

### Issue: Cannot login

**Possible Causes**:
- Incorrect password
- User not confirmed
- User disabled

**Solutions**:
1. Reset password in Supabase dashboard
2. Check email_confirmed_at in auth.users
3. Enable user in Supabase Auth

---

### Issue: Access denied to admin panel

**Possible Causes**:
- Role not set to 'admin'
- Middleware not checking role
- Session expired

**Solutions**:
1. Run: `node scripts/create-admin-user.js your-email`
2. Check middleware code
3. Log out and log back in

---

### Issue: Can create articles but not update/delete

**Possible Causes**:
- RLS policies not configured
- Admin role not recognized

**Solutions**:
1. Run: `supabase-migrations/002_update_rls_policies_admin_role.sql`
2. Verify policies in Supabase dashboard
3. Check role in database

---

## Test Results Summary

**Date**: _____________  
**Tester**: _____________  
**Environment**: _____________

### Overall Results

- Total Tests: _____ / 10
- Passed: _____
- Failed: _____
- Pass Rate: _____%

### Critical Issues Found

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Recommendations

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Sign-off

- [ ] All critical tests passed
- [ ] Admin user can login
- [ ] Admin user can access admin panel
- [ ] Admin user can create articles
- [ ] Unauthorized access is prevented
- [ ] Security tests passed
- [ ] Ready for production use

**Approved by**: _____________  
**Date**: _____________

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026
