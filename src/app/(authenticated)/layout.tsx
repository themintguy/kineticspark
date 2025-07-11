

import DashboardLayout from "@/components/layouts/DashBoardLayout";


export const metadata = {
  title: "Dashboard | Kinetic Spark", 
  description: "Your personal productivity .",
};

export default function DashboardRootLayout({
  children, 
}: 
{
  children: React.ReactNode;
}) {
  return (

    <DashboardLayout>{children}</DashboardLayout>
  );
}
