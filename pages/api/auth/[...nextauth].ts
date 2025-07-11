import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@services/admin';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    _id: string;
    name: string;
    description?: string;
    permissions: Record<string, any>;
    isSystem?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Sign In',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          const response = await login(credentials);
          const { data } = response;
          
          if (!data || !data.data || !data.data.admin || !data.data.token) {
            return null;
          }

          const { admin, token } = data.data;

          return { 
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role,
            token: token 
          };
        } catch (error: any) {
          return null;
        }
      }
    })
  ],
  session: {
    maxAge: 86400 // 1 day
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Save user and token in JWT
        token.user = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          token: user.token
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pass user from token to session
      if (token.user) {
        session.user = token.user;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
