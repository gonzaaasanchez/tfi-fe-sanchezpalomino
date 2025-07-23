import { ClientApi } from './api/ssc';
import { BaseResponse } from '../types/response';
import { AdminSignInService, AdminLoginResponse } from '../types/services';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export class AuthService {
  static async login(body: AdminSignInService) {
    return await ClientApi.post<BaseResponse<AdminLoginResponse>>('admins/login', body);
  }

  static async logout() {
    return await ClientApi.post<BaseResponse<any>>('admins/logout');
  }

  static async forgotPassword(data: ForgotPasswordRequest): Promise<BaseResponse<any>> {
    try {
      const response = await ClientApi.post<BaseResponse<any>>('admins/forgot-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<BaseResponse<any>> {
    try {
      const response = await ClientApi.post<BaseResponse<any>>('admins/reset-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
} 