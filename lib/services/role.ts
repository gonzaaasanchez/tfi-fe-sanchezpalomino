import { ClientApi } from './api/ssc';
import {
  RoleGetAllService,
  RoleGetByIdService,
  RoleCreateService,
  RoleUpdateService,
  RoleDeleteService,
} from '../types/services';
import {
  Role
} from '../types/role';
import { PaginatedResponse } from '../types/response';

export class RoleService {
  private static readonly BASE_URL = '/roles';

  static async getRoles(params: { search: string; limit: number }): Promise<PaginatedResponse<Role>> {
    try {
      const response = await ClientApi.get<RoleGetAllService>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit
        }
      });
      
      return {
        data: response.data.data as Role[],
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

  static async getRole(id: string): Promise<Role> {
    try {
      const response = await ClientApi.get<RoleGetByIdService>(`${this.BASE_URL}/${id}`);
      return response.data.data as Role;
    } catch (error) {
      throw error;
    }
  }

  static async createRole(roleData: RoleCreateService): Promise<RoleGetByIdService> {
    try {
      const response = await ClientApi.post<RoleGetByIdService>(this.BASE_URL, roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  static async updateRole(id: string, roleData: RoleUpdateService): Promise<RoleGetByIdService> {
    try {
      const response = await ClientApi.put<RoleGetByIdService>(`${this.BASE_URL}/${id}`, roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteRole(id: string): Promise<RoleDeleteService> {
    try {
      const response = await ClientApi.delete<RoleDeleteService>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}