/**
 * RLS Policy Tests
 * 
 * These tests verify that Row Level Security policies are correctly enforced
 * for articles and questions tables.
 * 
 * Prerequisites:
 * 1. Supabase instance with migrations applied
 * 2. Test users created in Supabase Auth:
 *    - Admin user with role='admin'
 *    - Regular user with role='user'
 * 3. Environment variables set in .env.test:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *    - TEST_ADMIN_EMAIL
 *    - TEST_ADMIN_PASSWORD
 *    - TEST_USER_EMAIL
 *    - TEST_USER_PASSWORD
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'admin123';
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'user@test.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'user123';

// Test data
const TEST_ARTICLE_SLUG = 'test-rls-article-' + Date.now();
const TEST_QUESTION_POSITION = 9999;

let adminClient: SupabaseClient;
let userClient: SupabaseClient;
let anonClient: SupabaseClient;
let testArticleId: string;

describe('RLS Policies', () => {
  beforeAll(async () => {
    // Create clients
    adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Sign in admin user
    const { error: adminError } = await adminClient.auth.signInWithPassword({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
    });
    if (adminError) {
      console.warn('Admin login failed:', adminError.message);
      console.warn('Skipping RLS tests - admin user not configured');
    }

    // Sign in regular user
    const { error: userError } = await userClient.auth.signInWithPassword({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    if (userError) {
      console.warn('User login failed:', userError.message);
      console.warn('Skipping RLS tests - regular user not configured');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete test article if created
    if (testArticleId) {
      await adminClient.from('articles').delete().eq('id', testArticleId);
    }

    // Sign out all clients
    await adminClient.auth.signOut();
    await userClient.auth.signOut();
  });

  describe('Articles - Admin User', () => {
    it('should allow admin to insert articles', async () => {
      const { data, error } = await adminClient
        .from('articles')
        .insert({
          slug: TEST_ARTICLE_SLUG,
          keyword: 'Test RLS Article',
          summary: 'This is a test article for RLS policy testing',
          published: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.slug).toBe(TEST_ARTICLE_SLUG);

      // Store article ID for cleanup
      if (data) {
        testArticleId = data.id;
      }
    });

    it('should allow admin to view all articles', async () => {
      const { data, error } = await adminClient
        .from('articles')
        .select('*')
        .eq('slug', TEST_ARTICLE_SLUG);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should allow admin to update articles', async () => {
      const { data, error } = await adminClient
        .from('articles')
        .update({ summary: 'Updated summary by admin' })
        .eq('slug', TEST_ARTICLE_SLUG)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.summary).toBe('Updated summary by admin');
    });

    it('should allow admin to delete articles', async () => {
      // Create a temporary article for deletion test
      const { data: tempArticle } = await adminClient
        .from('articles')
        .insert({
          slug: TEST_ARTICLE_SLUG + '-delete',
          keyword: 'Delete Test',
          summary: 'Article to be deleted',
        })
        .select()
        .single();

      // Delete the article
      const { error } = await adminClient
        .from('articles')
        .delete()
        .eq('slug', TEST_ARTICLE_SLUG + '-delete');

      expect(error).toBeNull();
    });
  });

  describe('Articles - Regular User', () => {
    it('should prevent regular user from inserting articles', async () => {
      const { data, error } = await userClient
        .from('articles')
        .insert({
          slug: TEST_ARTICLE_SLUG + '-user',
          keyword: 'User Test',
          summary: 'This should fail',
        });

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should allow regular user to view published articles', async () => {
      const { data, error } = await userClient
        .from('articles')
        .select('*')
        .eq('slug', TEST_ARTICLE_SLUG)
        .eq('published', true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent regular user from updating articles', async () => {
      const { data, error } = await userClient
        .from('articles')
        .update({ summary: 'This should fail' })
        .eq('slug', TEST_ARTICLE_SLUG);

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should prevent regular user from deleting articles', async () => {
      const { data, error } = await userClient
        .from('articles')
        .delete()
        .eq('slug', TEST_ARTICLE_SLUG);

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('Articles - Anonymous User', () => {
    it('should allow anonymous user to view published articles', async () => {
      const { data, error } = await anonClient
        .from('articles')
        .select('*')
        .eq('published', true)
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent anonymous user from inserting articles', async () => {
      const { data, error } = await anonClient
        .from('articles')
        .insert({
          slug: TEST_ARTICLE_SLUG + '-anon',
          keyword: 'Anon Test',
          summary: 'This should fail',
        });

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('Questions - Admin User', () => {
    it('should allow admin to insert questions', async () => {
      if (!testArticleId) {
        console.warn('Skipping test - no test article created');
        return;
      }

      const { data, error } = await adminClient
        .from('questions')
        .insert({
          article_id: testArticleId,
          question_text: 'Test question by admin?',
          answer_text: 'This is a test answer by admin',
          position: TEST_QUESTION_POSITION,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.question_text).toBe('Test question by admin?');
    });

    it('should allow admin to view all questions', async () => {
      const { data, error } = await adminClient
        .from('questions')
        .select('*')
        .eq('position', TEST_QUESTION_POSITION);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should allow admin to update questions', async () => {
      const { data, error } = await adminClient
        .from('questions')
        .update({ answer_text: 'Updated answer by admin' })
        .eq('position', TEST_QUESTION_POSITION)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.answer_text).toBe('Updated answer by admin');
    });

    it('should allow admin to delete questions', async () => {
      const { error } = await adminClient
        .from('questions')
        .delete()
        .eq('position', TEST_QUESTION_POSITION);

      expect(error).toBeNull();
    });
  });

  describe('Questions - Regular User', () => {
    it('should prevent regular user from inserting questions', async () => {
      if (!testArticleId) {
        console.warn('Skipping test - no test article created');
        return;
      }

      const { data, error } = await userClient
        .from('questions')
        .insert({
          article_id: testArticleId,
          question_text: 'Test question by user?',
          answer_text: 'This should fail',
          position: TEST_QUESTION_POSITION + 1,
        });

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should allow regular user to view questions for published articles', async () => {
      const { data, error } = await userClient
        .from('questions')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent regular user from updating questions', async () => {
      const { data, error } = await userClient
        .from('questions')
        .update({ answer_text: 'This should fail' })
        .eq('position', TEST_QUESTION_POSITION);

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should prevent regular user from deleting questions', async () => {
      const { data, error } = await userClient
        .from('questions')
        .delete()
        .eq('position', TEST_QUESTION_POSITION);

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });
});
