import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiClient } from "@/services/apiClient";
import { AuthService } from "@/services/authService";
import { Download, FileText, Filter, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ModuleName = "Sales" | "Purchases" | "Orders" | "Customers" | "Suppliers" | "Products" | "Users";

interface AdminRecord {
  id: string;
  module: ModuleName;
  reference: string;
  status: string;
  amount: number;
  date: string;
}

const ALLOWED_ROLES = ["HR_ADMIN", "SUPER_ADMIN", "Admin"];

const normalizeArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) {
    return payload.data as T[];
  }
  return [];
};

const AdminDashboardReport = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const storedUser = AuthService.getStoredUser();
  const roleNames: string[] = (storedUser?.roles || []).map((role: any) => role.role);
  const hasAccess = roleNames.some((role) => ALLOWED_ROLES.includes(role));

  useEffect(() => {
    const fetchRecords = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        const tenant = localStorage.getItem("tenant");
        const tenantId = tenant ? JSON.parse(tenant)?.id : undefined;
        const tenantQuery = tenantId ? `?tenantId=${tenantId}` : "";

        const [salesRes, purchasesRes, ordersRes, customersRes, suppliersRes, productsRes, usersRes] = await Promise.allSettled([
          apiClient.get(`/sales${tenantQuery}`),
          apiClient.get(`/purchases${tenantQuery}`),
          apiClient.get(`/orders${tenantQuery}`),
          apiClient.get(`/customers${tenantQuery}`),
          apiClient.get(`/suppliers${tenantQuery}`),
          apiClient.get(`/products${tenantQuery}`),
          apiClient.get(`/users`),
        ]);

        const allRecords: AdminRecord[] = [];

        if (salesRes.status === "fulfilled") {
          const sales = normalizeArray<any>(salesRes.value);
          sales.forEach((sale) => {
            allRecords.push({
              id: sale.id,
              module: "Sales",
              reference: sale.invoiceNo || sale.id,
              status: sale.status || "-",
              amount: Number(sale.total || sale.subtotal || 0),
              date: sale.createdAt || sale.saleDate || sale.date || new Date().toISOString(),
            });
          });
        }

        if (purchasesRes.status === "fulfilled") {
          const purchases = normalizeArray<any>(purchasesRes.value);
          purchases.forEach((purchase) => {
            allRecords.push({
              id: purchase.id,
              module: "Purchases",
              reference: purchase.poNo || purchase.invoiceNo || purchase.id,
              status: purchase.status || "-",
              amount: Number(purchase.total || purchase.subtotal || 0),
              date: purchase.createdAt || purchase.purchaseDate || new Date().toISOString(),
            });
          });
        }

        if (ordersRes.status === "fulfilled") {
          const orders = normalizeArray<any>(ordersRes.value);
          orders.forEach((order) => {
            allRecords.push({
              id: order.id,
              module: "Orders",
              reference: order.orderNo || order.referenceNo || order.id,
              status: order.status || "-",
              amount: Number(order.total || 0),
              date: order.createdAt || order.orderDate || new Date().toISOString(),
            });
          });
        }

        if (customersRes.status === "fulfilled") {
          const customers = normalizeArray<any>(customersRes.value);
          customers.forEach((customer) => {
            allRecords.push({
              id: customer.id,
              module: "Customers",
              reference: customer.name || customer.email || customer.id,
              status: customer.status || "active",
              amount: 0,
              date: customer.createdAt || new Date().toISOString(),
            });
          });
        }

        if (suppliersRes.status === "fulfilled") {
          const suppliers = normalizeArray<any>(suppliersRes.value);
          suppliers.forEach((supplier) => {
            allRecords.push({
              id: supplier.id,
              module: "Suppliers",
              reference: supplier.name || supplier.email || supplier.id,
              status: supplier.status || "active",
              amount: 0,
              date: supplier.createdAt || new Date().toISOString(),
            });
          });
        }

        if (productsRes.status === "fulfilled") {
          const products = normalizeArray<any>(productsRes.value);
          products.forEach((product) => {
            allRecords.push({
              id: product.id,
              module: "Products",
              reference: product.name || product.sku || product.id,
              status: product.status || "active",
              amount: Number(product.sellingPrice || product.cost || 0),
              date: product.createdAt || new Date().toISOString(),
            });
          });
        }

        if (usersRes.status === "fulfilled") {
          const users = normalizeArray<any>(usersRes.value);
          users.forEach((user) => {
            allRecords.push({
              id: user.id,
              module: "Users",
              reference: user.fullName || user.email || user.id,
              status: user.status || "active",
              amount: 0,
              date: user.createdAt || new Date().toISOString(),
            });
          });
        }

        allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecords(allRecords);
      } catch (error) {
        toast({
          title: "Failed to load admin data",
          description: "Please try again or check permissions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [hasAccess, toast]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesModule = moduleFilter === "all" || item.module === moduleFilter;
      const matchesSearch =
        item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase());

      const itemDate = new Date(item.date);
      const matchesStart = !startDate || itemDate >= new Date(startDate);
      const matchesEnd = !endDate || itemDate <= new Date(`${endDate}T23:59:59`);

      return matchesModule && matchesSearch && matchesStart && matchesEnd;
    });
  }, [records, moduleFilter, searchTerm, startDate, endDate]);

  const totalAmount = filteredRecords.reduce((sum, item) => sum + item.amount, 0);

  const byModule = useMemo(() => {
    return filteredRecords.reduce<Record<string, number>>((acc, item) => {
      acc[item.module] = (acc[item.module] || 0) + 1;
      return acc;
    }, {});
  }, [filteredRecords]);

  const handleExportCsv = () => {
    const csv = [
      ["Module", "Reference", "Status", "Amount", "Date"].join(","),
      ...filteredRecords.map((row) =>
        [row.module, `"${row.reference}"`, row.status, row.amount.toFixed(2), new Date(row.date).toLocaleString()].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-dashboard-report-${new Date().toISOString()}.csv`;
    a.click();
  };

  const handleExportPdf = () => {
    const content = `
      <html>
        <head><title>Admin Dashboard Report</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Admin Dashboard Report</h2>
          <p>Total Records: ${filteredRecords.length}</p>
          <p>Total Amount: ₹${totalAmount.toFixed(2)}</p>
          <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Module</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords
                .map(
                  (row) =>
                    `<tr><td>${row.module}</td><td>${row.reference}</td><td>${row.status}</td><td>₹${row.amount.toFixed(2)}</td><td>${new Date(
                      row.date
                    ).toLocaleString()}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=1000,height=700");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-destructive" />
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is available only for HR_ADMIN, SUPER_ADMIN, or Admin roles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard Reports</h1>
          <p className="text-muted-foreground">Unified operational data view for HR/Admin with export options.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button onClick={handleExportPdf} className="gap-2">
            <FileText className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Records</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{filteredRecords.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Amount</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Modules Covered</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{Object.keys(byModule).length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Search reference or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Purchases">Purchases</SelectItem>
                <SelectItem value="Orders">Orders</SelectItem>
                <SelectItem value="Customers">Customers</SelectItem>
                <SelectItem value="Suppliers">Suppliers</SelectItem>
                <SelectItem value="Products">Products</SelectItem>
                <SelectItem value="Users">Users</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {Object.entries(byModule).map(([module, count]) => (
              <Badge key={module} variant="secondary">{module}: {count}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data View</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading admin report data...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground">No records found for selected filters.</p>
          ) : (
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((row) => (
                    <TableRow key={`${row.module}-${row.id}`}>
                      <TableCell><Badge variant="outline">{row.module}</Badge></TableCell>
                      <TableCell className="font-medium">{row.reference}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell className="text-right">₹{row.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardReport;
