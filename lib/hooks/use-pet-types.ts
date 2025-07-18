import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PetTypeService } from '../services/petTypes';
import { useCustomToast } from './use-custom-toast';
import { PetType } from '../types/petType';
import { 
  PetTypeCreateService, 
  PetTypeUpdateService
} from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';
import { PaginatedResponse } from '../types/response';

export function useGetPetTypes(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');
  const [currentPage, setCurrentPage] = useState<number>(params?.page || 1);

  const { data, isPending } = useQuery<PaginatedResponse<PetType>>({
    queryKey: ['/pet-types', search, currentPage],
    queryFn: () =>
      PetTypeService.getPetTypes({ 
        search, 
        limit: params?.limit || DEFAULT_PARAM_LIMIT,
        page: currentPage
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000
  });

  return { 
    petTypes: data?.items, 
    pagination: data?.pagination,
    search, 
    setSearch, 
    currentPage,
    setCurrentPage,
    isPending 
  };
}

export function useGetPetType({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery({
    queryKey: [`/pet-types/${id}`],
    queryFn: () => PetTypeService.getPetType(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id
  });

  return { petType: data as PetType | undefined, isPending };
}

export const useCreatePetType = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.petTypes');

  return useMutation({
    mutationFn: (petTypeData: PetTypeCreateService) => PetTypeService.createPetType(petTypeData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/pet-types'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.createError');
      errorToast(message);
    },
  });
};

export function useUpdatePetType(id: string) {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.petTypes');

  return useMutation({
    mutationFn: (petTypeData: PetTypeUpdateService) => PetTypeService.updatePetType(id, petTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/pet-types/${id}`]
      });
      queryClient.invalidateQueries({ queryKey: ['/pet-types'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.updateError');
      errorToast(message);
    },
  });
};

export const useDeletePetType = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.petTypes');

  return useMutation({
    mutationFn: (id: string) => PetTypeService.deletePetType(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['/pet-types'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.deleteError');
      errorToast(message);
    },
  });
};
