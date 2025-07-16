import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PetTypeService } from '../services/petTypes';
import { useCustomToast } from './use-custom-toast';
import { PetType } from '../types/petType';
import { 
  PetTypeCreateService, 
  PetTypeUpdateService
} from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';

export function useGetPetTypes(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');
  const [currentPage, setCurrentPage] = useState<number>(params?.page || 1);

  const { data, isPending } = useQuery({
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
    petTypes: data?.data as PetType[], 
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

  return useMutation({
    mutationFn: (petTypeData: PetTypeCreateService) => PetTypeService.createPetType(petTypeData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/pet-types'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear el tipo de mascota';
      errorToast(message);
    },
  });
};

export function useUpdatePetType(id: string) {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (petTypeData: PetTypeUpdateService) => PetTypeService.updatePetType(id, petTypeData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/pet-types/${id}`]
      });
      queryClient.invalidateQueries({ queryKey: ['/pet-types'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      errorToast(message);
    },
  });
};

export const useDeletePetType = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (id: string) => PetTypeService.deletePetType(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['/pet-types'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar el tipo de mascota';
      errorToast(message);
    },
  });
};
