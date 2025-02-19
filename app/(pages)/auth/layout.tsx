import { AuthLayout } from "@/app/components/layout/AuthLayout";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
};

export default Layout;