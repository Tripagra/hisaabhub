/**
 * Admin User Creation Script
 * Task: 1.4.2 Update user role to 'admin' in database
 * 
 * This script helps create or update an admin user in the database.
 * 
 * Prerequisites:
 * 1. User must already exist in Supabase Auth (create via dashboard)
 * 2. Environment variables must be set in .env.local
 * 
 * Usage:
 *   node scripts/create-admin-user.js <admin-email>
 * 
 * Example:
 *   node scripts/create-admin-user.js admin@hisaabhub.com
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in environment');
  process.exit(1);
}

// Get admin email from command line argument
const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error('❌ Error: Admin email not provided');
  console.log('\nUsage: node scripts/create-admin-user.js <admin-email>');
  console.log('Example: node scripts/create-admin-user.js admin@hisaabhub.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(adminEmail)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createAdminUser() {
  console.log('🚀 Starting admin user creation process...\n');
  console.log(`📧 Admin Email: ${adminEmail}\n`);

  try {
    // Step 1: Check if user exists in auth.users
    console.log('Step 1: Checking if user exists in Supabase Auth...');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      process.exit(1);
    }

    const authUser = authUsers.users.find(u => u.email === adminEmail);

    if (!authUser) {
      console.error('❌ Error: User not found in Supabase Auth');
      console.log('\n📝 Please create the user first:');
      console.log('   1. Go to Supabase Dashboard > Authentication > Users');
      console.log('   2. Click "Add user" > "Create new user"');
      console.log(`   3. Enter email: ${adminEmail}`);
      console.log('   4. Set a strong password');
      console.log('   5. Check "Auto Confirm User"');
      console.log('   6. Click "Create user"');
      console.log('   7. Run this script again\n');
      process.exit(1);
    }

    console.log('✅ User found in Supabase Auth');
    console.log(`   User ID: ${authUser.id}`);
    console.log(`   Email: ${authUser.email}`);
    console.log(`   Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Created: ${new Date(authUser.created_at).toLocaleString()}\n`);

    // Step 2: Check if user exists in public.users
    console.log('Step 2: Checking if user exists in public.users table...');
    
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (expected if user doesn't exist)
      console.error('❌ Error checking user:', selectError.message);
      process.exit(1);
    }

    // Step 3: Insert or update user with admin role
    if (existingUser) {
      console.log('✅ User found in public.users table');
      console.log(`   Current role: ${existingUser.role}`);
      
      if (existingUser.role === 'admin') {
        console.log('✅ User already has admin role - no update needed\n');
      } else {
        console.log('\nStep 3: Updating user role to admin...');
        
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', authUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating user role:', updateError.message);
          process.exit(1);
        }

        console.log('✅ User role updated to admin');
        console.log(`   User ID: ${updatedUser.id}`);
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Name: ${updatedUser.name}`);
        console.log(`   Role: ${updatedUser.role}\n`);
      }
    } else {
      console.log('⚠️  User not found in public.users table');
      console.log('\nStep 3: Creating user record with admin role...');
      
      const userName = authUser.user_metadata?.name || 
                       authUser.user_metadata?.full_name || 
                       'Admin User';

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: userName,
          role: 'admin'
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating user record:', insertError.message);
        process.exit(1);
      }

      console.log('✅ User record created with admin role');
      console.log(`   User ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Name: ${newUser.name}`);
      console.log(`   Role: ${newUser.role}\n`);
    }

    // Step 4: Verify admin user
    console.log('Step 4: Verifying admin user...');
    
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .eq('role', 'admin')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying admin user:', verifyError.message);
      process.exit(1);
    }

    console.log('✅ Admin user verified successfully\n');

    // Step 5: List all admin users
    console.log('Step 5: Listing all admin users...');
    
    const { data: allAdmins, error: listError } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Error listing admin users:', listError.message);
      process.exit(1);
    }

    console.log(`✅ Found ${allAdmins.length} admin user(s):\n`);
    allAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email}`);
      console.log(`      Name: ${admin.name}`);
      console.log(`      ID: ${admin.id}`);
      console.log(`      Created: ${new Date(admin.created_at).toLocaleString()}\n`);
    });

    // Success summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ SUCCESS: Admin user setup complete!');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('📋 Next Steps:');
    console.log('   1. Test login with admin credentials');
    console.log('   2. Navigate to: /admin/aeo');
    console.log('   3. Verify admin panel access');
    console.log('   4. Test creating a new article');
    console.log('   5. Document credentials securely\n');
    
    console.log('🔒 Security Reminders:');
    console.log('   • Store credentials in a password manager');
    console.log('   • Never commit credentials to version control');
    console.log('   • Use strong, unique passwords');
    console.log('   • Rotate passwords every 90 days');
    console.log('   • Monitor admin activity through audit logs\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
