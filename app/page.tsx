'use client';
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "./guards/AuthGuard";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Suspense } from "react";
import Loader from "./components/Loader";

export default function Home() {
  return (
    <SessionProvider>
      <AuthGuard>
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            {/* Page content goes here */}
            <main>
              <h1>Welcome to Dashboard</h1>
            </main>
          </DashboardLayout>
        </Suspense>
      </AuthGuard>
    </SessionProvider>
  );
}
