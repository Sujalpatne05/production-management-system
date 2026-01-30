import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Area, Legend } from "recharts";
import { format, parseISO, isWithinInterval, eachDayOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";

const ProfitLossReport = () => {
  const { sales, purchases, expenses, products } = useStore();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
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

  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      const purchaseDate = parseISO(purchase.date);
      return isWithinInterval(purchaseDate, {
        start: parseISO(startDate),
        end: parseISO(endDate)
      });
    });
  }, [purchases, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, {
        start: parseISO(startDate),
        end: parseISO(endDate)
      });
    });
  }, [expenses, startDate, endDate]);

  const summaryStats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calculate COGS (Cost of Goods Sold)
    let totalCOGS = 0;
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          totalCOGS += product.cost * item.quantity;
        }
      });
    });
    
    const grossProfit = totalRevenue - totalCOGS;
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    return { 
      totalRevenue, 
      totalCOGS, 
      grossProfit, 
      totalExpenses, 
      netProfit,
      profitMargin
    };
  }, [filteredSales, filteredExpenses, products]);

  const monthlyProfitData = useMemo(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const months = eachMonthOfInterval({ start, end });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthSales = filteredSales.filter(sale => {
        const date = parseISO(sale.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });
      
      const monthExpenses = filteredExpenses.filter(expense => {
        const date = parseISO(expense.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });
      
      const revenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);
      
      let cogs = 0;
      monthSales.forEach(sale => {
        sale.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            cogs += product.cost * item.quantity;
          }
        });
      });
      
      const expenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      const profit = revenue - cogs - expenseTotal;
      
      return {
        month: format(month, 'MMM yyyy'),
        revenue,
        cogs,
        expenses: expenseTotal,
        profit
      };
    });
  }, [filteredSales, filteredExpenses, products, startDate, endDate]);

  const productProfitData = useMemo(() => {
    const productMap = new Map<string, { revenue: number; cost: number; profit: number }>();
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const name = product.name;
          const existing = productMap.get(name) || { revenue: 0, cost: 0, profit: 0 };
          const itemRevenue = item.quantity * item.price;
          const itemCost = item.quantity * product.cost;
          productMap.set(name, {
            revenue: existing.revenue + itemRevenue,
            cost: existing.cost + itemCost,
            profit: existing.profit + (itemRevenue - itemCost)
          });
        }
      });
    });
    
    return Array.from(productMap.entries())
      .map(([name, data]) => ({ 
        name, 
        ...data,
        margin: data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);
  }, [filteredSales, products]);

  const exportToCSV = () => {
    const headers = ["Category", "Amount"];
    const rows = [
      ["Total Revenue", summaryStats.totalRevenue.toFixed(2)],
      ["Cost of Goods Sold", summaryStats.totalCOGS.toFixed(2)],
      ["Gross Profit", summaryStats.grossProfit.toFixed(2)],
      ["Operating Expenses", summaryStats.totalExpenses.toFixed(2)],
      ["Net Profit", summaryStats.netProfit.toFixed(2)],
      ["Profit Margin", `₹{summaryStats.profitMargin.toFixed(2)}%`]
    ];
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-loss-report-₹{startDate}-to-₹{endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profit & Loss Report</h1>
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
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summaryStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COGS</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summaryStats.totalCOGS.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{summaryStats.grossProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">₹{summaryStats.totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ₹{summaryStats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              ₹{summaryStats.netProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ₹{summaryStats.profitMargin >= 0 ? 'text-success' : 'text-destructive'}`}>
              {summaryStats.profitMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue vs Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={monthlyProfitData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cogs" name="COGS" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="profit" name="Net Profit" stroke="hsl(142, 76%, 36%)" strokeWidth={3} dot={{ fill: 'hsl(142, 76%, 36%)' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Product Profitability</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productProfitData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="name" type="category" width={100} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'profit') return [`₹{value.toFixed(2)}`, 'Profit'];
                  return [`₹{value.toFixed(2)}`, name];
                }}
              />
              <Bar dataKey="profit" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* P&L Statement Table */}
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Revenue (Sales)</TableCell>
                <TableCell className="text-right font-medium">₹{summaryStats.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium pl-8">Less: Cost of Goods Sold</TableCell>
                <TableCell className="text-right text-destructive">-₹{summaryStats.totalCOGS.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Gross Profit</TableCell>
                <TableCell className="text-right font-bold text-success">₹{summaryStats.grossProfit.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium pl-8">Less: Operating Expenses</TableCell>
                <TableCell className="text-right text-destructive">-₹{summaryStats.totalExpenses.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="border-t-2 bg-primary/5">
                <TableCell className="font-bold text-lg">Net Profit / (Loss)</TableCell>
                <TableCell className={`text-right font-bold text-lg ₹{summaryStats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ₹{summaryStats.netProfit.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Profit Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Profit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productProfitData.map(product => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">₹{product.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{product.cost.toFixed(2)}</TableCell>
                  <TableCell className={`text-right font-medium ₹{product.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ₹{product.profit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{product.margin}%</TableCell>
                </TableRow>
              ))}
              {productProfitData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No product data found in the selected date range
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

export default ProfitLossReport;