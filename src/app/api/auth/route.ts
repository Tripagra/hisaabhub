import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().min(10),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'signup': {
        const validatedData = signUpSchema.parse(data);
        
        const { data: authData, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              name: validatedData.name,
              phone: validatedData.phone,
            },
          },
        });

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }

        // Create user profile
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: validatedData.email,
              name: validatedData.name,
              phone: validatedData.phone,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        return NextResponse.json({
          success: true,
          data: authData,
        });
      }

      case 'signin': {
        const validatedData = signInSchema.parse(data);
        
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: authData,
        });
      }

      case 'signout': {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}