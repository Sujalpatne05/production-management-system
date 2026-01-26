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
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Download,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Wallet,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
} from "lucide-react";

interface Payment {
  id: string;
  supplierId: string;
  supplierName: string;
  paymentNo: string;
  poNo: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  method: "bank-transfer" | "cheque" | "credit" | "upi";
  status: "pending" | "partially-paid" | "paid" | "overdue" | "cancelled";
  bankDetails?: string;
  remarks: string;
}

interface SupplierBalance {
  supplierId: string;
  supplierName: string;
  totalInvoiced: number;
  totalPaid: number;
  outstanding: number;
  creditLimit: number;
  lastPaymentDate: string;
  rating: number;
}

const mockPayments: Payment[] = [
  {
    id: "1",
    supplierId: "SUP-001",
    supplierName: "Industrial Supplies Co",
    paymentNo: "PMT-2026-001",
    poNo: "PO-2026-001",
    amount: 150000,
    paymentDate: "2026-02-10",
    dueDate: "2026-02-24",
    method: "bank-transfer",
    status: "pending",
    bankDetails: "ICICI Bank, A/C: XXXX-XXXX-XXXX",
    remarks: "Against PO-2026-001",
  },
  {
    id: "2",
    supplierId: "SUP-002",
    supplierName: "Premium Materials Ltd",
    paymentNo: "PMT-2026-002",
    poNo: "PO-2026-002",
    amount: 280000,
    paymentDate: "2026-01-22",
    dueDate: "2026-01-22",
    method: "bank-transfer",
    status: "paid",
    bankDetails: "HDFC Bank, A/C: XXXX-XXXX-XXXX",
    remarks: "Full payment",
  },
  {
    id: "3",
    supplierId: "SUP-001",
    supplierName: "Industrial Supplies Co",
    paymentNo: "PMT-2026-003",
    poNo: "PO-2026-003",
    amount: 95000,
    paymentDate: "2026-01-30",
    dueDate: "2026-01-30",
    method: "cheque",
    status: "paid",
    bankDetails: "Cheque #123456",
    remarks: "Partial payment for PO-2026-003",
  },
  {
    id: "4",
    supplierId: "SUP-003",
    supplierName: "Eco Materials",
    paymentNo: "PMT-2026-004",
    poNo: "PO-2026-004",
    amount: 45000,
    paymentDate: "2026-01-15",
    dueDate: "2026-01-25",
    method: "credit",
    status: "overdue",
    remarks: "On credit terms",
  },
];

const mockSupplierBalances: SupplierBalance[] = [
  {
    supplierId: "SUP-001",
    supplierName: "Industrial Supplies Co",
    totalInvoiced: 245000,
    totalPaid: 50000,
    outstanding: 195000,
    creditLimit: 500000,
    lastPaymentDate: "2026-01-30",
    rating: 4.5,
  },
  {
    supplierId: "SUP-002",
    supplierName: "Premium Materials Ltd",
    totalInvoiced: 280000,
    totalPaid: 280000,
    outstanding: 0,
    creditLimit: 750000,
    lastPaymentDate: "2026-01-22",
    rating: 5,
  },
  {
    supplierId: "SUP-003",
    supplierName: "Eco Materials",
    totalInvoiced: 45000,
    totalPaid: 0,
    outstanding: 45000,
    creditLimit: 200000,
    lastPaymentDate: "-",
    rating: 3.5,
  },
];

export default function SupplierPaymentsEnhanced() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.poNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesMethod = methodFilter === "all" || p.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "partially-paid":
        return "outline";
      case "overdue":
        return "destructive";
      case "cancelled":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "partially-paid":
        return <Wallet className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // KPI Calculations
  const totalPaymentAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === "paid" || p.status === "partially-paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = mockSupplierBalances.reduce((sum, s) => sum + s.outstanding, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Supplier Payment Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Payable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalPaymentAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">{payments.length} invoices</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Paid Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(paidAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">
              {((paidAmount / totalPaymentAmount) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{(pendingAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">
              {payments.filter((p) => p.status === "pending").length} payments
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(overdueAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">
              {payments.filter((p) => p.status === "overdue").length} overdue
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-orange-600" />
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(totalOutstanding / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">Across all suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by supplier, PO, or payment no..."
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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partially-paid">Partially Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
          </SelectContent>
        </Select>

        <Button className="gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          New Payment
        </Button>

        <Button variant="outline" className="gap-2 w-full md:w-auto">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Balances</TabsTrigger>
          <TabsTrigger value="analysis">Payment Analysis</TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment No</TableHead>
                      <TableHead>PO No</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono font-semibold">
                          {payment.paymentNo}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payment.poNo}</TableCell>
                        <TableCell>{payment.supplierName}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{payment.dueDate}</TableCell>
                        <TableCell className="text-sm">{payment.paymentDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.method.replace("-", " ").toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payment.status)} className="gap-1">
                            {getStatusIcon(payment.status)}
                            {payment.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Send className="h-4 w-4 text-blue-500" />
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

        {/* Supplier Balances Tab */}
        <TabsContent value="suppliers">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockSupplierBalances.map((supplier) => (
                  <div key={supplier.supplierId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-lg">{supplier.supplierName}</p>
                        <p className="text-xs text-gray-500">{supplier.supplierId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">
                          ₹{supplier.outstanding.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Outstanding</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-gray-600">Total Invoiced</p>
                        <p className="font-bold">₹{supplier.totalInvoiced.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs text-gray-600">Total Paid</p>
                        <p className="font-bold text-green-600">₹{supplier.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <p className="text-xs text-gray-600">Credit Limit</p>
                        <p className="font-bold">₹{supplier.creditLimit.toLocaleString()}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <p className="text-xs text-gray-600">Rating</p>
                        <p className="font-bold">⭐ {supplier.rating}/5</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Last Payment: {supplier.lastPaymentDate}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Invoices
                        </Button>
                        <Button size="sm">
                          <Send className="h-3 w-3 mr-1" />
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Payment Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Paid</span>
                      <span className="text-sm font-bold">
                        {((
                          payments.filter((p) => p.status === "paid").length /
                          payments.length
                        ) * 100).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${((
                            payments.filter((p) => p.status === "paid").length /
                            payments.length
                          ) * 100).toFixed(0)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm font-bold">
                        {((
                          payments.filter((p) => p.status === "pending").length /
                          payments.length
                        ) * 100).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${((
                            payments.filter((p) => p.status === "pending").length /
                            payments.length
                          ) * 100).toFixed(0)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overdue</span>
                      <span className="text-sm font-bold">
                        {((
                          payments.filter((p) => p.status === "overdue").length /
                          payments.length
                        ) * 100).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${((
                            payments.filter((p) => p.status === "overdue").length /
                            payments.length
                          ) * 100).toFixed(0)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Payment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Average Payment Time</span>
                    <span className="font-bold">15 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">On-time Payment Rate</span>
                    <span className="font-bold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Avg Invoice Value</span>
                    <span className="font-bold">
                      ₹{(totalPaymentAmount / payments.length).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Total Suppliers</span>
                    <span className="font-bold">{mockSupplierBalances.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
