import { ClientApi } from './api/ssc';
import { PaginatedResponse } from '../types/response';
import { SessionAudit } from '../types/sessionAudit';

export const SessionsService = {
  getUserSessions: async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<SessionAudit>> => {
    const response = await ClientApi.get<{ data: PaginatedResponse<SessionAudit> }>(
      `/audit/sessions/${userId}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },
  
  getAdminSessions: async (
    adminId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<SessionAudit>> => {
    const response = await ClientApi.get<{ data: PaginatedResponse<SessionAudit> }>(
      `/audit/sessions/${adminId}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },
};
