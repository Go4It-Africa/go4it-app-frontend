'use client';

import { ReactNode, useRef } from 'react';

export default function StoreProvider({ children }: { children: ReactNode }) {
  // This prevents hydration mismatch issues with server components
  const initialized = useRef(false);
  if (!initialized.current && typeof window !== 'undefined') {
    initialized.current = true;
  }

  return children;
}