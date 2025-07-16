import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PetCharacteristicService } from '../services/petCharacteristic';
import { useCustomToast } from './use-custom-toast';
import { PetCharacteristic } from '../types/petCharacteristic';
import { 
  PetCharacteristicCreateService, 
  PetCharacteristicUpdateService
} from '../types/services';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';

export function useGetPetCharacteristics(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');
  const [currentPage, setCurrentPage] = useState<number>(params?.page || 1);

  const { data, isPending } = useQuery({
    queryKey: ['/pet-characteristics', search, currentPage],
    queryFn: () =>
      PetCharacteristicService.getPetCharacteristics({ 
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
    petCharacteristics: data?.items as PetCharacteristic[], 
    pagination: data?.pagination,
    search, 
    setSearch, 
    currentPage,
    setCurrentPage,
    isPending 
  };
}

export function useGetPetCharacteristic({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery({
    queryKey: [`/pet-characteristics/${id}`],
    queryFn: () => PetCharacteristicService.getPetCharacteristic(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id
  });

  return { petCharacteristic: data as PetCharacteristic | undefined, isPending };
}

export const useCreatePetCharacteristic = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (petCharacteristicData: PetCharacteristicCreateService) => PetCharacteristicService.createPetCharacteristic(petCharacteristicData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/pet-characteristics'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear la característica de mascota';
      errorToast(message);
    },
  });
};

export function useUpdatePetCharacteristic(id: string) {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (petCharacteristicData: PetCharacteristicUpdateService) => PetCharacteristicService.updatePetCharacteristic(id, petCharacteristicData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/pet-characteristics/${id}`]
      });
      queryClient.invalidateQueries({ queryKey: ['/pet-characteristics'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      errorToast(message);
    },
  });
};

export const useDeletePetCharacteristic = () => {
  const queryClient = useQueryClient();
  const { errorToast } = useCustomToast();

  return useMutation({
    mutationFn: (id: string) => PetCharacteristicService.deletePetCharacteristic(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['/pet-characteristics'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar la característica de mascota';
      errorToast(message);
    },
  });
}; 