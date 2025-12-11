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
  ChevronDown,
  ChevronRight
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
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Dashboard", url: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Factories", url: "/dashboard/factories", icon: Store },
  { 
    title: "Production", 
    url: "/dashboard/production", 
    icon: Factory,
    subItems: [
      { title: "Add Production", url: "/dashboard/production/add" },
      { title: "Production List", url: "/dashboard/production/list" },
      { title: "Add Production Loss", url: "/dashboard/production/add-loss" },
      { title: "Production Loss List", url: "/dashboard/production/loss-list" },
      { title: "Demand Forecasting By Order", url: "/dashboard/production/forecast-order" },
      { title: "Demand Forecasting By Product", url: "/dashboard/production/forecast-product" },
    ]
  },
  { title: "Product Stock", url: "/dashboard/stock", icon: Package },
  { 
    title: "Orders", 
    url: "/dashboard/orders", 
    icon: ShoppingCart,
    subItems: [
      { title: "Create Order", url: "/dashboard/orders/add" },
      { title: "Order List", url: "/dashboard/orders/list" },
    ]
  },
  { 
    title: "Sales", 
    url: "/dashboard/sales", 
    icon: TrendingUp,
    subItems: [
      { title: "Add Sale", url: "/dashboard/sales/add" },
      { title: "Sale List", url: "/dashboard/sales/list" },
    ]
  },
  { 
    title: "Purchases", 
    url: "/dashboard/purchases", 
    icon: ShoppingBag,
    subItems: [
      { title: "Add Purchase", url: "/dashboard/purchases/add" },
      { title: "Purchase List", url: "/dashboard/purchases/list" },
    ]
  },
  { 
    title: "Parties", 
    url: "/dashboard/parties", 
    icon: Users,
    subItems: [
      { title: "Add Customer", url: "/dashboard/parties/add-customer" },
      { title: "Customer List", url: "/dashboard/parties/customers" },
      { title: "Add Supplier", url: "/dashboard/parties/add-supplier" },
      { title: "Supplier List", url: "/dashboard/parties/suppliers" },
    ]
  },
  { 
    title: "RM Stock", 
    url: "/dashboard/rm-stock", 
    icon: Box,
    subItems: [
      { title: "Low Stock", url: "/dashboard/rm-stock/low-stock" },
      { title: "Add Stock Adjustment", url: "/dashboard/rm-stock/add-adjustment" },
      { title: "Stock Adjustment List", url: "/dashboard/rm-stock/adjustments" },
    ]
  },
  { 
    title: "Expenses", 
    url: "/dashboard/expenses", 
    icon: IndianRupee,
    subItems: [
      { title: "Add Expense", url: "/dashboard/expenses/add" },
      { title: "Expense List", url: "/dashboard/expenses/list" },
      { title: "Add Expense Category", url: "/dashboard/expenses/add-category" },
      { title: "Expense Category List", url: "/dashboard/expenses/categories" },
    ]
  },
  { 
    title: "Supplier Payments", 
    url: "/dashboard/supplier-payments", 
    icon: CreditCard,
    subItems: [
      { title: "Add Supplier Payment", url: "/dashboard/supplier-payments/add" },
      { title: "Supplier Payment List", url: "/dashboard/supplier-payments/list" },
    ]
  },
  { 
    title: "Customer Receives", 
    url: "/dashboard/customer-receives", 
    icon: Wallet,
    subItems: [
      { title: "Add Customer Receive", url: "/dashboard/customer-receives/add" },
      { title: "Customer Receive List", url: "/dashboard/customer-receives/list" },
    ]
  },
  { 
    title: "Item Setup", 
    url: "/dashboard/item-setup", 
    icon: Package,
    subItems: [
      { title: "Add RM Category", url: "/dashboard/item-setup/add-rm-category" },
      { title: "RM Category List", url: "/dashboard/item-setup/rm-categories" },
      { title: "Add Raw Material", url: "/dashboard/item-setup/add-raw-material" },
      { title: "Raw Material List", url: "/dashboard/item-setup/raw-materials" },
      { title: "Add Non Inventory Item", url: "/dashboard/item-setup/non-inventory/add" },
      { title: "Non Inventory Item List", url: "/dashboard/item-setup/non-inventory/list" },
      { title: "Add Product Category", url: "/dashboard/item-setup/add-product-category" },
      { title: "Product Category List", url: "/dashboard/item-setup/product-categories" },
      { title: "Add Product", url: "/dashboard/item-setup/add-product" },
      { title: "Product List", url: "/dashboard/item-setup/products" },
    ]
  },
  { 
    title: "RM Wastes", 
    url: "/dashboard/rm-wastes", 
    icon: Box,
    subItems: [
      { title: "Add RM Waste", url: "/dashboard/rm-wastes/add" },
      { title: "RM Waste List", url: "/dashboard/rm-wastes/list" },
    ]
  },
  { 
    title: "Product Wastes", 
    url: "/dashboard/product-wastes", 
    icon: Package,
    subItems: [
      { title: "Add Product Waste", url: "/dashboard/product-wastes/add" },
      { title: "Product Waste List", url: "/dashboard/product-wastes/list" },
    ]
  },
  { 
    title: "Quotations", 
    url: "/dashboard/quotations", 
    icon: FileText,
    subItems: [
      { title: "Add Quotation", url: "/dashboard/quotations/add" },
      { title: "Quotation List", url: "/dashboard/quotations/list" },
    ]
  },
  { 
    title: "Reports", 
    url: "/dashboard/reports", 
    icon: PieChart,
    subItems: [
      // { title: "Product Price History", url: "/dashboard/reports/product-price-history" },
      // { title: "Raw Material Price History", url: "/dashboard/reports/rm-price-history" },
      // { title: "RM Purchase Report", url: "/dashboard/reports/rm-purchase" },
      // { title: "RM Item Wise Purchase Report", url: "/dashboard/reports/rm-item-purchase" },
      // { title: "RM Stock Report", url: "/dashboard/reports/rm-stock" },
      // { title: "Supplier Due Report", url: "/dashboard/reports/supplier-due" },
      // { title: "Supplier Balance Report", url: "/dashboard/reports/supplier-balance" },
      // { title: "Supplier Ledger", url: "/dashboard/reports/supplier-ledger" },
      // { title: "Production Report", url: "/dashboard/reports/production" },
      // { title: "Product Production Report", url: "/dashboard/reports/product-production" },
      // { title: "Sale Report", url: "/dashboard/reports/sale" },
      // { title: "Item Wise Sale Report", url: "/dashboard/reports/item-sale" },
      // { title: "Customer Due Report", url: "/dashboard/reports/customer-due" },
      // { title: "Customer Ledger", url: "/dashboard/reports/customer-ledger" },
      // { title: "Profit & Loss Report", url: "/dashboard/reports/profit-loss" },
      // { title: "Product Profit Report", url: "/dashboard/reports/product-profit" },
      { title: "Sectors", url: "/dashboard/reports/sectors" },
    ]
  },
  { 
    title: "Users", 
    url: "/dashboard/users", 
    icon: UserIcon,
    subItems: [
      { title: "Add New Role", url: "/dashboard/users/add-role" },
      { title: "List Role", url: "/dashboard/users/roles" },
      { title: "Add New User", url: "/dashboard/users/add" },
      { title: "List User", url: "/dashboard/users/list" },
    ]
  },
  { 
    title: "Settings", 
    url: "/dashboard/settings", 
    icon: SettingsIcon,
    subItems: [
      { title: "Company Profile", url: "/dashboard/settings/company" },
      { title: "Tax Settings", url: "/dashboard/settings/tax" },
      { title: "White Label", url: "/dashboard/settings/white-label" },
      { title: "Email Settings", url: "/dashboard/settings/email" },
      { title: "Data Import", url: "/dashboard/settings/import" },
      { title: "Add Unit", url: "/dashboard/settings/add-unit" },
      { title: "Unit List", url: "/dashboard/settings/units" },
      { title: "Add Currency", url: "/dashboard/settings/add-currency" },
      { title: "List Currency", url: "/dashboard/settings/currencies" },
      { title: "Add Production Stage", url: "/dashboard/settings/add-stage" },
      { title: "Production Stage List", url: "/dashboard/settings/stages" },
    ]
  },
  { title: "Backup & Restore", url: "/dashboard/backup", icon: Database },
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
                        <SidebarMenuButton className="w-full">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {open && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {openItems.includes(item.title) ? (
                                <ChevronDown className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                              )}
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
                                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
