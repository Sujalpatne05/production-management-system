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
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  FileText,
} from "lucide-react";

interface Purchase {
  id: string;
  poNo: string;
  supplier: string;
  poDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: "draft" | "confirmed" | "received" | "billed" | "paid";
  items: number;
  lastUpdate: string;
}

const mockPurchases: Purchase[] = [
  {
    id: "1",
    poNo: "PO-2026-001",
    supplier: "Industrial Supplies Co",
    poDate: "2026-01-25",
    dueDate: "2026-02-24",
    totalAmount: 150000,
    paidAmount: 0,
    status: "confirmed",
    items: 5,
    lastUpdate: "2026-01-25",
  },
  {
    id: "2",
    poNo: "PO-2026-002",
    supplier: "Premium Materials Ltd",
    poDate: "2026-01-20",
    dueDate: "2026-02-04",
    totalAmount: 280000,
    paidAmount: 280000,
    status: "paid",
    items: 8,
    lastUpdate: "2026-01-22",
  },
  {
    id: "3",
    poNo: "PO-2026-003",
    supplier: "Industrial Supplies Co",
    poDate: "2026-01-15",
    dueDate: "2026-01-30",
    totalAmount: 95000,
    paidAmount: 50000,
    status: "received",
    items: 3,
    lastUpdate: "2026-01-24",
  },
  {
    id: "4",
    poNo: "PO-2026-004",
    supplier: "Eco Materials",
    poDate: "2026-01-10",
    dueDate: "2026-01-25",
    totalAmount: 45000,
    paidAmount: 0,
    status: "draft",
    items: 2,
    lastUpdate: "2026-01-10",
  },
];

export default function PurchaseListEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      p.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "confirmed":
        return "default";
      case "received":
        return "outline";
      case "billed":
        return "default";
      case "paid":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "received":
        return <Eye className="h-4 w-4" />;
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // KPI Calculations
  const totalOrders = purchases.length;
  const pendingPayment = purchases.filter((p) => p.paidAmount < p.totalAmount);
  const totalPendingAmount = pendingPayment.reduce(
    (sum, p) => sum + (p.totalAmount - p.paidAmount),
    0
  );
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const overallValue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-gray-500">
              {purchases.filter((p) => p.status === "confirmed").length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(overallValue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">All purchase orders</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Pending Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{(totalPendingAmount / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-gray-500">{pendingPayment.length} orders pending</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Fully Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {purchases.filter((p) => p.paidAmount === p.totalAmount).length}
            </div>
            <p className="text-xs text-gray-500">Orders with full payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by PO number or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="billed">Billed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="gap-2 w-full md:w-auto"
          onClick={() => navigate("/dashboard/purchases/add")}
        >
          <Plus className="h-4 w-4" />
          New Purchase Order
        </Button>

        <Button variant="outline" className="gap-2 w-full md:w-auto">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Purchases</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO No</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>PO Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono font-semibold">
                          {purchase.poNo}
                        </TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(purchase.poDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(purchase.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{purchase.items}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{purchase.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          ₹{purchase.paidAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-orange-600 font-semibold">
                          ₹{(purchase.totalAmount - purchase.paidAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(purchase.status)} className="gap-1">
                            {getStatusIcon(purchase.status)}
                            {purchase.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/dashboard/purchases/view/${purchase.id}`)}
                            >
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

        {/* Pending Approval Tab */}
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO No</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases
                    .filter((p) => p.status === "draft" || p.status === "confirmed")
                    .map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono font-semibold">
                          {purchase.poNo}
                        </TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{purchase.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(purchase.status)}>
                            {purchase.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Received Tab */}
        <TabsContent value="received">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO No</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Items Received</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases
                    .filter((p) => p.status === "received" || p.status === "billed")
                    .map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono font-semibold">
                          {purchase.poNo}
                        </TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell>{purchase.lastUpdate}</TableCell>
                        <TableCell>{purchase.items}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{purchase.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue Tab */}
        <TabsContent value="overdue">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-gray-600">No overdue orders at the moment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
