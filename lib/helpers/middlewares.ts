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

export const handlePrivateRoute = async (req: Req, res: Res) => {
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

  return null;
};

export const handlePermission = async (req: Req, res: Res, path: string) => {
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

  const userPermissions = session.user?.role?.permissions || {};
  const isSuperAdmin = session.user?.role?.name === 'superadmin';

  // Super admin can access everything
  if (isSuperAdmin) {
    return null;
  }

  // Parse path to determine module and action
  const pathSegments = path.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null;
  }

  const moduleName = pathSegments[0];
  let action = 'getAll'; // Default action

  // Determine action based on path pattern
  if (pathSegments.length === 1) {
    // /:modulo -> getAll
    action = 'getAll';
  } else if (pathSegments.length === 2) {
    if (pathSegments[1] === 'add') {
      // /:modulo/add -> create
      action = 'create';
    } else {
      // /:modulo/:id -> read (assuming it's a detail view)
      action = 'read';
    }
  } else if (pathSegments.length === 3) {
    if (pathSegments[2] === 'detail') {
      // /:modulo/:id/detail -> read
      action = 'read';
    } else if (pathSegments[2] === 'edit') {
      // /:modulo/:id/edit -> edit
      action = 'edit';
    }
  }

  // Check if user has the required permission
  const hasPermission = userPermissions[moduleName]?.[action] === true;

  if (!hasPermission) {
    // Redirect to dashboard if no permissions
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    };
  }

  return null;
};