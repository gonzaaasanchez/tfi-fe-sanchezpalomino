import { ClientApi } from './api/ssc';
import { UserCreateService, UserUpdateService } from '../types/services';
import { User } from '../types/user';
import { BaseResponse, PaginatedResponse } from '../types/response';

export class UserService {
  private static readonly BASE_URL = '/users';

  static async getUsers(params: {
    search: string;
    limit: number;
    page?: number;
  }): Promise<PaginatedResponse<User>> {
    try {
      const response = await ClientApi.get<{
        success: boolean;
        data: PaginatedResponse<User>;
        message?: string;
      }>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit,
          page: params.page || 1,
        },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUser(id: string): Promise<User> {
    try {
      const response = await ClientApi.get<BaseResponse<User>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userData: UserCreateService): Promise<User> {
    try {
      const response = await ClientApi.post<BaseResponse<User>>(
        this.BASE_URL,
        userData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(
    id: string,
    userData: UserUpdateService
  ): Promise<User> {
    try {
      const response = await ClientApi.put<BaseResponse<User>>(
        `${this.BASE_URL}/${id}`,
        userData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<BaseResponse<User>> {
    try {
      const response = await ClientApi.delete<BaseResponse<User>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCaregivers(params: {
    search: string;
    limit: number;
    page?: number;
  }): Promise<PaginatedResponse<User>> {
    try {
      const response = await ClientApi.get<{
        success: boolean;
        data: PaginatedResponse<User>;
        message?: string;
      }>(`${this.BASE_URL}/caregivers`, {
        params: {
          search: params.search,
          limit: params.limit,
          page: params.page || 1,
        },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}
