import { ClientApi } from './api/ssc';
import { ReservationReviews } from '../types/review';
import { BaseResponse } from '../types/response';

export class ReviewService {
  private static readonly BASE_URL = '/reservations';

  static async getReservationReviews(
    reservationId: string
  ): Promise<ReservationReviews> {
    try {
      const response = await ClientApi.get<BaseResponse<ReservationReviews>>(
        `${this.BASE_URL}/${reservationId}/reviews`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}
