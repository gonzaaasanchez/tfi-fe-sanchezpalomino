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
      case 'pending':
        return { label: getLabel('pending'), color: 'orange' };
    // case 'waiting_acceptance':
    //   return { label: getLabel('waiting_acceptance'), color: 'orange' };
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

export interface PermissionChange {
  module: string;
  action: string;
  oldValue: boolean;
  newValue: boolean;
  changeType: 'enabled' | 'disabled';
}

export function detectPermissionChanges(oldPermissions: any, newPermissions: any): PermissionChange[] {
  const changes: PermissionChange[] = [];
  
  // Iterar sobre todos los módulos
  for (const moduleName in oldPermissions) {
    const oldModule = oldPermissions[moduleName];
    const newModule = newPermissions[moduleName];
    
    // Si el módulo no existe en el nuevo objeto, saltar
    if (!newModule) continue;
    
    // Iterar sobre todas las acciones del módulo
    for (const actionName in oldModule) {
      const oldValue = oldModule[actionName];
      const newValue = newModule[actionName];
      
      // Si la acción no existe en el nuevo módulo, saltar
      if (newValue === undefined) continue;
      
      // Si los valores son diferentes, registrar el cambio
      if (oldValue !== newValue) {
        changes.push({
          module: moduleName,
          action: actionName,
          oldValue,
          newValue,
          changeType: newValue ? 'enabled' : 'disabled'
        });
      }
    }
  }
  
  return changes;
}
