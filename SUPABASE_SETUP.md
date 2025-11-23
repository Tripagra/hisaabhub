# Supabase Setup Instructions for HisabHub

## ✅ What's Been Done

1. **Installed Supabase Client** - `@supabase/supabase-js` package added
2. **Environment Variables** - `.env` file created with your Supabase credentials
3. **Supabase Client** - Configuration file created at `src/lib/supabase.ts`
4. **Form Integration** - All forms now save data to Supabase:
   - **AuthModal** - User registration and login
   - **FileITRModal** - ITR filing requests
   - **ServiceModal** - Service inquiries (GST, Expert Assisted, etc.)

## 🗄️ Database Setup

### Step 1: Create Tables in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com/project/hpaguyquajofazmuytwd
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** to execute the SQL

This will create:
- **users** table - Stores user profile information
- **itr_requests** table - Stores ITR filing requests
- **service_inquiries** table - Stores service inquiry forms

### Step 2: Verify Tables

1. Go to **Table Editor** in your Supabase dashboard
2. You should see three new tables:
   - `users`
   - `itr_requests`
   - `service_inquiries`

## 📊 Database Tables

### 1. **users** Table
Stores registered user information:
- `id` (UUID) - Primary key, linked to auth.users
- `email` (TEXT) - User email
- `name` (TEXT) - Full name
- `phone` (TEXT) - Phone number
- `created_at` (TIMESTAMP) - Registration date
- `updated_at` (TIMESTAMP) - Last update

### 2. **itr_requests** Table
Stores ITR filing requests:
- `id` (UUID) - Primary key
- `name` (TEXT) - Requester name
- `email` (TEXT) - Requester email
- `phone` (TEXT) - Phone number
- `pan` (TEXT) - PAN number (optional)
- `status` (TEXT) - Request status (default: 'pending')
- `created_at` (TIMESTAMP) - Request date
- `updated_at` (TIMESTAMP) - Last update

### 3. **service_inquiries** Table
Stores service inquiry forms:
- `id` (UUID) - Primary key
- `service_name` (TEXT) - Name of service (e.g., "GST Services", "Expert Assisted")
- `name` (TEXT) - Inquirer name
- `email` (TEXT) - Inquirer email
- `phone` (TEXT) - Phone number
- `message` (TEXT) - Optional message
- `status` (TEXT) - Inquiry status (default: 'pending')
- `created_at` (TIMESTAMP) - Inquiry date
- `updated_at` (TIMESTAMP) - Last update

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication** - Users must be authenticated to register
- **Data Privacy** - Users can only view their own data
- **Public Submissions** - Anyone can submit ITR requests and service inquiries
- **Secure Policies** - Proper RLS policies prevent unauthorized access

## 🧪 Testing the Integration

### Test User Registration:
1. Click **Register** button in navbar
2. Fill in the form with:
   - Name
   - Email
   - Phone
   - Password
3. Submit the form
4. Check your Supabase **Authentication** → **Users** section
5. Check the **users** table in Table Editor

### Test ITR Request:
1. Click **File for Free** button
2. Fill in the form
3. Submit
4. Check **itr_requests** table in Supabase

### Test Service Inquiry:
1. Click any service button (e.g., "Book an Expert", "Explore GST")
2. Fill in the form
3. Submit
4. Check **service_inquiries** table in Supabase

## 📝 Viewing Submitted Data

### In Supabase Dashboard:
1. Go to **Table Editor**
2. Select the table you want to view
3. All submitted data will appear here with timestamps

### Query Examples:
```sql
-- View all ITR requests
SELECT * FROM itr_requests ORDER BY created_at DESC;

-- View all service inquiries
SELECT * FROM service_inquiries ORDER BY created_at DESC;

-- View inquiries for a specific service
SELECT * FROM service_inquiries WHERE service_name = 'GST Services';

-- Count total users
SELECT COUNT(*) FROM users;
```

## 🚀 Next Steps

1. **Run the SQL schema** in Supabase SQL Editor
2. **Test all forms** to ensure data is being saved
3. **Monitor the database** in Supabase Table Editor
4. **Optional**: Set up email notifications when forms are submitted
5. **Optional**: Create an admin dashboard to manage submissions

## 🔧 Troubleshooting

### If forms aren't saving:
1. Check browser console for errors
2. Verify `.env` file has correct credentials
3. Ensure tables are created in Supabase
4. Check RLS policies are enabled

### If authentication fails:
1. Go to Supabase **Authentication** → **Settings**
2. Ensure **Enable Email Signup** is turned ON
3. Configure email templates if needed

## 📧 Email Verification

By default, Supabase requires email verification. To disable for testing:
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Toggle **Enable email confirmations** OFF (for testing only)

## 🎉 Success!

Once the SQL schema is executed, all forms in your HisabHub application will automatically save data to your Supabase database!
