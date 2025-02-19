import { NextAuthOptions } from 'next-auth';
//import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
//import { env } from '@/app/env.mjs';
import { serverInstance } from '@/app/lib/axios'

import { JWT } from 'next-auth/jwt';


async function refreshToken(token: JWT): Promise<JWT> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.refreshToken}`,
        },
      });
  
      const refreshedTokens = await response.json();
  
      if (!response.ok) {
        throw refreshedTokens;
      }
  
      return {
        ...token,
        accessToken: refreshedTokens.accessToken,
        accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
        refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      };
    } catch (error) {
        console.log('error', error);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }
  }

export const authOptions: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: env.AUTH_GOOGLE_CLIENT_ID,
    //   clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials')
        }
    
        try {
            const response = await serverInstance.post(`${process.env.API_URL}/auth/login`, {
                email: credentials.email,
                password: credentials.password
            })

            if (response.status === 200 && response.data) {
                return {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: {
                        id: response.data.user.id,
                        email: response.data.user.email,
                        first_name: response.data.user.first_name,
                        last_name: response.data.user.last_name,
                        role: response.data.user.role,
                    },
                    message: response.data.message,
                }
            }
    
            return null
        } catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : 'Authentication failed')
        }
    }
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
                provider: account.provider,
                role: user.role,
                accessTokenExpires: Date.now() + 60 * 60 * 1000,
            }
        }
        // Return previous token if the access token has not expired
        if (Date.now() < (token.accessTokenExpires as number)) {
            return token;
        }

        // Access token has expired, refresh it
        return refreshToken(token);
    },
    async session({ session, token }) {
        if (token.error) {
            // Handle token error - typically by signing out the user
            throw new Error('Invalid token');
        }

        if (token) {
            session.user = {
                id: token.userId,
                email: token.email || '',
                role: token.role,
                // first_name: token.first_name || '',
                // last_name: token.last_name || '',
            };
            session.accessToken = token.accessToken;
            session.provider = token.provider;
        }

        
        return session;
    }
},
cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
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
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};