import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
      <DashboardLayout>{children}</DashboardLayout>
  );
};

export default Layout;
