-- News & GST Updates Module Schema

-- 1. Create News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT, -- HTML or Markdown
    category TEXT NOT NULL CHECK (category IN ('GST', 'Income Tax', 'MSME', 'RBI-UPI', 'Business', 'Government')),
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);

-- 3. Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Public Read Access
CREATE POLICY "Public can view news"
    ON public.news FOR SELECT
    USING (true);

-- Admin Write Access
-- Adjust the email check to match your specific admin user's email
CREATE POLICY "Admins can insert news"
    ON public.news FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

CREATE POLICY "Admins can update news"
    ON public.news FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

CREATE POLICY "Admins can delete news"
    ON public.news FOR DELETE
    USING (auth.jwt() ->> 'email' = 'admin@hisabhub.com');

-- 5. Storage Bucket (Run this if 'news-images' bucket doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news-images', 'news-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policy
CREATE POLICY "Public Access News Images" 
    ON storage.objects FOR SELECT 
    USING ( bucket_id = 'news-images' );

CREATE POLICY "Admin Upload News Images" 
    ON storage.objects FOR INSERT 
    WITH CHECK ( bucket_id = 'news-images' AND auth.jwt() ->> 'email' = 'admin@hisabhub.com' );
