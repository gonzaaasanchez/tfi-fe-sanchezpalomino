import { ClientApi } from './api/ssc';
import { PetTypeCreateService, PetTypeUpdateService } from '../types/services';
import { PetType } from '../types/petType';
import { BaseResponse, PaginatedResponse } from '../types/response';

export class PetTypeService {
  private static readonly BASE_URL = '/pet-types';

  static async getPetTypes(params: {
    search: string;
    limit: number;
    page?: number;
  }): Promise<PaginatedResponse<PetType>> {
    try {
      const response = await ClientApi.get<BaseResponse<PaginatedResponse<PetType>>>(
        this.BASE_URL,
        {
          params: {
            search: params.search,
            limit: params.limit,
            page: params.page || 1,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getPetType(id: string): Promise<PetType> {
    try {
      const response = await ClientApi.get<BaseResponse<PetType>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createPetType(
    petTypeData: PetTypeCreateService
  ): Promise<PetType> {
    try {
      const response = await ClientApi.post<BaseResponse<PetType>>(
        this.BASE_URL,
        petTypeData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async updatePetType(
    id: string,
    petTypeData: PetTypeUpdateService
  ): Promise<PetType> {
    try {
      const response = await ClientApi.put<BaseResponse<PetType>>(
        `${this.BASE_URL}/${id}`,
        petTypeData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async deletePetType(id: string): Promise<BaseResponse<PetType>> {
    try {
      const response = await ClientApi.delete<BaseResponse<PetType>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
