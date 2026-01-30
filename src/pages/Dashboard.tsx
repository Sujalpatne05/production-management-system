import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import QuickActionButton from "@/components/QuickActionButton";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 md:p-8 max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
        <QuickActionButton />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
