-- Migration: Add role column to users table
-- Date: 2026-02-12
-- Description: Add role column with default 'user' value for admin authentication

-- Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add check constraint to ensure valid roles
ALTER TABLE public.users
ADD CONSTRAINT users_role_check 
CHECK (role IN ('user', 'admin'));

-- Set existing users to 'user' role if NULL
UPDATE public.users 
SET role = 'user' 
WHERE role IS NULL;

-- Create index on role column for efficient role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Create partial index for admin users (more efficient for admin checks)
CREATE INDEX IF NOT EXISTS idx_users_admin_role 
ON public.users(role) 
WHERE role = 'admin';
