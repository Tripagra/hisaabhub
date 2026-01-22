export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      itr_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          pan: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          pan?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          pan?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_inquiries: {
        Row: {
          id: string;
          service_name: string;
          name: string;
          email: string;
          phone: string;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_name: string;
          name: string;
          email: string;
          phone: string;
          message?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_name?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}