import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UserService } from '../services/user';
import { useCustomToast } from './use-custom-toast';
import { User } from '../types/user';
import { 
  UserCreateService, 
  UserUpdateService,
  UserGetAllService,
  UserGetByIdService
} from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';
import { AxiosError } from 'axios';

export function useGetUsers(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');

  const { data, isPending } = useQuery<UserGetAllService, AxiosError>({
    queryKey: ['/users', search],
    queryFn: () =>
      UserService.getUsers({ search, limit: params?.limit || DEFAULT_PARAM_LIMIT }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000
  });

  return { users: data?.data?.items as User[], search, setSearch, isPending };
}

export function useGetUser({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery<UserGetByIdService, AxiosError>({
    queryKey: [`/users/${id}`],
    queryFn: () => UserService.getUser(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id
  });

  return { user: data?.data as User | undefined, isPending };
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (userData: UserCreateService) => UserService.createUser(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear el usuario';
      errorToast(message);
    },
  });
};

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (userData: UserUpdateService) => UserService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/users/${id}`]
      });
      queryClient.invalidateQueries({ queryKey: ['/users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      errorToast(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['/users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar el usuario';
      errorToast(message);
    },
  });
}; 