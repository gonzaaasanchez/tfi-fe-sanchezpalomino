import NextAuth from 'next-auth';
import { User } from '@interfaces/user';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: {
        id: string;
        name: string;
        description?: string;
        permissions: Record<string, any>;
        isSystem?: boolean;
        createdAt?: string;
        updatedAt?: string;
      };
      token: string;
    };
  }

  /**
   * The shape of the JWT returned by the `jwt` callback
   */
  interface JWT {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: {
        id: string;
        name: string;
        description?: string;
        permissions: Record<string, any>;
        isSystem?: boolean;
        createdAt?: string;
        updatedAt?: string;
      };
      token: string;
    };
  }
}
