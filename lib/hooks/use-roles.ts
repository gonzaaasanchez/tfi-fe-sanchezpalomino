import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { RoleService } from '../services/role';
import { useCustomToast } from './use-custom-toast';
import { Role } from '../types/role';
import { RoleCreateService, RoleUpdateService } from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';
import { BaseResponse } from '../types/response';

export function useGetRoles(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');

  const { data, isPending } = useQuery<BaseResponse<Role[]>>({
    queryKey: ['/roles'],
    queryFn: () =>
      RoleService.getRoles({
        search,
        limit: params?.limit || DEFAULT_PARAM_LIMIT,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });

  return { roles: data?.data, search, setSearch, isPending };
}

export function useGetRole({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery<Role>({
    queryKey: [`/roles/${id}`],
    queryFn: () => RoleService.getRole(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id,
  });

  return { role: data || null, isPending };
}

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (roleData: RoleCreateService) =>
      RoleService.createRole(roleData),
    onSuccess: (data) => {
      successToast('Rol creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['/roles'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear el rol';
      errorToast(message);
    },
  });
};

export function useUpdateRole(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: RoleUpdateService) =>
      RoleService.updateRole(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/roles/${id}`],
      });
      queryClient.invalidateQueries({ queryKey: ['/roles'] });
    },
  });
}

/**
 * Hook para eliminar un rol
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (id: string) => RoleService.deleteRole(id),
    onSuccess: (data, id) => {
      successToast('Rol eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['/roles'] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Error al eliminar el rol';
      errorToast(message);
    },
  });
};
