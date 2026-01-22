import { BaseService } from './base.service';
import type { ITRRequest, ITRFormData, ApiResponse } from '@/types';

class ITRService extends BaseService {
  constructor() {
    super('itr_requests');
  }

  async submitRequest(data: ITRFormData): Promise<ApiResponse<ITRRequest>> {
    return this.create<ITRRequest>({
      ...data,
      status: 'pending',
    });
  }

  async getRequestsByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.handlePaginatedRequest<ITRRequest>(
      this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1),
      page,
      limit
    );
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'processing' | 'completed' | 'rejected'
  ): Promise<ApiResponse<ITRRequest>> {
    return this.update<ITRRequest>(id, { status });
  }

  async searchRequests(
    query: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.handlePaginatedRequest<ITRRequest>(
      this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,pan.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1),
      page,
      limit
    );
  }

  private get supabase() {
    // Import here to avoid circular dependency
    const { supabase } = require('@/lib/supabase');
    return supabase;
  }
}

export const itrService = new ITRService();