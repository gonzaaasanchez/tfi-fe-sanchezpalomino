import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ReservationService } from '../services/reservation';
import { Reservation } from '../types/reservation';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';

export function useGetReservations(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');
  const [currentPage, setCurrentPage] = useState<number>(params?.page || 1);
  const [userId, setUserId] = useState<string>('');
  const [caregiverId, setCaregiverId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['/reservations/admin/all', search, currentPage, userId, caregiverId, status, dateFrom, dateTo],
    queryFn: () => {
      return ReservationService.getReservations({
        search,
        limit: params?.limit || DEFAULT_PARAM_LIMIT,
        page: currentPage,
        userId: userId || undefined,
        caregiverId: caregiverId || undefined,
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });

  // Función para obtener todas las reservas (sin paginación) para exportar PDF
  const getAllReservationsForExport = async (): Promise<Reservation[]> => {
    try {
      const response = await ReservationService.getReservations({
        search,
        limit: 999999, // Límite muy alto para obtener todos los registros
        page: 1,
        userId: userId || undefined,
        caregiverId: caregiverId || undefined,
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      
      // Obtener los items y asegurar que sea un array
      const items = response.data.items;
      const result = (Array.isArray(items) ? items : []) as unknown as Reservation[];
      
      return result;
    } catch (error) {
      console.error('Error obteniendo todas las reservas para exportar:', error);
      return [];
    }
  };

  return {
    reservations: data?.data?.items || [],
    pagination: data?.data?.pagination,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    userId,
    setUserId,
    caregiverId,
    setCaregiverId,
    status,
    setStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isPending,
    getAllReservationsForExport,
  };
}

export function useGetReservation({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery({
    queryKey: [`/reservations/admin/${id}`],
    queryFn: () => ReservationService.getReservation(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 600,
    enabled: !!id,
  });

  return { reservation: data as Reservation | undefined, isPending };
}
