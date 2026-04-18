import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronRight,
  Home,
  UserPlus,
  Shield,
  FileText,
} from "lucide-react";

interface SubMenuItem {
  title: string;
  url: string;
  icon?: any;
  description?: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  color?: string;
  subItems?: SubMenuItem[];
  badge?: string;
  exact?: boolean;
}

const adminMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: Home,
    color: "text-blue-500",
    exact: true,
  },
  {
    title: "User Management",
    url: "/dashboard/admin/users",
    icon: Users,
    color: "text-purple-500",
    subItems: [
      {
        title: "All Users",
        url: "/dashboard/admin/users",
        icon: Users,
        description: "View and manage all users",
      },
      {
        title: "Add User",
        url: "/dashboard/admin/users/add",
        icon: UserPlus,
        description: "Create new user",
      },
    ],
  },
  {
    title: "Roles & Permissions",
    url: "/dashboard/users/roles",
    icon: Shield,
    color: "text-green-500",
    subItems: [
      {
        title: "View Roles",
        url: "/dashboard/users/roles",
        icon: Shield,
        description: "Available roles",
      },
      {
        title: "Role Details",
        url: "/dashboard/users/roles",
        icon: FileText,
        description: "Role permissions",
      },
    ],
  },
  {
    title: "Analytics",
    url: "/dashboard/reports/admin-dashboard",
    icon: BarChart3,
    color: "text-orange-500",
    subItems: [
      {
        title: "Dashboard",
        url: "/dashboard/reports/admin-dashboard",
        icon: BarChart3,
        description: "Admin analytics",
      },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings/company",
    icon: Settings,
    color: "text-gray-500",
    subItems: [
      {
        title: "Company Profile",
        url: "/dashboard/settings/company",
        icon: Settings,
        description: "Company information",
      },
      {
        title: "Change Password",
        url: "/dashboard/change-password",
        icon: Shield,
        description: "Update password",
      },
    ],
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/95"
    >
      <SidebarHeader className="border-b border-sidebar-border/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
            A
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">Admin Panel</span>
              <span className="text-xs text-muted-foreground">Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  {item.subItems ? (
                    <Collapsible
                      open={openItems.includes(item.url)}
                      onOpenChange={() => toggleItem(item.url)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="group w-full gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-600 data-[state=open]:bg-purple-500/10 data-[state=open]:text-purple-600 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${item.color || "text-current"}`} />
                          {open && (
                            <>
                              <span className="flex-1 text-left font-medium text-sm">
                                {item.title}
                              </span>
                              <ChevronRight
                                className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                                  openItems.includes(item.url) ? "rotate-90" : ""
                                }`}
                              />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {open && (
                        <CollapsibleContent className="transition-all duration-300">
                          <SidebarMenuSub className="mt-1 ml-1 border-l-2 border-purple-500/20 pl-2">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url} className="my-0.5">
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-purple-500/10 hover:text-purple-600 hover:translate-x-1 transition-all duration-200 border-l-2 border-transparent hover:border-purple-500/50 relative overflow-hidden"
                                    activeClassName="bg-purple-500/15 text-purple-600 font-semibold border-l-2 border-purple-500 shadow-sm"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {subItem.icon && (
                                      <subItem.icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                                    )}
                                    <div className="flex-1 flex flex-col">
                                      <span className="leading-tight">
                                        {subItem.title}
                                      </span>
                                      {subItem.description && (
                                        <span className="text-[10px] text-muted-foreground group-hover:text-purple-600/70">
                                          {subItem.description}
                                        </span>
                                      )}
                                    </div>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.exact}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-purple-500/10 hover:text-purple-600 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        activeClassName="bg-purple-500/15 text-purple-600 font-semibold shadow-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <item.icon className={`w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-all duration-300 ${item.color || "text-current"}`} />
                        {open && (
                          <div className="flex items-center justify-between flex-1">
                            <span className="font-medium text-sm">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-600 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
