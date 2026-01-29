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
      articles: {
        Row: {
          id: string;
          slug: string;
          keyword: string;
          summary: string;
          created_at: string;
          updated_at: string;
          published: boolean;
          views: number;
        };
        Insert: {
          id?: string;
          slug: string;
          keyword: string;
          summary: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
          views?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          keyword?: string;
          summary?: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
          views?: number;
        };
      };
      questions: {
        Row: {
          id: string;
          article_id: string;
          question_text: string;
          answer_text: string;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          question_text: string;
          answer_text: string;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          question_text?: string;
          answer_text?: string;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_article_views: {
        Args: { article_slug: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}