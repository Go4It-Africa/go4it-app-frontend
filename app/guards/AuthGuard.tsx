'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Loader from '../components/Loader';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      const callbackUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?callbackUrl=${callbackUrl}`;
    }
  }, [mounted, status]);

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      // Use window.location for initial redirect instead of router
      window.location.href = '/auth/login';
    }
  }, [mounted, status]);
  
  // Don't render anything until mounted
  if (!mounted || status === 'loading') {
    return <Loader />;
  }
  
  // Only render children if we have a session
  if (!session) {
    return <Loader />;
  }
  
  return <>{children}</>;
};