// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface ITRRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ServiceInquiry {
  id: string;
  service_name: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: 'pending' | 'contacted' | 'converted' | 'closed';
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface ITRFormData {
  name: string;
  email: string;
  phone: string;
  pan?: string;
}

export interface ServiceFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

// UI Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Environment Types
export interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_APP_ENV: 'development' | 'staging' | 'production';
  VITE_API_BASE_URL?: string;
  VITE_SENTRY_DSN?: string;
}