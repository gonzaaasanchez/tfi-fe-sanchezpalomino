import { Reservation } from './reservation';
import { User } from './user';

export interface Review {
  id: string;
  reviewer: User;
  reviewedUser: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReservationReviews {
  reservation: Reservation;
  reviews: {
    owner?: Review;
    caregiver?: Review;
  };
  summary: {
    hasOwnerReview: boolean;
    hasCaregiverReview: boolean;
  };
}

export interface GetReservationReviewsResponse {
  success: boolean;
  message: string;
  data: ReservationReviews;
}
