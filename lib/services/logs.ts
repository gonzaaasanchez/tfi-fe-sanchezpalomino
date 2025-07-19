import { ClientApi } from './api/ssc';
import { BaseResponse } from '../types/response';
import { Log } from '../types/log';

export const LogsService = {
  getEntityLogs: async (
    entityType: string,
    entityId: string
  ): Promise<BaseResponse<Log[]>> => {
    const response = await ClientApi.get<BaseResponse<Log[]>>(
      `/logs/${entityType}/${entityId}`
    );
    return response.data;
  },
};
