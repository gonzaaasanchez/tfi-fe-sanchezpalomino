export interface ReservationStatusOption {
  value: string;
  label: string;
  color: string;
}

export const RESERVATION_STATUS_OPTIONS: ReservationStatusOption[] = [
  // {
  //   value: 'pending',
  //   label: 'Pendiente',
  //   color: 'yellow'
  // },
  {
    value: 'waiting_acceptance',
    label: 'Esperando Aceptación',
    color: 'orange'
  },
  {
    value: 'confirmed',
    label: 'Confirmada',
    color: 'green'
  },
  {
    value: 'started',
    label: 'Iniciada',
    color: 'blue'
  },
  {
    value: 'finished',
    label: 'Finalizada',
    color: 'purple'
  },
  {
    value: 'rejected',
    label: 'Rechazada',
    color: 'red'
  },
  {
    value: 'cancelled_owner',
    label: 'Cancelada por Propietario',
    color: 'red'
  },
  {
    value: 'cancelled_caregiver',
    label: 'Cancelada por Cuidador',
    color: 'red'
  }
];

export const getReservationStatusOption = (value: string): ReservationStatusOption | undefined => {
  return RESERVATION_STATUS_OPTIONS.find(option => option.value === value);
};

export const getReservationStatusOptionsForSelect = (t?: (key: string) => string): { value: string; label: string }[] => {
  return RESERVATION_STATUS_OPTIONS.map(option => ({
    value: option.value,
    label: t ? t(option.value) : option.label
  }));
}; 