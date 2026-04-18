import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  UserPlus,
  ShoppingBag,
  Truck,
  Factory,
  ClipboardList,
  CheckSquare,
  Receipt,
  Box,
  Store,
  CreditCard,
  Wallet,
  TrendingDown,
  CalendarCheck,
  Package,
  PieChart,
  Printer,
  Users,
  Building,
  Users as ProjectUsers,
  FileText,
  ShieldCheck,
  ListChecks,
} from "lucide-react";

interface ModuleGroup {
  title: string;
  description: string;
  color: string;
  icon: any;
  modules: {
    name: string;
    url: string;
    icon: any;
  }[];
}

const moduleGroups: ModuleGroup[] = [
  {
    title: "Sales & Orders",
    description: "Sales management and customer relationships",
    color: "bg-green-50 border-green-200",
    icon: TrendingUp,
    modules: [
      { name: "Sales", url: "/dashboard/sales/list", icon: TrendingUp },
      { name: "CRM", url: "/dashboard/crm/leads", icon: UserPlus },
    ],
  },
  {
    title: "Procurement & Supply",
    description: "Purchasing and supply chain management",
    color: "bg-blue-50 border-blue-200",
    icon: ShoppingBag,
    modules: [
      { name: "Procurement", url: "/dashboard/purchases/list", icon: ShoppingBag },
      { name: "Supply Chain", url: "/dashboard/supply-chain/demand", icon: Truck },
    ],
  },
  {
    title: "Manufacturing & Production",
    description: "Production and quality management",
    color: "bg-amber-50 border-amber-200",
    icon: Factory,
    modules: [
      { name: "Manufacturing", url: "/dashboard/production/list-enhanced", icon: Factory },
      { name: "MRP", url: "/dashboard/mrp/work-orders", icon: ClipboardList },
      { name: "Quality Control", url: "/dashboard/qc", icon: CheckSquare },
      { name: "Goods Receipt", url: "/dashboard/grn", icon: Receipt },
    ],
  },
  {
    title: "Inventory & Warehouse",
    description: "Stock and warehouse management",
    color: "bg-pink-50 border-pink-200",
    icon: Box,
    modules: [
      { name: "Inventory & Store", url: "/dashboard/stock", icon: Box },
      { name: "Factories", url: "/dashboard/factories", icon: Store },
    ],
  },
  {
    title: "Finance & Accounting",
    description: "Financial management and accounting",
    color: "bg-violet-50 border-violet-200",
    icon: CreditCard,
    modules: [
      { name: "Accounting", url: "/dashboard/accounting/accounts", icon: CreditCard },
      { name: "Budget Planning", url: "/dashboard/budget", icon: Wallet },
      { name: "Forecasting", url: "/dashboard/forecast", icon: TrendingDown },
      { name: "Accounting Periods", url: "/dashboard/accounting-periods", icon: CalendarCheck },
    ],
  },
  {
    title: "Products & Setup",
    description: "Product catalog management",
    color: "bg-slate-50 border-slate-200",
    icon: Package,
    modules: [
      { name: "Products & Categories", url: "/dashboard/item-setup/products", icon: Package },
    ],
  },
  {
    title: "Reports & Analytics",
    description: "Business intelligence and reporting",
    color: "bg-red-50 border-red-200",
    icon: PieChart,
    modules: [
      { name: "Reports", url: "/dashboard/reports/sale", icon: PieChart },
      { name: "PDF Center", url: "/dashboard/pdf", icon: Printer },
    ],
  },
  {
    title: "Human Resources",
    description: "Employee and HR management",
    color: "bg-red-50 border-red-200",
    icon: Users,
    modules: [
      { name: "Human Resources", url: "/dashboard/hr/employees", icon: Users },
    ],
  },
  {
    title: "Assets & Projects",
    description: "Asset and project management",
    color: "bg-orange-50 border-orange-200",
    icon: Building,
    modules: [
      { name: "Asset Management", url: "/dashboard/assets", icon: Building },
      { name: "Project Management", url: "/dashboard/projects", icon: ProjectUsers },
    ],
  },
  {
    title: "Portals",
    description: "External stakeholder access",
    color: "bg-blue-50 border-blue-200",
    icon: FileText,
    modules: [
      { name: "Customer Portal", url: "/dashboard/customer-portal/orders", icon: Users },
      { name: "Supplier Portal", url: "/dashboard/supplier-portal/pos", icon: Building },
    ],
  },
  {
    title: "Administration",
    description: "System administration and settings",
    color: "bg-gray-50 border-gray-200",
    icon: ShieldCheck,
    modules: [
      { name: "Users", url: "/dashboard/users/list", icon: Users },
      { name: "Approvals", url: "/dashboard/approvals", icon: ShieldCheck },
      { name: "Audit Logs", url: "/dashboard/audit/logs", icon: ListChecks },
      { name: "Document Management", url: "/dashboard/documents", icon: FileText },
      { name: "Compliance", url: "/dashboard/compliance/rules", icon: ShieldCheck },
      { name: "Settings", url: "/dashboard/settings/company", icon: ShieldCheck },
    ],
  },
];

export default function ModulesOverview() {
  const navigate = useNavigate();
  const totalModules = moduleGroups.reduce((sum, group) => sum + group.modules.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Modules Overview</h1>
        <p className="text-muted-foreground">
          Access all {totalModules} modules organized by department
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalModules}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{moduleGroups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Organized groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Full</div>
            <p className="text-xs text-muted-foreground mt-1">Admin access to all</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Groups */}
      <div className="space-y-6">
        {moduleGroups.map((group, index) => {
          const GroupIcon = group.icon;
          return (
            <Card key={index} className={`border-2 ${group.color}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border">
                      <GroupIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{group.modules.length} modules</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.modules.map((module, moduleIndex) => {
                    const ModuleIcon = module.icon;
                    return (
                      <Button
                        key={moduleIndex}
                        variant="outline"
                        className="h-auto py-3 px-4 justify-start hover:bg-primary/5 hover:border-primary/50 transition-all"
                        onClick={() => navigate(module.url)}
                      >
                        <ModuleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{module.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Modules</p>
              <p className="text-2xl font-bold">{totalModules}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department Groups</p>
              <p className="text-2xl font-bold">{moduleGroups.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Largest Group</p>
              <p className="text-2xl font-bold">
                {Math.max(...moduleGroups.map(g => g.modules.length))}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Your Access</p>
              <p className="text-2xl font-bold">100%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
