import { NextAuthOptions } from 'next-auth';
//import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
//import { env } from '@/app/env.mjs';
import { serverInstance } from '@/app/lib/axios'

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
                //role: user.role,
            }
        }
        // Return previous token if the access token has not expired yet
        return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user = {
                id: token.userId,
                email: token.email || '',
                //role: token.role,
                // first_name: token.first_name || '',
                // last_name: token.last_name || '',
            };
            session.accessToken = token.accessToken;
            session.provider = token.provider;
        }
        return session;
    }
},
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};