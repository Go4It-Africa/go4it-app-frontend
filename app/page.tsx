'use client';
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "./guards/AuthGuard";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Suspense } from "react";
import Loader from "./components/Loader";
export default function Home({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <SessionProvider>
      <AuthGuard>
        <Suspense fallback={<Loader />}>
            <DashboardLayout>{children}</DashboardLayout>
          </Suspense>
      </AuthGuard>
    </SessionProvider>
  );
}
