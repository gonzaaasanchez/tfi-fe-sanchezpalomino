import { User } from './user';
import { Pet } from './pet';
import { Address } from './address';

export type CareLocation = 'pet_home' | 'caregiver_home';

export type ReservationStatus =
  | 'payment_pending'
  | 'payment_rejected'
  | 'waiting_acceptance'
  | 'confirmed'
  | 'started'
  | 'finished'
  | 'cancelledOwner'
  | 'cancelledCaregiver'
  | 'rejected';

export interface Reservation {
  id?: string;
  startDate: string;
  endDate: string;
  careLocation: CareLocation;
  address: Address;
  user: User;
  caregiver: User;
  pets: Pet[];
  visitsCount?: number;
  totalPrice: string;
  commission: string;
  totalOwner: string;
  totalCaregiver: string;
  distance?: number;
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}
