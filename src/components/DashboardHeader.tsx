import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CheckInOutDialog from "@/components/CheckInOutDialog";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// InstallPWAButton intentionally not shown in UI

const DashboardHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('IProduction');

  // Get company name from localStorage - reactive with useEffect
  useEffect(() => {
    const updateCompanyName = () => {
      try {
        const tenant = localStorage.getItem('tenant');
        console.log('📍 DashboardHeader - Reading tenant from localStorage:', tenant);
        if (tenant) {
          const tenantData = JSON.parse(tenant);
          console.log('📍 DashboardHeader - Parsed tenant data:', tenantData);
          const name = tenantData.name || 'IProduction';
          console.log('📍 DashboardHeader - Setting company name to:', name);
          setCompanyName(name);
        } else {
          console.log('📍 DashboardHeader - No tenant found in localStorage');
          setCompanyName('IProduction');
        }
      } catch (error) {
        console.error('❌ Error getting company name:', error);
        setCompanyName('IProduction');
      }
    };

    // Update on mount
    updateCompanyName();

    // Listen for storage changes (from other tabs or programmatic updates)
    const handleStorageChange = () => {
      console.log('📍 DashboardHeader - Storage event detected');
      updateCompanyName();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };
  
  return (
    <header className="sticky top-0 z-40 flex h-14 md:h-16 items-center justify-between border-b border-border bg-card px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
        <div className="hidden md:block border-l border-border pl-4">
          <h2 className="text-sm font-semibold text-foreground">{companyName}</h2>
          <p className="text-xs text-muted-foreground">Company Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <CheckInOutDialog />

        <NotificationBell unreadCount={2} />

        <ThemeToggle />

        <LanguageSelector />

        {/** Install button hidden per request **/}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 md:h-10 md:w-10">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm">A</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 md:w-48 bg-popover z-50">
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings/company")}>
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
