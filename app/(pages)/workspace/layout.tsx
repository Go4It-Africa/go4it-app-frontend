import WorkSpaceLayout from "@/app/components/layout/WorkSpaceLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <WorkSpaceLayout>{children}</WorkSpaceLayout>;
};

export default Layout;
