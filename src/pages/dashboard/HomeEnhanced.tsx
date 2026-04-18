import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Key,
  ShieldQuestion,
  LogOut,
  Download,
  Search,
  PlayCircle,
  Factory,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductionMetricsWidget } from "@/components/dashboard/ProductionMetricsWidget";
import { AlertsNotificationPanel } from "@/components/dashboard/AlertsNotificationPanel";
import { DrillDownModal } from "@/components/dashboard/DrillDownModal";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import {
  generateProductionMetrics,
  generateAlerts,
  ProductionMetrics,
  AlertData,
} from "@/services/productionMetricsService";

interface ProductionData {
  referenceNo: string;
  product: string;
  startDate: string;
  consumedTime: string;
  productionCost: string;
  salePrice: string;
  status: "Running" | "Completed" | "Delayed";
}

const mockProductionData: ProductionData[] = [
  {
    referenceNo: "PRO-1023",
    product: "MS Angle 50x50x5",
    startDate: "2026-01-24",
    consumedTime: "18h",
    productionCost: "₹2.45L",
    salePrice: "₹3.60L",
    status: "Running",
  },
  {
    referenceNo: "PRO-1022",
    product: "Steel Rod 12mm",
    startDate: "2026-01-23",
    consumedTime: "22h",
    productionCost: "₹1.95L",
    salePrice: "₹2.90L",
    status: "Completed",
  },
  {
    referenceNo: "PRO-1021",
    product: "SS Sheet 316L",
    startDate: "2026-01-22",
    consumedTime: "28h",
    productionCost: "₹2.90L",
    salePrice: "₹4.10L",
    status: "Delayed",
  },
];

const HomeEnhanced = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState<ProductionMetrics>(
    generateProductionMetrics()
  );
  const [alerts, setAlerts] = useState<AlertData[]>(generateAlerts());
  const [drillDownMetric, setDrillDownMetric] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Real-time updates hook
  const { startPolling } = useRealTimeUpdates({
    interval: 30000,
    onUpdate: handleRefresh,
    enabled: true,
  });

  function handleRefresh() {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics(generateProductionMetrics());
      setAlerts(generateAlerts());
      setLastUpdateTime(new Date());
      setIsRefreshing(false);
    }, 500);
  }

  const handleDismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleMarkAlertAsRead = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  }, []);

  const handleAlertNavigate = useCallback(
    (url: string) => {
      navigate(url);
    },
    [navigate]
  );

  const filteredData = mockProductionData.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatUpdateTime = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdateTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return `${seconds}s ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Last updated: {formatUpdateTime()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Production Metrics Widget */}
      <ProductionMetricsWidget
        metrics={metrics}
        onDrillDown={setDrillDownMetric}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setDrillDownMetric("running")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700 flex items-center gap-2">
              <PlayCircle className="h-4 w-4" /> Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {metrics.runningProduction}
            </div>
            <p className="text-xs text-gray-600 mt-1">Click to view details</p>
          </CardContent>
        </Card>
        <Card
          className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setDrillDownMetric("completed")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {metrics.completedProduction}
            </div>
            <p className="text-xs text-gray-600 mt-1">Click to view details</p>
          </CardContent>
        </Card>
        <Card
          className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setDrillDownMetric("delayed")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700 flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Delayed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">
              {metrics.delayedProduction}
            </div>
            <p className="text-xs text-gray-600 mt-1">Click to view details</p>
          </CardContent>
        </Card>
        <Card
          className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setDrillDownMetric("total")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {metrics.totalProduction}
            </div>
            <p className="text-xs text-gray-600 mt-1">Click to view details</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile and Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Profile & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
                  A
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">Admin</h3>
                <p className="text-sm text-muted-foreground">admin@doorsoft.co</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/change-profile")}
              >
                <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-info" />
                </div>
                Change Profile
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/change-password")}
              >
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-success" />
                </div>
                Change Password
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/security-question")}
              >
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <ShieldQuestion className="w-4 h-4 text-warning" />
                </div>
                Set Security Question
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => navigate("/login")}
              >
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-destructive" />
                </div>
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="default"
                className="gap-2"
                onClick={() => navigate("/dashboard/production/add-enhanced")}
              >
                <Factory className="h-4 w-4" /> New Production
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/dashboard/sales/add")}
              >
                <ShoppingBag className="h-4 w-4" /> New Sale
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Running Productions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
            <CardTitle className="text-base sm:text-lg">
              Running Productions
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search production"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Consumed Time</TableHead>
                    <TableHead>Production Cost</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.referenceNo}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        navigate(`/dashboard/production/${item.referenceNo}`)
                      }
                    >
                      <TableCell className="font-medium">
                        {item.referenceNo}
                      </TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell className="text-xs">{item.consumedTime}</TableCell>
                      <TableCell>{item.productionCost}</TableCell>
                      <TableCell>{item.salePrice}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.status === "Running"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm text-muted-foreground">
              <span>
                Showing {filteredData.length} of {mockProductionData.length}{" "}
                entries
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  Previous
                </Button>
                <Button size="sm" className="flex-1 sm:flex-none">
                  1
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <AlertsNotificationPanel
        alerts={alerts}
        onDismiss={handleDismissAlert}
        onMarkAsRead={handleMarkAlertAsRead}
        onNavigate={handleAlertNavigate}
      />

      {/* Drill-Down Modal */}
      <DrillDownModal
        isOpen={drillDownMetric !== null}
        metric={drillDownMetric}
        onClose={() => setDrillDownMetric(null)}
      />
    </div>
  );
};

export default HomeEnhanced;
