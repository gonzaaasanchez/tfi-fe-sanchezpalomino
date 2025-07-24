import { ClientApi } from './api/ssc';
import { DashboardData } from '../types/dashboard';
import { BaseResponse } from '../types/response';

export class DashboardService {
  private static readonly BASE_URL = '/dashboard';

  static async getDashboardStats(): Promise<DashboardData> {
    try {
      const response = await ClientApi.get<BaseResponse<DashboardData>>(
        `${this.BASE_URL}/stats`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
} 