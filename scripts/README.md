# Scripts Directory

This directory contains utility scripts for managing the HisaabHub platform.

---

## Available Scripts

### 1. create-admin-user.js

Creates or updates an admin user in the database.

**Purpose**: Automates the process of granting admin role to a user.

**Prerequisites**:
- User must already exist in Supabase Auth (create via dashboard)
- Environment variables must be set in `.env.local`
- Node.js installed

**Usage**:
```bash
node scripts/create-admin-user.js <admin-email>
```

**Example**:
```bash
node scripts/create-admin-user.js admin@hisaabhub.com
```

**What it does**:
1. Checks if user exists in Supabase Auth
2. Checks if user exists in public.users table
3. Creates or updates user record with admin role
4. Verifies the admin user
5. Lists all admin users

**Output**:
- Success messages with user details
- Error messages if something goes wrong
- Next steps and security reminders

**Troubleshooting**:
- If "User not found in Supabase Auth": Create user in dashboard first
- If "Error checking user": Check database connection and RLS policies
- If "Error updating user role": Check SUPABASE_SERVICE_ROLE_KEY is correct

---

### 2. test-admin-access.js

Tests admin authentication and authorization.

**Purpose**: Verifies that admin user can login and access admin features.

**Prerequisites**:
- Admin user must exist in Supabase Auth
- Admin user must have role='admin' in public.users
- Environment variables must be set in `.env.local`
- Node.js installed

**Usage**:
```bash
node scripts/test-admin-access.js <admin-email> <admin-password>
```

**Example**:
```bash
node scripts/test-admin-access.js admin@hisaabhub.com SecurePassword123!
```

**⚠️ Security Warning**: This exposes your password in command history. Consider using environment variables instead.

**What it tests**:
1. Admin login functionality
2. User profile in public.users table
3. Admin role verification
4. Article read access
5. Article write access (admin only)
6. Questions access
7. Session token validity
8. Logout functionality

**Output**:
- Test results for each test
- Pass/fail status
- Detailed error messages if tests fail
- Summary with pass rate
- Next steps if all tests pass

**Troubleshooting**:
- If "Login failed": Check password, verify user is confirmed
- If "User profile not found": Run create-admin-user.js script
- If "Not admin role": Run create-admin-user.js to update role
- If "Cannot update article": Check RLS policies

---

## Environment Variables Required

All scripts require these environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Note**: The service role key bypasses Row Level Security (RLS) policies, so keep it secure!

---

## Adding New Scripts

When adding new scripts:

1. Create the script file in this directory
2. Add documentation to this README
3. Include error handling and validation
4. Add usage examples
5. Test thoroughly before committing

---

## Security Notes

- Never commit `.env.local` or credentials to version control
- Service role key has full database access - use carefully
- Always validate user input in scripts
- Log important actions for audit trail
- Use these scripts only in trusted environments

---

## Support

For issues or questions:
1. Check the script's error messages
2. Review the troubleshooting section
3. Check Supabase dashboard logs
4. Review the main project documentation
