import { useQuery } from '@tanstack/react-query';
import { ReviewService } from '../services/review';
import { ReservationReviews } from '../types/review';

interface UseGetReservationReviewsParams {
  reservationId: string;
  enabled?: boolean;
}

export const useGetReservationReviews = ({
  reservationId,
  enabled = true,
}: UseGetReservationReviewsParams) => {
  return useQuery<ReservationReviews>({
    queryKey: ['reservation-reviews', reservationId],
    queryFn: () => ReviewService.getReservationReviews(reservationId),
    enabled: enabled && !!reservationId,
  });
};
