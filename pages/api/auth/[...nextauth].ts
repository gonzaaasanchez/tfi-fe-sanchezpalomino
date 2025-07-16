import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@services/admin';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Sign In',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          const response = await login(credentials);
          const { data } = response;

          if (!data || !data.data || !data.data.admin || !data.data.token) {
            throw new Error('Invalid response format');
          }

          const { admin, token } = data.data;

          return {
            id: admin.id?.toString() || '',
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role,
            token: token,
          };
        } catch (error: any) {
          // Log the error for debugging
          console.error('Auth error:', error);

          // If it's an axios error with response data, throw a specific error
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }

          // For other errors, throw a generic error
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  session: {
    maxAge: 86400, // 1 day
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
          token: user.token,
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
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
};

export default NextAuth(authOptions);
