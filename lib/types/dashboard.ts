export interface PetTypeData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  users?: number;
  reservations?: number;
}

export interface RevenueData {
  category: string;
  revenue: number;
  color: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalReservations: number;
  totalPets: number;
  usersGrowth: number;
  reservationsGrowth: number;
  petsGrowth: number;
}

export interface DashboardData {
  stats: DashboardStats;
  petTypes: PetTypeData[];
  newUsers: MonthlyData[];
  reservations: MonthlyData[];
  revenue: RevenueData[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
} 