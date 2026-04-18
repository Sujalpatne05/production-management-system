import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import QuickActionButton from "@/components/QuickActionButton";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
        <QuickActionButton />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
