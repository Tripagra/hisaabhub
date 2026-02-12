-- Migration: Update RLS policies to use role-based authentication
-- Date: 2026-02-12
-- Description: Replace hardcoded email checks with role-based checks from users table

-- =====================================================
-- 1. DROP EXISTING POLICIES FOR ARTICLES
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;

-- =====================================================
-- 2. CREATE NEW ROLE-BASED POLICIES FOR ARTICLES
-- =====================================================

-- Admins can view all articles (including unpublished)
CREATE POLICY "Admins can view all articles"
    ON public.articles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
    ON public.articles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can update articles
CREATE POLICY "Admins can update articles"
    ON public.articles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
    ON public.articles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );


-- =====================================================
-- 3. DROP EXISTING POLICIES FOR QUESTIONS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

-- =====================================================
-- 4. CREATE NEW ROLE-BASED POLICIES FOR QUESTIONS
-- =====================================================

-- Admins can view all questions
CREATE POLICY "Admins can view all questions"
    ON public.questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can insert questions
CREATE POLICY "Admins can insert questions"
    ON public.questions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can update questions
CREATE POLICY "Admins can update questions"
    ON public.questions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can delete questions
CREATE POLICY "Admins can delete questions"
    ON public.questions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
