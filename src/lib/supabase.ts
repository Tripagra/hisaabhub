import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Legacy export for compatibility
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers for Next.js
export const auth = {
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    const supabase = createSupabaseClient();
    const signUpData: any = {
      email,
      password,
    };
    
    if (metadata) {
      signUpData.options = {
        data: metadata,
      };
    }
    
    const { data, error } = await supabase.auth.signUp(signUpData);
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const supabase = createSupabaseClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};
