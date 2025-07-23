import { ClientApi } from './api/ssc';
import { Pet } from '../types/pet';
import { PaginatedResponse } from '../types/response';

export class PetService {
  static async getAll(params: any = {}): Promise<PaginatedResponse<Pet>> {
    const response = await ClientApi.get('/pets/admin/all', { params });
    return response.data.data;
  }

  static async getById(id: string): Promise<Pet> {
    const response = await ClientApi.get(`/pets/admin/${id}`);
    return response.data.data;
  }

  static async getByUserId(
    userId: string,
    params: any = {}
  ): Promise<PaginatedResponse<Pet>> {
    const response = await ClientApi.get(`/pets/admin/all`, { 
      params: { ...params, owner: userId } 
    });
    return response.data.data;
  }
}
