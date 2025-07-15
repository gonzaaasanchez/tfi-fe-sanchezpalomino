import { ClientApi } from './api/ssc';
import { 
  UserGetAllService, 
  UserGetByIdService, 
  UserCreateService, 
  UserUpdateService,
  UserDeleteService 
} from '../types/services';

export const UserService = {
  getUsers: async (params?: { search?: string; limit?: number }): Promise<UserGetAllService> => {
    const response = await ClientApi.get('/users', { params });
    return response.data;
  },

  getUser: async (id: string): Promise<UserGetByIdService> => {
    const response = await ClientApi.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: UserCreateService): Promise<UserGetByIdService> => {
    const response = await ClientApi.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UserUpdateService): Promise<UserGetByIdService> => {
    const response = await ClientApi.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<UserDeleteService> => {
    const response = await ClientApi.delete(`/users/${id}`);
    return response.data;
  }
}; 