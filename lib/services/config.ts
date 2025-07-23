import { ClientApi } from './api/ssc';
import { Config, ConfigUpdateService } from '../types/config';
import { BaseResponse } from '../types/response';

export class ConfigService {
  private static readonly BASE_URL = '/config';

  static async getConfigs(): Promise<Config[]> {
    try {
      const response = await ClientApi.get<BaseResponse<Config[]>>(
        this.BASE_URL
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getConfig(key: string): Promise<Config> {
    try {
      const response = await ClientApi.get<BaseResponse<Config>>(
        `${this.BASE_URL}/${key}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
  
  static async updateConfigs(configData: ConfigUpdateService): Promise<Config[]> {
    try {
      const response = await ClientApi.put<BaseResponse<Config[]>>(
        this.BASE_URL,
        configData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateConfig(
    key: string,
    configData: {
      value: any;
      type: 'number' | 'string' | 'boolean' | 'object';
      description: string;
    }
  ): Promise<Config> {
    try {
      const response = await ClientApi.put<BaseResponse<Config>>(
        `${this.BASE_URL}/${key}`,
        configData
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
} 