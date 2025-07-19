import { useQuery } from '@tanstack/react-query';
import { LogsService } from '../services/logs';

export const useGetEntityLogs = (entityType: string, entityId: string) => {
  return useQuery({
    queryKey: ['logs', entityType, entityId],
    queryFn: () => LogsService.getEntityLogs(entityType, entityId),
    enabled: !!entityType && !!entityId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });
};
