import { ClientApi } from './api/ssc';
import { 
  PetTypeGetAllService, 
  PetTypeGetByIdService, 
  PetTypeCreateService, 
  PetTypeUpdateService,
  PetTypeDeleteService 
} from '../types/services';
import { PetType } from '../types/petType';
import { PaginatedResponse } from '../types/response';

export class PetTypeService {
  private static readonly BASE_URL = '/pet-types';

  static async getPetTypes(params: { search: string; limit: number; page?: number }): Promise<PaginatedResponse<PetType>> {
    try {
      const response = await ClientApi.get<PetTypeGetAllService>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit,
          page: params.page || 1
        }
      });
      
      return {
        data: response.data.data.items as PetType[],
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

  static async getPetType(id: string): Promise<PetType> {
    try {
      const response = await ClientApi.get<PetTypeGetByIdService>(`${this.BASE_URL}/${id}`);
      return response.data.data as PetType;
    } catch (error) {
      throw error;
    }
  }

  static async createPetType(petTypeData: PetTypeCreateService): Promise<PetType> {
    try {
      const response = await ClientApi.post<PetTypeGetByIdService>(this.BASE_URL, petTypeData);
      return response.data.data as PetType;
    } catch (error) {
      throw error;
    }
  }

  static async updatePetType(id: string, petTypeData: PetTypeUpdateService): Promise<PetType> {
    try {
      const response = await ClientApi.put<PetTypeGetByIdService>(`${this.BASE_URL}/${id}`, petTypeData);
      return response.data.data as PetType;
    } catch (error) {
      throw error;
    }
  }

  static async deletePetType(id: string): Promise<PetTypeDeleteService> {
    try {
      const response = await ClientApi.delete<PetTypeDeleteService>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
