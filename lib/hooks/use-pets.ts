import { useQuery } from '@tanstack/react-query';
import { PetService } from '../services/pet';

export const useGetPets = (params: any = {}) => {
  return useQuery({
    queryKey: ['pets', params],
    queryFn: () => PetService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPet = ({
  id,
  enabled = true,
}: {
  id: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['pet', id],
    queryFn: () => PetService.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserPets = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['user-pets', userId, page, limit],
    queryFn: () => PetService.getByUserId(userId, { page, limit }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
