import { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = {
  check: (req: NextRequest, limit: number = 100, windowMs: number = 60000) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const key = `${ip}:${req.nextUrl.pathname}`;
    
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: limit - 1 };
    }
    
    if (current.count >= limit) {
      return { allowed: false, remaining: 0 };
    }
    
    current.count++;
    return { allowed: true, remaining: limit - current.count };
  },
  
  cleanup: () => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
};

// Input sanitization
export const sanitize = {
  email: (email: string): string => {
    return email.toLowerCase().trim();
  },
  
  phone: (phone: string): string => {
    return phone.replace(/\D/g, '');
  },
  
  name: (name: string): string => {
    return name.trim().replace(/[<>]/g, '');
  },
  
  pan: (pan: string): string => {
    return pan.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
};

// Security headers
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// CSRF protection
export const csrfProtection = {
  generateToken: (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },
  
  validateToken: (token: string, sessionToken: string): boolean => {
    return token === sessionToken;
  }
};

// Content Security Policy
export const csp = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://vercel.live'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },
  
  toString(): string {
    return Object.entries(this.directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
  }
};

// Password validation
export const passwordValidation = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  
  validate: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < passwordValidation.minLength) {
      errors.push(`Password must be at least ${passwordValidation.minLength} characters long`);
    }
    
    if (passwordValidation.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (passwordValidation.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (passwordValidation.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (passwordValidation.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return { valid: errors.length === 0, errors };
  }
};