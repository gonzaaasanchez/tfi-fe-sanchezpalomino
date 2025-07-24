import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services';
import { DashboardData } from '../types/dashboard';

export const useDashboard = () => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['/dashboard/stats'],
    queryFn: () => DashboardService.getDashboardStats(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 300000,
  });

  return {
    data: data as DashboardData | undefined,
    loading: isPending,
    error: error?.message || null,
    refetch,
  };
};
