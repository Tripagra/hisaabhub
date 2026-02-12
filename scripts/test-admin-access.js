/**
 * Admin Access Testing Script
 * Task: 1.4.3 Test admin login and access
 * 
 * This script tests admin authentication and authorization.
 * 
 * Prerequisites:
 * 1. Admin user must exist in Supabase Auth
 * 2. Admin user must have role='admin' in public.users
 * 3. Environment variables must be set in .env.local
 * 
 * Usage:
 *   node scripts/test-admin-access.js <admin-email> <admin-password>
 * 
 * Example:
 *   node scripts/test-admin-access.js admin@hisaabhub.com SecurePassword123!
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in environment');
  process.exit(1);
}

// Get credentials from command line arguments
const adminEmail = process.argv[2];
const adminPassword = process.argv[3];

if (!adminEmail || !adminPassword) {
  console.error('❌ Error: Admin credentials not provided');
  console.log('\nUsage: node scripts/test-admin-access.js <admin-email> <admin-password>');
  console.log('Example: node scripts/test-admin-access.js admin@hisaabhub.com SecurePassword123!');
  console.log('\n⚠️  WARNING: This will expose your password in command history!');
  console.log('   Consider using environment variables instead.\n');
  process.exit(1);
}

// Create Supabase client (simulates frontend client)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAdminAccess() {
  console.log('🧪 Starting admin access tests...\n');
  console.log(`📧 Testing with: ${adminEmail}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  let testsPassed = 0;
  let testsFailed = 0;
  let session = null;

  try {
    // Test 1: Admin Login
    console.log('Test 1: Admin Login');
    console.log('─────────────────────────────────────────────────────────');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) {
      console.error('❌ FAILED: Login failed');
      console.error(`   Error: ${authError.message}\n`);
      testsFailed++;
      
      if (authError.message.includes('Invalid login credentials')) {
        console.log('💡 Possible causes:');
        console.log('   • Incorrect password');
        console.log('   • User not confirmed (check email_confirmed_at)');
        console.log('   • User disabled in Supabase Auth\n');
      }
      
      process.exit(1);
    }

    session = authData.session;
    console.log('✅ PASSED: Login successful');
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}`);
    console.log(`   Session expires: ${new Date(session.expires_at * 1000).toLocaleString()}\n`);
    testsPassed++;

    // Test 2: Check User Profile
    console.log('Test 2: Check User Profile in public.users');
    console.log('─────────────────────────────────────────────────────────');
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ FAILED: Could not fetch user profile');
      console.error(`   Error: ${profileError.message}\n`);
      testsFailed++;
      
      console.log('💡 Possible causes:');
      console.log('   • User record not created in public.users');
      console.log('   • RLS policy blocking access');
      console.log('   • Run: node scripts/create-admin-user.js ' + adminEmail + '\n');
    } else {
      console.log('✅ PASSED: User profile found');
      console.log(`   Name: ${profile.name}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Created: ${new Date(profile.created_at).toLocaleString()}\n`);
      testsPassed++;
    }

    // Test 3: Verify Admin Role
    console.log('Test 3: Verify Admin Role');
    console.log('─────────────────────────────────────────────────────────');
    
    if (!profile) {
      console.error('❌ FAILED: Cannot verify role (profile not found)\n');
      testsFailed++;
    } else if (profile.role !== 'admin') {
      console.error('❌ FAILED: User does not have admin role');
      console.error(`   Current role: ${profile.role}`);
      console.error(`   Expected role: admin\n`);
      testsFailed++;
      
      console.log('💡 To fix:');
      console.log('   Run: node scripts/create-admin-user.js ' + adminEmail + '\n');
    } else {
      console.log('✅ PASSED: User has admin role\n');
      testsPassed++;
    }

    // Test 4: Test Article Read Access (Public)
    console.log('Test 4: Test Article Read Access');
    console.log('─────────────────────────────────────────────────────────');
    
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, keyword, slug, published, created_at')
      .limit(5);

    if (articlesError) {
      console.error('❌ FAILED: Could not read articles');
      console.error(`   Error: ${articlesError.message}\n`);
      testsFailed++;
    } else {
      console.log('✅ PASSED: Can read articles');
      console.log(`   Found ${articles.length} article(s)\n`);
      testsPassed++;
    }

    // Test 5: Test Article Write Access (Admin Only)
    console.log('Test 5: Test Article Write Access (Admin Only)');
    console.log('─────────────────────────────────────────────────────────');
    
    // Try to update an article (if any exist)
    if (articles && articles.length > 0) {
      const testArticle = articles[0];
      
      const { data: updateData, error: updateError } = await supabase
        .from('articles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', testArticle.id)
        .select();

      if (updateError) {
        console.error('❌ FAILED: Could not update article');
        console.error(`   Error: ${updateError.message}\n`);
        testsFailed++;
        
        console.log('💡 Possible causes:');
        console.log('   • RLS policy not allowing admin updates');
        console.log('   • Admin role not properly configured');
        console.log('   • Check: supabase-migrations/002_update_rls_policies_admin_role.sql\n');
      } else {
        console.log('✅ PASSED: Can update articles (admin permission verified)');
        console.log(`   Updated article: ${testArticle.keyword}\n`);
        testsPassed++;
      }
    } else {
      console.log('⚠️  SKIPPED: No articles found to test update\n');
    }

    // Test 6: Test Questions Access
    console.log('Test 6: Test Questions Access');
    console.log('─────────────────────────────────────────────────────────');
    
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, question_text, article_id')
      .limit(5);

    if (questionsError) {
      console.error('❌ FAILED: Could not read questions');
      console.error(`   Error: ${questionsError.message}\n`);
      testsFailed++;
    } else {
      console.log('✅ PASSED: Can read questions');
      console.log(`   Found ${questions.length} question(s)\n`);
      testsPassed++;
    }

    // Test 7: Verify Session Token
    console.log('Test 7: Verify Session Token');
    console.log('─────────────────────────────────────────────────────────');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('❌ FAILED: Could not verify session');
      console.error(`   Error: ${userError.message}\n`);
      testsFailed++;
    } else {
      console.log('✅ PASSED: Session is valid');
      console.log(`   User ID: ${user.id}`);
      console.log(`   Email: ${user.email}\n`);
      testsPassed++;
    }

    // Test 8: Logout
    console.log('Test 8: Logout');
    console.log('─────────────────────────────────────────────────────────');
    
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      console.error('❌ FAILED: Logout failed');
      console.error(`   Error: ${logoutError.message}\n`);
      testsFailed++;
    } else {
      console.log('✅ PASSED: Logout successful\n');
      testsPassed++;
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const totalTests = testsPassed + testsFailed;
    const passRate = ((testsPassed / totalTests) * 100).toFixed(1);
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${testsPassed}`);
    console.log(`❌ Failed: ${testsFailed}`);
    console.log(`Pass Rate: ${passRate}%\n`);

    if (testsFailed === 0) {
      console.log('🎉 SUCCESS: All tests passed!');
      console.log('✅ Admin user is properly configured and can access the system.\n');
      
      console.log('📋 Next Steps:');
      console.log('   1. Test admin panel in browser: /admin/aeo');
      console.log('   2. Try creating a new article');
      console.log('   3. Verify middleware protection works');
      console.log('   4. Document credentials securely\n');
    } else {
      console.log('⚠️  WARNING: Some tests failed!');
      console.log('Please review the errors above and fix the issues.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
testAdminAccess();
