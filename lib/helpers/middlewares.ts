import { ServerResponse, IncomingMessage } from 'http';
import { getServerSession } from 'next-auth';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { authOptions } from 'pages/api/auth/[...nextauth]';

type Req = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

type Res = ServerResponse<IncomingMessage>;

export const handlePublicRoute = async (req: Req, res: Res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session?.user) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    };
  }
};

export const handlePrivateRoute = async (req: Req, res: Res, path?: string) => {
  const session = await getServerSession(req, res, authOptions);
  
  // If no session, redirect to login
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    };
  }

  // If no path provided, just check authentication
  if (!path) {
    return null;
  }

  // Check specific permissions for certain routes
  const userPermissions = session.user?.role?.permissions || {};
  const isSuperAdmin = session.user?.role?.name === 'superadmin';

  // Route to module and action mapping
  const routePermissions: Record<string, { module: string; action: string }> = {
    '/admins': { module: 'admins', action: 'getAll' },
    '/roles': { module: 'roles', action: 'getAll' },
    '/users': { module: 'users', action: 'getAll' },
    '/pets': { module: 'pets', action: 'getAll' },
    '/reservations': { module: 'reservations', action: 'getAll' },
    '/reviews': { module: 'reviews', action: 'getAll' },
    '/logs': { module: 'logs', action: 'getAll' },
  };

  const requiredPermission = routePermissions[path];

  if (requiredPermission) {
    const { module, action } = requiredPermission;

    // Super admin can access everything
    if (isSuperAdmin) {
      return null;
    }

    // Check specific permissions
    const hasPermission = userPermissions[module]?.[action] === true;

    if (!hasPermission) {
      // Redirect to dashboard if no permissions
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      };
    }
  }

  return null;
};