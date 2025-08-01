import { useSession } from 'next-auth/react';

export const usePermissions = () => {
  const { data: session } = useSession();
  
  const userPermissions = session?.user?.role?.permissions || {};
  
  const hasPermission = (module: string, action: string): boolean => {
    if (!userPermissions[module]) return false;
    return userPermissions[module][action] === true;
  };
  
  const canCreate = (module: string): boolean => hasPermission(module, 'create');
  const canRead = (module: string): boolean => hasPermission(module, 'read');
  const canUpdate = (module: string): boolean => hasPermission(module, 'update');
  const canDelete = (module: string): boolean => hasPermission(module, 'delete');
  const canGetAll = (module: string): boolean => hasPermission(module, 'getAll');
  // const canAdmin = (module: string): boolean => hasPermission(module, 'admin');
  
  const isSuperAdmin = (): boolean => {
    return session?.user?.role?.name === 'superadmin';
  };
  
  return {
    permissions: userPermissions,
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canGetAll,
    // canAdmin,
    isSuperAdmin,
    user: session?.user
  };
}; 