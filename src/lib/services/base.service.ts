import { createSupabaseClient } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse } from '@/types';

export abstract class BaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async handleRequest<T>(
    request: Promise<any>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await request;
      
      if (error) {
        console.error(`${this.tableName} service error:`, error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(`${this.tableName} service error:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  protected async handlePaginatedRequest<T>(
    request: Promise<any>,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<T>> {
    try {
      const { data, error, count } = await request;
      
      if (error) {
        throw new Error(error.message);
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error(`${this.tableName} paginated service error:`, error);
      return {
        data: [],
        count: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  }

  async create<T>(data: Partial<T>): Promise<ApiResponse<T>> {
    const supabase = createSupabaseClient();
    const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single();
    
    if (error) {
      console.error(`${this.tableName} service error:`, error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: result as T,
      error: null,
      success: true,
    };
  }

  async getById<T>(id: string): Promise<ApiResponse<T>> {
    const supabase = createSupabaseClient();
    const { data: result, error } = await supabase.from(this.tableName).select('*').eq('id', id).single();
    
    if (error) {
      console.error(`${this.tableName} service error:`, error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: result as T,
      error: null,
      success: true,
    };
  }

  async update<T>(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const supabase = createSupabaseClient();
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`${this.tableName} service error:`, error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: result as T,
      error: null,
      success: true,
    };
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);
    
    if (error) {
      console.error(`${this.tableName} service error:`, error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: null,
      error: null,
      success: true,
    };
  }

  async getAll<T>(
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'created_at',
    ascending: boolean = false
  ): Promise<PaginatedResponse<T>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const supabase = createSupabaseClient();

    try {
      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .order(orderBy, { ascending })
        .range(from, to);
      
      if (error) {
        console.error(`${this.tableName} service error:`, error);
        return {
          data: [],
          count: 0,
          page,
          limit,
          totalPages: 0,
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: (data || []) as T[],
        count: total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error(`${this.tableName} service error:`, error);
      return {
        data: [],
        count: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  }
}