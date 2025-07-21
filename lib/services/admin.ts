import { ClientApi } from '@services/api/ssc';
import {
  AdminSignInService,
  AdminLoginResponse,
  AdminCreateService,
  AdminUpdateService,
} from '@interfaces/services';
import { Admin } from '@interfaces/user';
import { BaseResponse, PaginatedResponse } from '@interfaces/response';

export const login = async (body: AdminSignInService) => {
  return await ClientApi.post<BaseResponse<AdminLoginResponse>>('admins/login', body);
};

export const logout = async () => {
  return await ClientApi.post<BaseResponse<any>>('admins/logout');
};

export class AdminService {
  private static readonly BASE_URL = '/admins';

  static async getAdmins(params: {
    search: string;
    limit: number;
  }): Promise<Admin[]> {
    try {
      const response = await ClientApi.get<BaseResponse<Admin[]>>(
        this.BASE_URL,
        {
          params: {
            search: params.search,
            limit: params.limit,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAdmin(id: string): Promise<Admin> {
    try {
      const response = await ClientApi.get<BaseResponse<Admin>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createAdmin(
    adminData: AdminCreateService
  ): Promise<BaseResponse<Admin>> {
    try {
      const response = await ClientApi.post<BaseResponse<Admin>>(
        this.BASE_URL,
        adminData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateAdmin(
    id: string,
    adminData: AdminUpdateService
  ): Promise<BaseResponse<Admin>> {
    try {
      const response = await ClientApi.put<BaseResponse<Admin>>(
        `${this.BASE_URL}/${id}`,
        adminData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAdmin(id: string): Promise<BaseResponse<Admin>> {
    try {
      const response = await ClientApi.delete<BaseResponse<Admin>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
