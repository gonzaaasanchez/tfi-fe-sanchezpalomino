import { ClientApi } from './api/ssc';
import { Reservation } from '../types/reservation';
import { BaseResponse, PaginatedResponse } from '../types/response';

export class ReservationService {
  private static readonly BASE_URL = '/reservations/admin';
  static async getReservations(params: {
    search: string;
    limit: number;
    page?: number;
    status?: string;
    userId?: string;
    caregiverId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<BaseResponse<PaginatedResponse<Reservation[]>>> {
    try {
      const response = await ClientApi.get<
        BaseResponse<PaginatedResponse<Reservation[]>>
      >(`${this.BASE_URL}/all`, {
        params: {
          search: params.search,
          limit: params.limit,
          page: params.page || 1,
          status: params.status,
          userId: params.userId,
          caregiverId: params.caregiverId,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getReservation(id: string): Promise<Reservation> {
    try {
      const response = await ClientApi.get<
        BaseResponse<{ reservation: Reservation }>
      >(`${this.BASE_URL}/${id}`);
      return response.data.data.reservation;
    } catch (error) {
      throw error;
    }
  }
}
