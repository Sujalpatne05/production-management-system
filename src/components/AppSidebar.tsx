import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Store,
  Factory,
  Package,
  ShoppingCart,
  TrendingUp,
  ShoppingBag,
  Users,
  Box,
  Receipt,
  PieChart,
  CreditCard,
  Wallet,
  IndianRupee,
  FileText,
  User as UserIcon,
  Settings as SettingsIcon,
  Database,
  ShieldCheck,
  ListChecks,
  CalendarCheck,
  Printer,
  Bell,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubMenuItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  exact?: boolean;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Dashboard", url: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Factories", url: "/dashboard/factories", icon: Store },
  {
    title: "Procurement",
    url: "/dashboard/purchases/list",
    icon: ShoppingBag,
    subItems: [
      { title: "Add Purchase", url: "/dashboard/purchases/add" },
      { title: "Purchase List", url: "/dashboard/purchases/list" },
      { title: "Purchase Orders", url: "/dashboard/purchases/purchase-orders" },
      { title: "Supplier List", url: "/dashboard/purchases/suppliers" },
      { title: "Supplier Payments", url: "/dashboard/supplier-payments/list" },
    ],
  },
  {
    title: "Sales",
    url: "/dashboard/sales/list",
    icon: TrendingUp,
    subItems: [
      { title: "Add Sale", url: "/dashboard/sales/add" },
      { title: "Sale List", url: "/dashboard/sales/list" },
      { title: "Customer List", url: "/dashboard/sales/customers" },
      { title: "Orders", url: "/dashboard/orders/list" },
    ],
  },
  {
    title: "CRM",
    url: "/dashboard/crm/leads",
    icon: Users,
    subItems: [
      { title: "Leads", url: "/dashboard/crm/leads" },
      { title: "Follow-ups", url: "/dashboard/crm/followups" },
    ],
  },
  {
    title: "MRP",
    url: "/dashboard/mrp/work-orders",
    icon: Factory,
    subItems: [
      { title: "Work Orders", url: "/dashboard/mrp/work-orders" },
      { title: "Work Orders (Detailed)", url: "/dashboard/mrp/work-orders-detailed" },
    ],
  },
  {
    title: "Manufacturing",
    url: "/dashboard/production/list-enhanced",
    icon: Factory,
    subItems: [
      { title: "Add Production", url: "/dashboard/production/add-enhanced" },
      { title: "Production List", url: "/dashboard/production/list-enhanced" },
    ],
  },
  {
    title: "Inventory",
    url: "/dashboard/stock",
    icon: Box,
    subItems: [
      { title: "Product Stock", url: "/dashboard/stock" },
    ],
  },
  {
    title: "Accounting",
    url: "/dashboard/accounting/accounts",
    icon: CreditCard,
    subItems: [
      { title: "Accounts", url: "/dashboard/accounting/accounts" },
      { title: "Add Account", url: "/dashboard/accounting/add-account" },
      { title: "Transactions", url: "/dashboard/accounting/transactions" },
      { title: "Add Transaction", url: "/dashboard/accounting/add-transaction" },
      { title: "Trial Balance", url: "/dashboard/accounting/trial-balance" },
      { title: "Balance Sheet", url: "/dashboard/accounting/balance-sheet" },
    ],
  },
  {
    title: "Store",
    url: "/dashboard/store/material-codes",
    icon: Box,
    subItems: [
      { title: "Material Codes", url: "/dashboard/store/material-codes" },
      { title: "GIN/GON", url: "/dashboard/store/gin-gon" },
      { title: "Inventory Report", url: "/dashboard/store/inventory-report" },
      { title: "Challan & Gate Pass", url: "/dashboard/store/challan-gate-pass" },
    ],
  },
  {
    title: "Accounting",
    url: "/dashboard/item-setup/products",
    icon: Package,
    subItems: [
      { title: "Add Product Category", url: "/dashboard/item-setup/add-product-category" },
      { title: "Product Category List", url: "/dashboard/item-setup/product-categories" },
      { title: "Add Product", url: "/dashboard/item-setup/add-product" },
      { title: "Product List", url: "/dashboard/item-setup/products" },
    ],
  },
  {
    title: "Reports",
    url: "/dashboard/reports/sale",
    icon: PieChart,
    subItems: [
      { title: "Sale Report", url: "/dashboard/reports/sale" },
      { title: "Purchase Report", url: "/dashboard/reports/purchase" },
      { title: "Profit & Loss", url: "/dashboard/reports/profit-loss" },
      { title: "Supplier Due", url: "/dashboard/reports/supplier-due" },
      { title: "Supplier Balance", url: "/dashboard/reports/supplier-balance" },
      { title: "Supplier Ledger", url: "/dashboard/reports/supplier-ledger" },
      { title: "Customer Due", url: "/dashboard/reports/customer-due" },
      { title: "Customer Ledger", url: "/dashboard/reports/customer-ledger" },
      { title: "Work Order Report", url: "/dashboard/reports/work-orders" },
      { title: "Purchase Order Report", url: "/dashboard/reports/purchase-orders" },
      { title: "Purchase Inquiry", url: "/dashboard/reports/purchase-inquiry" },
      { title: "Purchase Quotation", url: "/dashboard/reports/purchase-quotation" },
      { title: "CAPEX Orders", url: "/dashboard/reports/capex-orders" },
      { title: "Due Delivery", url: "/dashboard/reports/due-delivery" },
      { title: "Order Sheet", url: "/dashboard/reports/order-sheet" },
    ],
  },
  {
    title: "Users",
    url: "/dashboard/users/list",
    icon: UserIcon,
    subItems: [
      { title: "User Directory", url: "/dashboard/users/list" },
      { title: "Roles & Permissions", url: "/dashboard/users/roles" },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings/company",
    icon: SettingsIcon,
    subItems: [
      { title: "Company Profile", url: "/dashboard/settings/company" },
      { title: "Tax Settings", url: "/dashboard/settings/tax" },
      { title: "White Label", url: "/dashboard/settings/white-label" },
      { title: "Email Settings", url: "/dashboard/settings/email" },
      { title: "Data Import", url: "/dashboard/settings/import" },
      { title: "RBAC Management", url: "/dashboard/settings/rbac" },
    ],
  },
  {
    title: "Approvals",
    url: "/dashboard/approvals/pending",
    icon: ShieldCheck,
    subItems: [
      { title: "Pending Approvals", url: "/dashboard/approvals/pending" },
      { title: "Approval History", url: "/dashboard/approvals/history" },
      { title: "Unlock Requests", url: "/dashboard/approvals/unlock" },
    ],
  },
  {
    title: "Audit Logs",
    url: "/dashboard/audit/logs",
    icon: ListChecks,
    subItems: [
      { title: "Log Viewer", url: "/dashboard/audit/logs" },
      { title: "Entity History", url: "/dashboard/audit/entities" },
      { title: "Export & Stats", url: "/dashboard/audit/export" },
    ],
  },
  {
    title: "Accounting Periods",
    url: "/dashboard/accounting-periods",
    icon: CalendarCheck,
    subItems: [
      { title: "Manage Periods", url: "/dashboard/accounting-periods" },
      { title: "Close & Reopen", url: "/dashboard/accounting-periods/close" },
    ],
  },
  { title: "Backup & Restore", url: "/dashboard/backup", icon: Database },
  {
    title: "PDF Center",
    url: "/dashboard/pdf",
    icon: Printer,
    subItems: [
      { title: "Invoices & POs", url: "/dashboard/pdf/invoices" },
      { title: "Delivery & Challan", url: "/dashboard/pdf/challan" },
      { title: "Production Reports", url: "/dashboard/pdf/production" },
      { title: "Financial Statements", url: "/dashboard/pdf/financial" },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            I
          </div>
          {open && <span className="font-bold text-lg text-primary">IProduction</span>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible
                      open={openItems.includes(item.title)}
                      onOpenChange={() => toggleItem(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="w-full gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent/60"
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {open && (
                            <>
                              <span className="flex-1 text-left">{item.title}</span>
                              <ChevronRight
                                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                                  openItems.includes(item.title) ? "rotate-90" : ""
                                }`}
                              />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {open && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={subItem.url}
                                    className="flex items-center rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150 border-l border-sidebar-border/60"
                                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                  >
                                    {subItem.title}
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
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {open && <span className="flex-1">{item.title}</span>}
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
