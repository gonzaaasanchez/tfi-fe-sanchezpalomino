import { ClientApi } from './api/ssc';
import { RoleCreateService, RoleUpdateService } from '../types/services';
import { Role } from '../types/role';
import { BaseResponse, PaginatedResponse } from '../types/response';

export class RoleService {
  private static readonly BASE_URL = '/roles';

  static async getRoles(params: {
    search: string;
    limit: number;
  }): Promise<BaseResponse<Role[]>> {
    try {
      const response = await ClientApi.get<BaseResponse<Role[]>>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getRole(id: string): Promise<Role> {
    try {
      const response = await ClientApi.get<BaseResponse<Role>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createRole(
    roleData: RoleCreateService
  ): Promise<BaseResponse<Role>> {
    try {
      const response = await ClientApi.post<BaseResponse<Role>>(
        this.BASE_URL,
        roleData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateRole(
    id: string,
    roleData: RoleUpdateService
  ): Promise<BaseResponse<Role>> {
    try {
      const response = await ClientApi.put<BaseResponse<Role>>(
        `${this.BASE_URL}/${id}`,
        roleData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteRole(id: string): Promise<BaseResponse<Role>> {
    try {
      const response = await ClientApi.delete<BaseResponse<Role>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
