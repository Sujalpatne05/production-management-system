import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, Calendar, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ['hsl(262, 83%, 58%)', 'hsl(142, 76%, 36%)', 'hsl(217, 91%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

const SaleReport = () => {
  const { sales, customers, products } = useStore();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = parseISO(sale.date);
      return isWithinInterval(saleDate, {
        start: parseISO(startDate),
        end: parseISO(endDate)
      });
    });
  }, [sales, startDate, endDate]);

  const summaryStats = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalPaid = filteredSales.reduce((sum, sale) => sum + sale.paid, 0);
    const totalDue = filteredSales.reduce((sum, sale) => sum + sale.due, 0);
    const totalOrders = filteredSales.length;
    return { totalSales, totalPaid, totalDue, totalOrders };
  }, [filteredSales]);

  const dailySalesData = useMemo(() => {
    const dailyMap = new Map<string, number>();
    filteredSales.forEach(sale => {
      const date = sale.date;
      dailyMap.set(date, (dailyMap.get(date) || 0) + sale.total);
    });
    return Array.from(dailyMap.entries())
      .map(([date, total]) => ({ date: format(parseISO(date), 'MMM dd'), total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredSales]);

  const customerSalesData = useMemo(() => {
    const customerMap = new Map<string, number>();
    filteredSales.forEach(sale => {
      const customer = customers.find(c => c.id === sale.customerId);
      const name = customer?.name || 'Unknown';
      customerMap.set(name, (customerMap.get(name) || 0) + sale.total);
    });
    return Array.from(customerMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredSales, customers]);

  const productSalesData = useMemo(() => {
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const name = product?.name || 'Unknown';
        const existing = productMap.get(name) || { quantity: 0, revenue: 0 };
        productMap.set(name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.quantity * item.price)
        });
      });
    });
    return Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredSales, products]);

  const exportToCSV = () => {
    const headers = ["Invoice No", "Customer", "Date", "Total", "Paid", "Due", "Status"];
    const rows = filteredSales.map(sale => {
      const customer = customers.find(c => c.id === sale.customerId);
      return [
        sale.invoiceNo,
        customer?.name || "Unknown",
        sale.date,
        sale.total.toFixed(2),
        sale.paid.toFixed(2),
        sale.due.toFixed(2),
        sale.status
      ];
    });
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sale-report-₹{startDate}-to-₹{endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sale Report</h1>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summaryStats.totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{summaryStats.totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">₹{summaryStats.totalDue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(262, 83%, 58%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(262, 83%, 58%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `₹{name} (₹{(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerSalesData.map((_, index) => (
                    <Cell key={`cell-₹{index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSalesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="name" type="category" width={100} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="revenue" fill="hsl(262, 83%, 58%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map(sale => {
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                    <TableCell>{customer?.name || "Unknown"}</TableCell>
                    <TableCell>{format(parseISO(sale.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-right">₹{sale.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-success">₹{sale.paid.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-destructive">₹{sale.due.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
                        sale.status === 'paid' ? 'bg-success/10 text-success' :
                        sale.status === 'partial' ? 'bg-warning/10 text-warning' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {sale.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No sales found in the selected date range
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleReport;