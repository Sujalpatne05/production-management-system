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

interface Sale {
  id: string;
  invoiceNo: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: "draft" | "confirmed" | "shipped" | "delivered" | "paid";
  items: number;
  lastUpdate: string;
}

const mockSales: Sale[] = [
  {
    id: "1",
    invoiceNo: "INV-2026-001",
    customer: "ABC Manufacturing Ltd",
    invoiceDate: "2026-01-25",
    dueDate: "2026-02-24",
    totalAmount: 250000,
    paidAmount: 0,
    status: "confirmed",
    items: 5,
    lastUpdate: "2026-01-25",
  },
  {
    id: "2",
    invoiceNo: "INV-2026-002",
    customer: "XYZ Enterprises",
    invoiceDate: "2026-01-20",
    dueDate: "2026-02-04",
    totalAmount: 180000,
    paidAmount: 180000,
    status: "paid",
    items: 3,
    lastUpdate: "2026-01-22",
  },
  {
    id: "3",
    invoiceNo: "INV-2026-003",
    customer: "Global Traders Inc",
    invoiceDate: "2026-01-15",
    dueDate: "2026-01-30",
    totalAmount: 320000,
    paidAmount: 100000,
    status: "shipped",
    items: 8,
    lastUpdate: "2026-01-24",
  },
  {
    id: "4",
    invoiceNo: "INV-2026-004",
    customer: "Industrial Solutions Co",
    invoiceDate: "2026-01-10",
    dueDate: "2026-01-25",
    totalAmount: 95000,
    paidAmount: 0,
    status: "draft",
    items: 2,
    lastUpdate: "2026-01-10",
  },
  {
    id: "5",
    invoiceNo: "INV-2026-005",
    customer: "Tech Innovations Ltd",
    invoiceDate: "2026-01-28",
    dueDate: "2026-03-29",
    totalAmount: 450000,
    paidAmount: 450000,
    status: "paid",
    items: 12,
    lastUpdate: "2026-01-28",
  },
];

export default function SaleListEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "confirmed":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "outline";
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
      case "delivered":
        return <Eye className="h-4 w-4" />;
      case "shipped":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // KPI Calculations
  const totalInvoices = sales.length;
  const pendingPayment = sales.filter((s) => s.paidAmount < s.totalAmount);
  const totalPendingAmount = pendingPayment.reduce(
    (sum, s) => sum + (s.totalAmount - s.paidAmount),
    0
  );
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCollected = sales.reduce((sum, s) => sum + s.paidAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-gray-500">
              {sales.filter((s) => s.status === "confirmed").length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">All invoices</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Amount Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(totalCollected / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">
              {((totalCollected / totalRevenue) * 100).toFixed(0)}% collected
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Pending Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(totalPendingAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">{pendingPayment.length} invoices pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice number or customer..."
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
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="gap-2 w-full md:w-auto"
          onClick={() => navigate("/dashboard/sales/add")}
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>

        <Button variant="outline" className="gap-2 w-full md:w-auto">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Sales</TabsTrigger>
          <TabsTrigger value="pending">Pending Delivery</TabsTrigger>
          <TabsTrigger value="collection">Pending Collection</TabsTrigger>
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
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Collected</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono font-semibold">
                          {sale.invoiceNo}
                        </TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(sale.invoiceDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(sale.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{sale.items}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{sale.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          ₹{sale.paidAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-orange-600 font-semibold">
                          ₹{(sale.totalAmount - sale.paidAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(sale.status)} className="gap-1">
                            {getStatusIcon(sale.status)}
                            {sale.status.toUpperCase()}
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

        {/* Pending Delivery Tab */}
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales
                    .filter((s) => s.status === "confirmed" || s.status === "shipped")
                    .map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono font-semibold">
                          {sale.invoiceNo}
                        </TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{sale.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(sale.status)}>
                            {sale.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Mark Delivered
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Collection Tab */}
        <TabsContent value="collection">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Invoice Amount</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales
                    .filter((s) => s.paidAmount < s.totalAmount)
                    .map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono font-semibold">
                          {sale.invoiceNo}
                        </TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.dueDate}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{sale.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-orange-600 font-semibold">
                          ₹{(sale.totalAmount - sale.paidAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Record Payment
                          </Button>
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
                <p className="text-gray-600">No overdue invoices at the moment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
