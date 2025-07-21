import { useQuery } from '@tanstack/react-query';
import { SessionsService } from '../services/sessions';

export const useGetUserSessions = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['sessions', userId, page, limit],
    queryFn: () => SessionsService.getUserSessions(userId, page, limit),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });
};

export const useGetAdminSessions = (adminId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['admin-sessions', adminId, page, limit],
    queryFn: () => SessionsService.getAdminSessions(adminId, page, limit),
    enabled: !!adminId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });
}; 