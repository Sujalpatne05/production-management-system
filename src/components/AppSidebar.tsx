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
  Zap,
  TrendingDown,
  CheckSquare,
  Plus,
  List,
  FileEdit,
  DollarSign,
  Building,
  ClipboardList,
  Truck,
  BarChart3,
  UserPlus,
  Shield,
  Mail,
  Upload,
  Clock,
  History,
  Lock,
  Download,
  FileSpreadsheet,
  FileClock,
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
  icon?: any;
  badge?: string;
  description?: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  exact?: boolean;
  subItems?: SubMenuItem[];
  badge?: string;
  color?: string;
}

const menuItems: MenuItem[] = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Dashboard", url: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Factories", url: "/dashboard/factories", icon: Store },
  {
    title: "Procurement",
    url: "/dashboard/purchases/list",
    icon: ShoppingBag,
    color: "text-blue-500",
    subItems: [
      { title: "Add Purchase", url: "/dashboard/purchases/add", icon: Plus, description: "Create new purchase" },
      { title: "Purchase List", url: "/dashboard/purchases/list", icon: List, description: "View all purchases" },
      { title: "Purchase Orders", url: "/dashboard/purchases/purchase-orders", icon: ClipboardList, description: "Manage orders" },
      { title: "Supplier List", url: "/dashboard/purchases/suppliers", icon: Building, description: "Manage suppliers" },
      { title: "Supplier Payments", url: "/dashboard/supplier-payments/list", icon: DollarSign, description: "Payment tracking" },
    ],
  },
  {
    title: "Sales",
    url: "/dashboard/sales/list",
    icon: TrendingUp,
    color: "text-green-500",
    subItems: [
      { title: "Add Sale", url: "/dashboard/sales/add", icon: Plus, description: "Record new sale" },
      { title: "Sale List", url: "/dashboard/sales/list", icon: List, description: "View all sales" },
      { title: "Customer List", url: "/dashboard/sales/customers", icon: Users, description: "Manage customers" },
      { title: "Orders", url: "/dashboard/orders/list", icon: ShoppingCart, description: "Sales orders" },
    ],
  },
  {
    title: "CRM",
    url: "/dashboard/crm/leads",
    icon: Users,
    color: "text-purple-500",
    subItems: [
      { title: "Leads", url: "/dashboard/crm/leads", icon: UserPlus, description: "Lead management" },
      { title: "Follow-ups", url: "/dashboard/crm/followups", icon: Clock, description: "Track follow-ups" },
    ],
  },
  {
    title: "MRP",
    url: "/dashboard/mrp/work-orders",
    icon: Factory,
    color: "text-orange-500",
    subItems: [
      { title: "Work Orders", url: "/dashboard/mrp/work-orders", icon: FileText, description: "Basic view" },
      { title: "Work Orders (Detailed)", url: "/dashboard/mrp/work-orders-detailed", icon: FileSpreadsheet, description: "Detailed view" },
    ],
  },
  {
    title: "Manufacturing",
    url: "/dashboard/production/list-enhanced",
    icon: Factory,
    color: "text-amber-500",
    subItems: [
      { title: "Add Production", url: "/dashboard/production/add-enhanced", icon: Plus, description: "New production" },
      { title: "Production List", url: "/dashboard/production/list-enhanced", icon: List, description: "All productions" },
      { title: "Bill of Materials", url: "/dashboard/bom", icon: ClipboardList, description: "BOM management" },
    ],
  },
  {
    title: "Quality Control",
    url: "/dashboard/qc",
    icon: CheckSquare,
    color: "text-teal-500",
    subItems: [
      { title: "QC Dashboard", url: "/dashboard/qc", icon: LayoutDashboard, description: "Overview" },
      { title: "Inspections", url: "/dashboard/qc/inspections", icon: CheckSquare, description: "QC inspections" },
      { title: "Templates", url: "/dashboard/qc/templates", icon: FileText, description: "QC templates" },
      { title: "Non-Conformance", url: "/dashboard/qc/ncr", icon: ShieldCheck, description: "NCR reports" },
    ],
  },
  {
    title: "Goods Receipt",
    url: "/dashboard/grn",
    icon: ShoppingBag,
    color: "text-indigo-500",
    subItems: [
      { title: "GRN List", url: "/dashboard/grn", icon: List, description: "View receipts" },
      { title: "Create GRN", url: "/dashboard/grn/new", icon: Plus, description: "New receipt" },
    ],
  },
  {
    title: "Budget Planning",
    url: "/dashboard/budget",
    icon: Wallet,
    color: "text-emerald-500",
    subItems: [
      { title: "Budgets", url: "/dashboard/budget", icon: Wallet, description: "View budgets" },
      { title: "Create Budget", url: "/dashboard/budget/new", icon: Plus, description: "New budget" },
    ],
  },
  {
    title: "Forecasting",
    url: "/dashboard/forecast",
    icon: TrendingUp,
    color: "text-cyan-500",
    subItems: [
      { title: "Forecasts", url: "/dashboard/forecast", icon: TrendingUp, description: "View forecasts" },
      { title: "Create Forecast", url: "/dashboard/forecast/new", icon: Plus, description: "New forecast" },
    ],
  },
  {
    title: "Inventory",
    url: "/dashboard/stock",
    icon: Box,
    color: "text-pink-500",
    subItems: [
      { title: "Product Stock", url: "/dashboard/stock", icon: Box, description: "Stock levels" },
    ],
  },
  {
    title: "Accounting",
    url: "/dashboard/accounting/accounts",
    icon: CreditCard,
    color: "text-violet-500",
    subItems: [
      { title: "Accounts", url: "/dashboard/accounting/accounts", icon: List, description: "Chart of accounts" },
      { title: "Add Account", url: "/dashboard/accounting/add-account", icon: Plus, description: "New account" },
      { title: "Transactions", url: "/dashboard/accounting/transactions", icon: Receipt, description: "All transactions" },
      { title: "Add Transaction", url: "/dashboard/accounting/add-transaction", icon: Plus, description: "Record transaction" },
      { title: "Trial Balance", url: "/dashboard/accounting/trial-balance", icon: BarChart3, description: "Trial balance" },
      { title: "Balance Sheet", url: "/dashboard/accounting/balance-sheet", icon: FileSpreadsheet, description: "Balance sheet" },
    ],
  },
  {
    title: "Store",
    url: "/dashboard/store/material-codes",
    icon: Box,
    color: "text-rose-500",
    subItems: [
      { title: "Material Codes", url: "/dashboard/store/material-codes", icon: FileText, description: "Material coding" },
      { title: "GIN/GON", url: "/dashboard/store/gin-gon", icon: Truck, description: "Goods in/out" },
      { title: "Inventory Report", url: "/dashboard/store/inventory-report", icon: BarChart3, description: "Stock reports" },
      { title: "Challan & Gate Pass", url: "/dashboard/store/challan-gate-pass", icon: FileEdit, description: "Delivery docs" },
    ],
  },
  {
    title: "Accounting",
    url: "/dashboard/item-setup/products",
    icon: Package,
    color: "text-slate-500",
    subItems: [
      { title: "Add Product Category", url: "/dashboard/item-setup/add-product-category", icon: Plus, description: "New category" },
      { title: "Product Category List", url: "/dashboard/item-setup/product-categories", icon: List, description: "All categories" },
      { title: "Add Product", url: "/dashboard/item-setup/add-product", icon: Plus, description: "New product" },
      { title: "Product List", url: "/dashboard/item-setup/products", icon: List, description: "All products" },
    ],
  },
  {
    title: "Reports",
    url: "/dashboard/reports/sale",
    icon: PieChart,
    badge: "15+",
    color: "text-red-500",
    subItems: [
      { title: "Sale Report", url: "/dashboard/reports/sale", icon: TrendingUp, description: "Sales analytics" },
      { title: "Purchase Report", url: "/dashboard/reports/purchase", icon: ShoppingBag, description: "Purchase analytics" },
      { title: "Profit & Loss", url: "/dashboard/reports/profit-loss", icon: DollarSign, description: "P&L statement" },
      { title: "Supplier Due", url: "/dashboard/reports/supplier-due", icon: Clock, description: "Due payments" },
      { title: "Supplier Balance", url: "/dashboard/reports/supplier-balance", icon: Wallet, description: "Balance report" },
      { title: "Supplier Ledger", url: "/dashboard/reports/supplier-ledger", icon: FileText, description: "Ledger view" },
      { title: "Customer Due", url: "/dashboard/reports/customer-due", icon: Clock, description: "Due receivables" },
      { title: "Customer Ledger", url: "/dashboard/reports/customer-ledger", icon: FileText, description: "Customer ledger" },
      { title: "Work Order Report", url: "/dashboard/reports/work-orders", icon: ClipboardList, description: "WO analytics" },
      { title: "Purchase Order Report", url: "/dashboard/reports/purchase-orders", icon: ShoppingCart, description: "PO analytics" },
      { title: "Purchase Inquiry", url: "/dashboard/reports/purchase-inquiry", icon: FileText, description: "Inquiry reports" },
      { title: "Purchase Quotation", url: "/dashboard/reports/purchase-quotation", icon: Receipt, description: "Quotation reports" },
      { title: "CAPEX Orders", url: "/dashboard/reports/capex-orders", icon: TrendingUp, description: "Capital orders" },
      { title: "Due Delivery", url: "/dashboard/reports/due-delivery", icon: Truck, description: "Delivery schedule" },
      { title: "Order Sheet", url: "/dashboard/reports/order-sheet", icon: FileSpreadsheet, description: "Order summary" },
    ],
  },
  {
    title: "Users",
    url: "/dashboard/users/list",
    icon: UserIcon,
    color: "text-sky-500",
    subItems: [
      { title: "User Directory", url: "/dashboard/users/list", icon: Users, description: "All users" },
      { title: "Roles & Permissions", url: "/dashboard/users/roles", icon: Shield, description: "Access control" },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings/company",
    icon: SettingsIcon,
    color: "text-gray-500",
    subItems: [
      { title: "Company Profile", url: "/dashboard/settings/company", icon: Building, description: "Company details" },
      { title: "Tax Settings", url: "/dashboard/settings/tax", icon: Receipt, description: "Tax configuration" },
      { title: "White Label", url: "/dashboard/settings/white-label", icon: Zap, description: "Branding" },
      { title: "Email Settings", url: "/dashboard/settings/email", icon: Mail, description: "Email config" },
      { title: "Data Import", url: "/dashboard/settings/import", icon: Upload, description: "Import data" },
      { title: "RBAC Management", url: "/dashboard/settings/rbac", icon: ShieldCheck, description: "Role management" },
    ],
  },
  {
    title: "Approvals",
    url: "/dashboard/approvals",
    icon: ShieldCheck,
    color: "text-lime-500",
    subItems: [
      { title: "Pending Approvals", url: "/dashboard/approvals/pending", icon: Clock, badge: "3", description: "Awaiting action" },
      { title: "Approval History", url: "/dashboard/approvals/history", icon: History, description: "Past approvals" },
      { title: "Unlock Requests", url: "/dashboard/approvals/unlock-requests", icon: Lock, description: "Unlock requests" },
    ],
  },
  {
    title: "Audit Logs",
    url: "/dashboard/audit/logs",
    icon: ListChecks,
    color: "text-yellow-500",
    subItems: [
      { title: "Log Viewer", url: "/dashboard/audit/logs", icon: FileText, description: "View logs" },
      { title: "Entity History", url: "/dashboard/audit/entities", icon: History, description: "Track changes" },
      { title: "Export & Stats", url: "/dashboard/audit/export", icon: Download, description: "Export reports" },
    ],
  },
  {
    title: "Accounting Periods",
    url: "/dashboard/accounting-periods",
    icon: CalendarCheck,
    color: "text-fuchsia-500",
    subItems: [
      { title: "Manage Periods", url: "/dashboard/accounting-periods", icon: CalendarCheck, description: "Period management" },
      { title: "Close & Reopen", url: "/dashboard/accounting-periods/close", icon: FileClock, description: "Period operations" },
    ],
  },
  { title: "Backup & Restore", url: "/dashboard/backup", icon: Database, color: "text-stone-500" },
  {
    title: "PDF Center",
    url: "/dashboard/pdf",
    icon: Printer,
    color: "text-blue-600",
    subItems: [
      { title: "Invoices & POs", url: "/dashboard/pdf/invoices", icon: Receipt, description: "Invoice PDFs" },
      { title: "Delivery & Challan", url: "/dashboard/pdf/challan", icon: Truck, description: "Delivery docs" },
      { title: "Production Reports", url: "/dashboard/pdf/production", icon: Factory, description: "Production PDFs" },
      { title: "Financial Statements", url: "/dashboard/pdf/financial", icon: FileSpreadsheet, description: "Financial docs" },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (key: string) => {
    setOpenItems(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/95">
      <SidebarHeader className="border-b border-sidebar-border/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
            I
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">IProduction</span>
              <span className="text-xs text-muted-foreground">Management System</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  {item.subItems ? (
                    <Collapsible
                      open={openItems.includes(item.url)}
                      onOpenChange={() => toggleItem(item.url)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="group w-full gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-md data-[state=open]:bg-sidebar-accent/70 data-[state=open]:shadow-sm relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${item.color || 'text-current'}`} />
                          {open && (
                            <>
                              <span className="flex-1 text-left font-medium">{item.title}</span>
                              <div className="flex items-center gap-2">
                                {item.badge && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                                <ChevronRight
                                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                                    openItems.includes(item.url) ? "rotate-90" : ""
                                  }`}
                                />
                              </div>
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {open && (
                        <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in">
                          <SidebarMenuSub className="mt-1 ml-1 border-l-2 border-sidebar-border/40 pl-2">
                            {item.subItems.map((subItem, index) => (
                              <SidebarMenuSubItem key={subItem.url} className="my-0.5">
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={subItem.url}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:translate-x-1 transition-all duration-200 border-l-2 border-transparent hover:border-primary/50 relative overflow-hidden"
                                    activeClassName="bg-sidebar-accent/70 text-sidebar-accent-foreground font-semibold border-l-2 border-primary shadow-sm"
                                    style={{ 
                                      animationDelay: `${index * 30}ms`,
                                      animation: openItems.includes(item.url) ? 'slideIn 0.3s ease-out' : 'none'
                                    }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {subItem.icon && (
                                      <subItem.icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                                    )}
                                    <div className="flex-1 flex flex-col">
                                      <span className="leading-tight">{subItem.title}</span>
                                      {subItem.description && (
                                        <span className="text-[10px] text-muted-foreground group-hover:text-sidebar-accent-foreground/70">
                                          {subItem.description}
                                        </span>
                                      )}
                                    </div>
                                    {subItem.badge && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-destructive/20 text-destructive rounded-full">
                                        {subItem.badge}
                                      </span>
                                    )}
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
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        activeClassName="bg-sidebar-accent/70 text-sidebar-accent-foreground font-semibold shadow-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <item.icon className={`w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-all duration-300 ${item.color || 'text-current'}`} />
                        {open && (
                          <div className="flex items-center justify-between flex-1">
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full">
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
