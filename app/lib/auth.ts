import { NextAuthOptions } from 'next-auth';
//import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { serverInstance } from '@/app/lib/axios';



import { env } from '@/app/env.mjs';
import { refreshToken } from '../utils/authHelpers';


export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          const response = await serverInstance.post(
            `${env.API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.status === 200 && response.data) {
            console.log('Authentication successful', response.data);
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: `${response.data.user.first_name} ${response.data.user.last_name}`,
              role: response.data.user.role,
              first_name: response.data.user.first_name,
              last_name: response.data.user.last_name,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              expires_at: response.data.expires_in,
              message: response.data.message,
            };
          }

          return null;
        } catch (error: unknown) {
          console.log('Authentication error', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userId: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          provider: account.provider,
          role: user.role,
          accessTokenExpires: Date.now() + (user.expires_at * 1000),
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        };
      }
      // Return previous token if the access token has not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      // Token expired, refresh it
      console.log('Token expired, attempting refresh');
      return await refreshToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.userId,
          email: token.email ?? '',
          name: token.name ?? '',
          role: token.role,
          first_name: (token.first_name as string) ?? '',
          last_name: (token.last_name as string) ?? '',
        };
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        session.error = token.error;
      }

      console.log('Session after modification:', {
        ...session,
        accessToken: '***',
      });

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    signOut: async ({ session, token }) => {
      // Perform any cleanup like invalidating tokens on your backend
      console.log('signOut', session, token);
      try {
        await fetch(`${env.API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', { code, metadata });
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', { code, metadata });
    },
  },
};
