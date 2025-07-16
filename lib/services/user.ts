import { ClientApi } from './api/ssc';
import { 
  UserGetAllService, 
  UserGetByIdService, 
  UserCreateService, 
  UserUpdateService,
  UserDeleteService 
} from '../types/services';
import { User } from '../types/user';
import { PaginatedResponse } from '../types/response';

export class UserService {
  private static readonly BASE_URL = '/users';

  static async getUsers(params: { search: string; limit: number; page?: number }): Promise<PaginatedResponse<User>> {
    try {
      const response = await ClientApi.get<UserGetAllService>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit,
          page: params.page || 1
        }
      });
      
      return {
        data: response.data.data.items as User[],
        pagination: {
          page: response.data.data.pagination.page,
          pageCount: response.data.data.pagination.totalPages,
          pageSize: response.data.data.pagination.limit,
          total: response.data.data.pagination.total
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUser(id: string): Promise<User> {
    try {
      const response = await ClientApi.get<UserGetByIdService>(`${this.BASE_URL}/${id}`);
      return response.data.data as User;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userData: UserCreateService): Promise<User> {
    try {
      const response = await ClientApi.post<UserGetByIdService>(this.BASE_URL, userData);
      return response.data.data as User;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id: string, userData: UserUpdateService): Promise<User> {
    try {
      const response = await ClientApi.put<UserGetByIdService>(`${this.BASE_URL}/${id}`, userData);
      return response.data.data as User;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<UserDeleteService> {
    try {
      const response = await ClientApi.delete<UserDeleteService>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
} 