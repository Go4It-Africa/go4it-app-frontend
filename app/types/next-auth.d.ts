// eslint-disable-next-line
import NextAuth from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    accessToken?: string
    refreshToken?: string
    provider?: string
    role?: 'club_admin' | 'super_admin' | 'tournament_organizer';
    error?: string;
    accessTokenExpires?: number;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    provider?: string
    user: {
        id: string
        email: string
        name?: string
        first_name?: string
        last_name?: string
        role?: 'club_admin' | 'super_admin' | 'tournament_organizer';
    }
    error?: string;
  }
  interface User {
    id: string
    accessToken?: string
    refreshToken?: string
    name?: string
    first_name?: string
    last_name?: string
    email?: string
    role?: 'club_admin' | 'super_admin' | 'tournament_organizer';
    expires_at: number;
  }
}

// interface Decoded {
//   exp: number;
//   iat: number;
//   auth_time: number;
//   jti: string;
//   iss: string;
//   aud: string;
//   sub: string;
//   typ: string;
//   azp: string;
//   session_state: string;
//   acr: string;
//   realm_access: RealmAccess;
//   resource_access: ResourceAccess;
//   scope: string;
//   sid: string;
//   soc_tenants: string[];
//   email_verified: boolean;
//   soc_roles: string[];
//   name: string;
//   preferred_username: string;
//   given_name: string;
//   family_name: string;
// }

// export interface RealmAccess {
//   roles: string[];
// }

// export interface ResourceAccess {
//   account: Account;
// }

// export interface Account {
//   roles: string[];
// }
