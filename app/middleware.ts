import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_PAGES = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
const PUBLIC_PATHS = ['/landing'];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // For auth pages
  if (AUTH_PAGES.includes(pathname)) {
    return token 
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.next();
  }

  // Require authentication for all other routes
  if (!token) {
    const searchParams = new URLSearchParams([['callbackUrl', pathname]]);
    return NextResponse.redirect(
      new URL(`/auth/login?${searchParams}`, request.url)
    );
  }

  // Role-based access control
  if (token.role) {
    const roleAccess = {
      club_admin: ['/dashboard', '/players', '/tournaments', '/club'],
      super_admin: ['/dashboard', '/admin', '/settings'],
      tournament_organizer: ['/dashboard', '/tournaments']
    };

    const allowedPaths = roleAccess[token.role as keyof typeof roleAccess] || [];
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path));

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};