import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  FileText,
  Package,
  BarChart3,
  Star,
} from "lucide-react";

interface Order {
  id: string;
  orderNo: string;
  customer: string;
  customerRating: number;
  orderDate: string;
  expectedDate: string;
  deliveredDate?: string;
  totalAmount: number;
  amountPaid: number;
  status: "pending" | "confirmed" | "processing" | "ready" | "delivered" | "completed";
  items: number;
  priority: "low" | "medium" | "high" | "urgent";
  lastUpdate: string;
  satisfaction?: number; // 1-5 stars
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNo: "ORD-2026-001",
    customer: "ABC Manufacturing Ltd",
    customerRating: 4.8,
    orderDate: "2026-01-25",
    expectedDate: "2026-02-10",
    totalAmount: 350000,
    amountPaid: 100000,
    status: "processing",
    items: 6,
    priority: "high",
    lastUpdate: "2026-01-26",
    satisfaction: 4.5,
  },
  {
    id: "2",
    orderNo: "ORD-2026-002",
    customer: "XYZ Enterprises",
    customerRating: 4.5,
    orderDate: "2026-01-22",
    expectedDate: "2026-02-05",
    deliveredDate: "2026-02-04",
    totalAmount: 180000,
    amountPaid: 180000,
    status: "delivered",
    items: 4,
    priority: "medium",
    lastUpdate: "2026-01-25",
    satisfaction: 5,
  },
  {
    id: "3",
    orderNo: "ORD-2026-003",
    customer: "Global Traders Inc",
    customerRating: 4.7,
    orderDate: "2026-01-20",
    expectedDate: "2026-01-30",
    deliveredDate: "2026-01-29",
    totalAmount: 420000,
    amountPaid: 420000,
    status: "completed",
    items: 10,
    priority: "urgent",
    lastUpdate: "2026-01-28",
    satisfaction: 4.8,
  },
  {
    id: "4",
    orderNo: "ORD-2026-004",
    customer: "Industrial Solutions Co",
    customerRating: 4.6,
    orderDate: "2026-01-18",
    expectedDate: "2026-02-15",
    totalAmount: 95000,
    amountPaid: 0,
    status: "pending",
    items: 2,
    priority: "low",
    lastUpdate: "2026-01-18",
  },
  {
    id: "5",
    orderNo: "ORD-2026-005",
    customer: "Tech Innovations Ltd",
    customerRating: 4.9,
    orderDate: "2026-01-28",
    expectedDate: "2026-02-25",
    totalAmount: 550000,
    amountPaid: 275000,
    status: "confirmed",
    items: 15,
    priority: "high",
    lastUpdate: "2026-01-28",
    satisfaction: 4.7,
  },
];

export default function OrdersEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || o.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "delivered":
        return "default";
      case "ready":
        return "outline";
      case "processing":
        return "secondary";
      case "confirmed":
        return "outline";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />;
      case "ready":
        return <Package className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // KPI Calculations
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "delivered"
  ).length;
  const inProgressOrders = orders.filter(
    (o) => o.status === "processing" || o.status === "confirmed"
  ).length;
  const totalOrderValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRevenue = orders.filter((o) => o.status === "completed" || o.status === "delivered").reduce((sum, o) => sum + o.totalAmount, 0);
  const avgCustomerSatisfaction = orders.filter((o) => o.satisfaction).reduce((sum, o) => sum + (o.satisfaction || 0), 0) / orders.filter((o) => o.satisfaction).length || 0;
  const onTimeDelivery = orders.filter((o) => o.deliveredDate && o.deliveredDate <= o.expectedDate).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Orders & Fulfillment" />

      {/* KPI Cards - Customer Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-teal-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-teal-600" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700">{totalOrders}</div>
            <p className="text-xs text-teal-600">
              {completedOrders} delivered, {inProgressOrders} processing
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-emerald-600">Completed & delivered</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-600" />
              Avg Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{avgCustomerSatisfaction.toFixed(1)}/5</div>
            <p className="text-xs text-orange-600">{orders.filter((o) => o.satisfaction).length} rated</p>
          </CardContent>
        </Card>

        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-violet-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
              On-Time Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700">
              {completedOrders > 0 ? ((onTimeDelivery / completedOrders) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-violet-600">{onTimeDelivery} delivered on time</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="gap-2 w-full md:w-auto"
          onClick={() => navigate("/dashboard/orders/add")}
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>

        <Button variant="outline" className="gap-2 w-full md:w-auto">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Orders</TabsTrigger>
          <TabsTrigger value="urgent">High Priority</TabsTrigger>
          <TabsTrigger value="processing">In Fulfillment</TabsTrigger>
          <TabsTrigger value="ready">Ready for Delivery</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order No</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>⭐ Rating</TableHead>
                      <TableHead>😊 Satisfaction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-semibold">
                          {order.orderNo}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.expectedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{order.items}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-orange-600 font-semibold">
                            <Star className="h-4 w-4 fill-orange-400" />
                            {order.customerRating}/5
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {order.satisfaction ? (
                              <>
                                <span className="text-lg">⭐</span>
                                <span className="text-amber-600 font-semibold">{order.satisfaction}/5</span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm">Not rated</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)} className="gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Urgent Tab */}
        <TabsContent value="urgent">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((o) => o.priority === "urgent")
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-semibold">
                          {order.orderNo}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-sm">{order.expectedDate}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((o) => o.status === "processing" || o.status === "confirmed")
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-semibold">
                          {order.orderNo}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: "60%" }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.items}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ready to Ship Tab */}
        <TabsContent value="ready">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((o) => o.status === "ready")
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-semibold">
                          {order.orderNo}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                            <Package className="h-3 w-3" />
                            Ship Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
