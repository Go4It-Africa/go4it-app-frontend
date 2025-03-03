'use client';

import { ReactElement } from 'react';
import { SessionProvider } from 'next-auth/react';
import ErrorBoundary from '@/app/components/ErrorBoundary';

// Session monitor component to handle session errors
// const SessionMonitor = () => {
//    const { data: session } = useSession();

//    useEffect(() => {
//      if (session?.error === 'RefreshAccessTokenError') {
//        console.error('Session error detected: RefreshAccessTokenError');
//        // Sign out the user if refresh token fails
//        signOut({ callbackUrl: '/auth/login' });
//      }
//    }, [session]);
 
//    return null;
//  };
 
export default function NextAuthProvider({ children }: { children: ReactElement }) {
    return (
    <SessionProvider refetchInterval={5 * 60}>
      {/* <SessionMonitor /> */}
      <ErrorBoundary> {children}</ErrorBoundary>
    </SessionProvider>
    );
  }