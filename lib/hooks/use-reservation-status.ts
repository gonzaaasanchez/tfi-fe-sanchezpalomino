import { useTranslations } from 'next-intl';
import { RESERVATION_STATUS_OPTIONS, getReservationStatusOptionsForSelect, getReservationStatusOption } from '../constants/reservation-status';

export const useReservationStatus = () => {
  const t = useTranslations('pages.reservations.index.status');

  const getStatusOptions = () => {
    return getReservationStatusOptionsForSelect((key) => t(key));
  };

  const getStatusOption = (value: string) => {
    return getReservationStatusOption(value);
  };

  const getStatusConfig = (status: string) => {
    const statusOption = getReservationStatusOption(status);
    
    if (statusOption) {
      return { 
        label: t(statusOption.value), 
        color: statusOption.color 
      };
    }
    
    return { label: status, color: 'gray' };
  };

  return {
    statusOptions: RESERVATION_STATUS_OPTIONS,
    getStatusOptions,
    getStatusOption,
    getStatusConfig
  };
}; 