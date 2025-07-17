export const formatSegment = (segment: string) => {
  return segment
    .replace(/[-_/]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getReservationStatusConfig = (
  status: string,
  t?: (key: string) => string
) => {
  const getLabel = (key: string) => (t ? t(key) : key);

  switch (status) {
    case 'payment_pending':
      return { label: getLabel('payment_pending'), color: 'yellow' };
    case 'payment_rejected':
      return { label: getLabel('payment_rejected'), color: 'red' };
    case 'waiting_acceptance':
      return { label: getLabel('waiting_acceptance'), color: 'orange' };
    case 'confirmed':
      return { label: getLabel('confirmed'), color: 'green' };
    case 'started':
      return { label: getLabel('started'), color: 'blue' };
    case 'finished':
      return { label: getLabel('finished'), color: 'purple' };
    case 'cancelledOwner':
      return { label: getLabel('cancelledOwner'), color: 'red' };
    case 'cancelledCaregiver':
      return { label: getLabel('cancelledCaregiver'), color: 'red' };
    case 'rejected':
      return { label: getLabel('rejected'), color: 'red' };
    default:
      return { label: status, color: 'gray' };
  }
};
