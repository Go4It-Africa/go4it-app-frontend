'use client';

import { ReactElement } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function ProviderWrapper({ children }: { children: ReactElement }) {
    return (
    <SessionProvider refetchInterval={5 * 60}>
        {children}
    </SessionProvider>
    );
  }