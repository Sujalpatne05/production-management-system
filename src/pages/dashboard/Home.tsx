import { useMemo, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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

const alerts = [
  { id: 1, type: "warning", message: "Stock low: MS Plate 5mm (120 units left)", time: "5m ago" },
  { id: 2, type: "success", message: "Production PRO-1022 completed", time: "1h ago" },
  { id: 3, type: "info", message: "New supplier added to Procurement", time: "2h ago" },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = mockProductionData.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const metrics = useMemo(
    () => ({
      running: mockProductionData.filter((p) => p.status === "Running").length,
      completed: mockProductionData.filter((p) => p.status === "Completed").length,
      delayed: mockProductionData.filter((p) => p.status === "Delayed").length,
      revenueToday: "₹12.4L",
    }),
    []
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <Alert className="bg-warning/10 border-warning text-sm">
        <AlertDescription className="text-warning-foreground">
          Demo mode: destructive actions are disabled.
        </AlertDescription>
      </Alert>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><PlayCircle className="h-4 w-4" /> Running</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-700">{metrics.running}</div></CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Completed</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-700">{metrics.completed}</div></CardContent>
        </Card>
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><Clock3 className="h-4 w-4" /> Delayed</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-orange-700">{metrics.delayed}</div></CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Revenue Today</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-700">{metrics.revenueToday}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile and Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Profile & Actions</CardTitle>
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
              <Button variant="default" className="gap-2" onClick={() => navigate("/dashboard/production/add-enhanced")}> <Factory className="h-4 w-4" /> New Production </Button>
              <Button variant="outline" className="gap-2" onClick={() => navigate("/dashboard/sales/add")}> <ShoppingBag className="h-4 w-4" /> New Sale </Button>
            </div>
          </CardContent>
        </Card>

        {/* Running Productions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Running Productions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search production"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
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
                    <TableRow key={item.referenceNo}>
                      <TableCell className="font-medium">{item.referenceNo}</TableCell>
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
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>Showing {filteredData.length} of {mockProductionData.length} entries</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Alerts & Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3 rounded-md border px-3 py-2">
              {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
              {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {alert.type === "info" && <Clock3 className="h-4 w-4 text-blue-500" />}
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              <Button size="sm" variant="ghost">View</Button>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default Home;
