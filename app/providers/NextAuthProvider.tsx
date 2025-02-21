'use client';

import { ReactElement } from 'react';
import { SessionProvider } from 'next-auth/react';
import ErrorBoundary from '@/app/components/ErrorBoundary';
export default function NextAuthProvider({ children }: { children: ReactElement }) {
    return (
    <SessionProvider refetchInterval={5 * 60}>
       <ErrorBoundary> {children}</ErrorBoundary>
    </SessionProvider>
    );
  }