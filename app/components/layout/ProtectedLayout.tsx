import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedLayout = ({ children, allowedRoles }: ProtectedLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role || '')) {
    router.push('/dashboard');
    return null;
  }

  return <>{children}</>;
};