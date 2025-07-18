import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserService } from '../services/user';
import { useCustomToast } from './use-custom-toast';
import { User } from '../types/user';
import { UserCreateService, UserUpdateService } from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';

export function useGetUsers(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');
  const [currentPage, setCurrentPage] = useState<number>(params?.page || 1);

  const { data, isPending } = useQuery({
    queryKey: ['/users', search, currentPage],
    queryFn: () =>
      UserService.getUsers({
        search,
        limit: params?.limit || DEFAULT_PARAM_LIMIT,
        page: currentPage,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });

  return {
    users: data?.items as User[],
    pagination: data?.pagination,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    isPending,
  };
}

export function useGetUser({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery({
    queryKey: [`/users/${id}`],
    queryFn: () => UserService.getUser(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id,
  });

  return { user: data as User | undefined, isPending };
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.users');

  return useMutation({
    mutationFn: (userData: UserCreateService) =>
      UserService.createUser(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/users'] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t('responses.createError');
      errorToast(message);
    },
  });
};

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.users');

  return useMutation({
    mutationFn: (userData: UserUpdateService) =>
      UserService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/users/${id}`],
      });
      queryClient.invalidateQueries({ queryKey: ['/users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.updateError');
      errorToast(message);
    },
  });
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.users');

  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['/users'] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || t('responses.deleteError');
      errorToast(message);
    },
  });
};
