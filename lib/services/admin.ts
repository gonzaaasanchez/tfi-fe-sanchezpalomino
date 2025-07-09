import { ClientApi } from '@services/api/ssc';
import { 
  AdminSignInService, 
  AdminLoginResponse,
  AdminGetAllService,
  AdminGetByIdService,
  AdminCreateService,
  AdminUpdateService,
  AdminDeleteService
} from '@interfaces/services';
import { Admin } from '@interfaces/user';
import { PaginatedResponse } from '@interfaces/response';

export const login = async (body: AdminSignInService) => {
  return await ClientApi.post<AdminLoginResponse>('admins/login', body);
};

export class AdminService {
  private static readonly BASE_URL = '/admins';

  static async getAdmins(params: { search: string; limit: number }): Promise<PaginatedResponse<Admin>> {
    try {
      const response = await ClientApi.get<AdminGetAllService>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit
        }
      });
      
      return {
        data: response.data.data as Admin[],
        pagination: response.data.pagination || {
          page: 1,
          pageCount: 1,
          pageSize: params.limit,
          total: response.data.data.length
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAdmin(id: string): Promise<Admin> {
    try {
      const response = await ClientApi.get<AdminGetByIdService>(`${this.BASE_URL}/${id}`);
      return response.data.data as Admin;
    } catch (error) {
      throw error;
    }
  }

  static async createAdmin(adminData: AdminCreateService): Promise<AdminGetByIdService> {
    try {
      const response = await ClientApi.post<AdminGetByIdService>(this.BASE_URL, adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateAdmin(id: string, adminData: AdminUpdateService): Promise<AdminGetByIdService> {
    try {
      const response = await ClientApi.put<AdminGetByIdService>(`${this.BASE_URL}/${id}`, adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAdmin(id: string): Promise<AdminDeleteService> {
    try {
      const response = await ClientApi.delete<AdminDeleteService>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}