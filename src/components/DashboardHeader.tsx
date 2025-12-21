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
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
// InstallPWAButton intentionally not shown in UI

const DashboardHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  
  return (
    <header className="sticky top-0 z-40 flex h-14 md:h-16 items-center justify-between border-b border-border bg-card px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <CheckInOutDialog />

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
