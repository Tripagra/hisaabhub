import type { EnvConfig } from '@/types';

const validateEnv = (): EnvConfig => {
  const missing: string[] = [];

  // Check Next.js public env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    VITE_SUPABASE_URL: supabaseUrl!,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey!,
    VITE_APP_ENV: (process.env.NODE_ENV as any) || 'development',
    VITE_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    VITE_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  } as EnvConfig;
};

export const config = validateEnv();

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isStaging = (process.env.NODE_ENV as string) === 'staging';