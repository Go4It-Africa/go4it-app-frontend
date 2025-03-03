import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isTokenExpired } from './app/utils/authHelpers';

const AUTH_PAGES = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
const PUBLIC_PATHS = ['/landing'];

const ROLE_ACCESS: Record<string, string[]> = {
  club_admin: [
    '/workspace/clubs',
    '/dashboard',
    '/players',
    '/tournaments',
    '/club',
  ],
  super_admin: ['/*'],
  tournament_organizer: [
    '/workspace/tournaments',
    '/dashboard',
    '/tournaments',
  ],
} as const;

const DEFAULT_ROUTES = {
  club_admin: '/workspace/clubs',
  super_admin: '/dashboard',
  tournament_organizer: '/workspace/tournaments',
} as const;

export async function middleware(request: NextRequest) {
  try {
    console.log('🚀 Middleware executing for:', request.nextUrl.pathname);

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log('🔑 Token found:', !!token, 'Role:', token?.role);

    const { pathname } = request.nextUrl;

    // Check if the path is public
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // For auth pages
    if (AUTH_PAGES.includes(pathname)) {
      if (token?.role && !isTokenExpired(token)) {
        return NextResponse.redirect(
          new URL(
            DEFAULT_ROUTES[token.role as keyof typeof DEFAULT_ROUTES],
            request.url
          )
        );
      }
      return NextResponse.next();
    }

    //  // Check token expiration
    if (
      !token || isTokenExpired(token)
    ) {
      console.log('Middleware: Token missing or expired', {
        hasToken: !!token,
        tokenExpiry: token?.accessTokenExpires ? new Date(token.accessTokenExpires as number).toISOString() : 'none',
        currentTime: new Date().toISOString()
      });
      // Clear session if token is expired
      if(token && isTokenExpired(token)) {
        const response = NextResponse.redirect(
          new URL('/auth/login', request.url)
        );
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('__Secure-next-auth.session-token');
        return response;
      }

      // If token is not present, redirect to login
      const searchParams = new URLSearchParams([['callbackUrl', pathname]]);
      return NextResponse.redirect(
        new URL(`/auth/login?${searchParams}`, request.url)
      );
    }

    // Role-based access control
    if (token.role) {
      const allowedPaths = ROLE_ACCESS[token.role as keyof typeof ROLE_ACCESS];
      const hasAccess =
        allowedPaths.includes('/*') ||
        allowedPaths.some((path) => pathname.startsWith(path));

      if (!hasAccess) {
        return NextResponse.redirect(
          new URL(
            DEFAULT_ROUTES[token.role as keyof typeof DEFAULT_ROUTES],
            request.url
          )
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|logos).*)'],
};
