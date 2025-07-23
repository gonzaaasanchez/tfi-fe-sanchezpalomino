import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ConfigService } from '../services/config';
import { useCustomToast } from './use-custom-toast';
import { Config, ConfigUpdateService } from '../types/config';

export function useGetConfigs() {
  const { data, isPending } = useQuery({
    queryKey: ['/config'],
    queryFn: () => ConfigService.getConfigs(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });

  return { configs: data as Config[] | undefined, isPending };
}

export function useGetConfig(key: string) {
  const { data, isPending } = useQuery({
    queryKey: [`/config/${key}`],
    queryFn: () => ConfigService.getConfig(key),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!key && key !== 'undefined',
  });

  return { config: data as Config | undefined, isPending };
}

export const useUpdateConfigs = () => {
  const queryClient = useQueryClient();
  const { errorToast, successToast } = useCustomToast();
  const t = useTranslations('lib.hooks.configs');

  return useMutation({
    mutationFn: (configData: ConfigUpdateService) =>
      ConfigService.updateConfigs(configData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/config'] });
      queryClient.invalidateQueries({ queryKey: ['/config/template'] });
      successToast(t('responses.updateSuccess'));
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t('responses.updateError');
      errorToast(message);
    },
  });
};

export const useUpdateConfig = (key: string) => {
  const queryClient = useQueryClient();
  const { errorToast, successToast } = useCustomToast();
  const t = useTranslations('lib.hooks.configs');

  return useMutation({
    mutationFn: (configData: {
      value: any;
      type: 'number' | 'string' | 'boolean' | 'object';
      description: string;
    }) => {
      if (!key || key === 'undefined') {
        throw new Error('Config key is required');
      }
      return ConfigService.updateConfig(key, configData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/config'] });
      queryClient.invalidateQueries({ queryKey: [`/config/${key}`] });
      successToast(t('responses.updateSuccess'));
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t('responses.updateError');
      errorToast(message);
    },
  });
}; 