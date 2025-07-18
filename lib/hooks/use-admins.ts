import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdminService } from '../services/admin';
import { useCustomToast } from './use-custom-toast';
import { Admin } from '../types/user';
import { AdminCreateService, AdminUpdateService } from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';


export function useGetAdmins(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');

  const { data, isPending } = useQuery<Admin[]>({
    queryKey: ['/admins', search],
    queryFn: () =>
      AdminService.getAdmins({
        search,
        limit: params?.limit || DEFAULT_PARAM_LIMIT,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });

  return { admins: data, search, setSearch, isPending };
}

export function useGetAdmin({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery<Admin>({
    queryKey: [`/admins/${id}`],
    queryFn: () => AdminService.getAdmin(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id,
  });

  return { admin: data || null, isPending };
}

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.admins');

  return useMutation({
    mutationFn: (adminData: AdminCreateService) =>
      AdminService.createAdmin(adminData),
    onSuccess: (data) => {
      successToast(t('responses.createSuccess'));
      queryClient.invalidateQueries({ queryKey: ['/admins'] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t('responses.createError');
      errorToast(message);
    },
  });
};

export function useUpdateAdmin(id: string) {
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.admins');

  return useMutation({
    mutationFn: (adminData: AdminUpdateService) =>
      AdminService.updateAdmin(id, adminData),
    onSuccess: () => {
      successToast(t('responses.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [`/admins/${id}`],
      });
      queryClient.invalidateQueries({ queryKey: ['/admins'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.updateError');
      errorToast(message);
    },
  });
}

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.admins');

  return useMutation({
    mutationFn: (id: string) => AdminService.deleteAdmin(id),
    onSuccess: (data, id) => {
      successToast(t('responses.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['/admins'] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t('responses.deleteError');
      errorToast(message);
    },
  });
};
