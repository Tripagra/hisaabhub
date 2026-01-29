-- =====================================================
-- HisaabHub AEO News System - Complete Database Schema
-- =====================================================

-- 1. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    keyword TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    
    -- Constraints
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT keyword_not_empty CHECK (LENGTH(TRIM(keyword)) > 0),
    CONSTRAINT summary_not_empty CHECK (LENGTH(TRIM(summary)) > 0)
);

-- 2. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT question_not_empty CHECK (LENGTH(TRIM(question_text)) > 0),
    CONSTRAINT answer_not_empty CHECK (LENGTH(TRIM(answer_text)) > 0),
    CONSTRAINT position_positive CHECK (position >= 0),
    CONSTRAINT unique_article_position UNIQUE (article_id, position)
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_keyword ON public.articles(keyword);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON public.articles(views DESC);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_article_id ON public.questions(article_id);
CREATE INDEX IF NOT EXISTS idx_questions_position ON public.questions(article_id, position);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);

-- Full-text search indexes (for future search functionality)
CREATE INDEX IF NOT EXISTS idx_articles_keyword_trgm ON public.articles USING gin(keyword gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_questions_text_trgm ON public.questions USING gin(question_text gin_trgm_ops);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. RLS POLICIES - ARTICLES
-- =====================================================

-- Public can view published articles
CREATE POLICY "Public can view published articles"
    ON public.articles FOR SELECT
    USING (published = true);

-- Admins can view all articles (including unpublished)
CREATE POLICY "Admins can view all articles"
    ON public.articles FOR SELECT
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
    ON public.articles FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Admins can update articles
CREATE POLICY "Admins can update articles"
    ON public.articles FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
    ON public.articles FOR DELETE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- =====================================================
-- 6. RLS POLICIES - QUESTIONS
-- =====================================================

-- Public can view questions for published articles
CREATE POLICY "Public can view questions for published articles"
    ON public.questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE articles.id = questions.article_id 
            AND articles.published = true
        )
    );

-- Admins can view all questions
CREATE POLICY "Admins can view all questions"
    ON public.questions FOR SELECT
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Admins can insert questions
CREATE POLICY "Admins can insert questions"
    ON public.questions FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Admins can update questions
CREATE POLICY "Admins can update questions"
    ON public.questions FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- Admins can delete questions
CREATE POLICY "Admins can delete questions"
    ON public.questions FOR DELETE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- =====================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for articles
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for questions
DROP TRIGGER IF EXISTS update_questions_updated_at ON public.questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.articles 
    SET views = views + 1 
    WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on tables for public access
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT SELECT ON public.questions TO anon, authenticated;

-- Grant all privileges to authenticated users (controlled by RLS)
GRANT ALL ON public.articles TO authenticated;
GRANT ALL ON public.questions TO authenticated;

-- =====================================================
-- 9. ENABLE pg_trgm EXTENSION (for full-text search)
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- 10. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================

-- Uncomment below to insert sample data for testing

/*
INSERT INTO public.articles (slug, keyword, summary, published) VALUES
('gst-rate-changes-2026', 'GST Rate Changes 2026', 'Government announces new GST rate changes effective from April 2026, affecting multiple sectors including textiles and electronics.', true),
('income-tax-slab-update', 'Income Tax Slab 2026', 'New income tax slabs announced in Budget 2026 with increased exemption limits for middle-class taxpayers.', true);

INSERT INTO public.questions (article_id, question_text, answer_text, position) VALUES
(
    (SELECT id FROM public.articles WHERE slug = 'gst-rate-changes-2026'),
    'What are the new GST rates for 2026?',
    'The new GST rates for 2026 include a reduction in textile GST from 12% to 5%, and electronics GST from 18% to 12%. These changes will be effective from April 1, 2026.',
    1
),
(
    (SELECT id FROM public.articles WHERE slug = 'gst-rate-changes-2026'),
    'When will the new GST rates come into effect?',
    'The new GST rates will come into effect from April 1, 2026. Businesses should prepare their systems and update their billing accordingly before this date.',
    2
);
*/
