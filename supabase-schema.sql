-- HisabHub Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ITR Filing Requests table
CREATE TABLE IF NOT EXISTS public.itr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    pan TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Service Inquiries table
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for itr_requests table
CREATE POLICY "Anyone can insert ITR requests"
    ON public.itr_requests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own ITR requests"
    ON public.itr_requests FOR SELECT
    USING (auth.email() = email);

-- RLS Policies for service_inquiries table
CREATE POLICY "Anyone can insert service inquiries"
    ON public.service_inquiries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own service inquiries"
    ON public.service_inquiries FOR SELECT
    USING (auth.email() = email);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_itr_requests_email ON public.itr_requests(email);
CREATE INDEX IF NOT EXISTS idx_itr_requests_created_at ON public.itr_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_email ON public.service_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_created_at ON public.service_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_inquiries_service_name ON public.service_inquiries(service_name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itr_requests_updated_at
    BEFORE UPDATE ON public.itr_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_inquiries_updated_at
    BEFORE UPDATE ON public.service_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
