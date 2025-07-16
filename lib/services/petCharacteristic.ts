import { ClientApi } from './api/ssc';
import {
  PetCharacteristicCreateService,
  PetCharacteristicUpdateService,
} from '../types/services';
import { PetCharacteristic } from '../types/petCharacteristic';
import { BaseResponse, PaginatedResponse } from '../types/response';

export class PetCharacteristicService {
  private static readonly BASE_URL = '/pet-characteristics';

  static async getPetCharacteristics(params: {
    search: string;
    limit: number;
    page?: number;
  }): Promise<PaginatedResponse<PetCharacteristic>> {
    try {
      const response = await ClientApi.get<{
        success: boolean;
        message: string;
        data: PaginatedResponse<PetCharacteristic>;
      }>(
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

  static async getPetCharacteristic(id: string): Promise<PetCharacteristic> {
    try {
      const response = await ClientApi.get<BaseResponse<PetCharacteristic>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createPetCharacteristic(
    petCharacteristicData: PetCharacteristicCreateService
  ): Promise<PetCharacteristic> {
    try {
      const response = await ClientApi.post<BaseResponse<PetCharacteristic>>(
        this.BASE_URL,
        petCharacteristicData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async updatePetCharacteristic(
    id: string,
    petCharacteristicData: PetCharacteristicUpdateService
  ): Promise<PetCharacteristic> {
    try {
      const response = await ClientApi.put<BaseResponse<PetCharacteristic>>(
        `${this.BASE_URL}/${id}`,
        petCharacteristicData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async deletePetCharacteristic(
    id: string
  ): Promise<BaseResponse<PetCharacteristic>> {
    try {
      const response = await ClientApi.delete<BaseResponse<PetCharacteristic>>(
        `${this.BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
