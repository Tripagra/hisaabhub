'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase';
import type { AuthFormData, LoadingState } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });

  const supabase = createSupabaseClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        setLoading(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Auth error',
        }));
      } finally {
        setLoading(prev => ({ ...prev, isLoading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading({ isLoading: false, error: null });
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signUp = useCallback(async (formData: AuthFormData) => {
    setLoading({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sign up failed');
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setLoading({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signin',
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sign in failed');
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setLoading({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signout',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sign out failed');
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setLoading({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};