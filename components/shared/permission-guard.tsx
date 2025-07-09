import { ReactNode } from 'react';
import { usePermissions } from '@hooks/use-permissions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface PermissionGuardProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  module,
  action,
  fallback = null,
  redirectTo
}) => {
  const { hasPermission, isSuperAdmin } = usePermissions();
  const router = useRouter();
  
  const hasAccess = isSuperAdmin() || hasPermission(module, action);
  
  useEffect(() => {
    if (!hasAccess && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}; 