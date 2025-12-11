import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface OrderForecast {
  orderId: string;
  customer: string;
  totalQuantity: number;
  totalValue: number;
  date: string;
  trend: "up" | "down" | "stable";
  forecastedDemand: number;
  demandChange: number;
}

const DemandForecastingByOrder = () => {
  const { sales } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("30"); // days

  // Calculate demand forecasting data
  const forecastData = useMemo(() => {
    const groupedByOrder = sales.reduce(
      (acc, sale) => {
        if (!acc[sale.invoiceNo]) {
          acc[sale.invoiceNo] = {
            orderId: sale.invoiceNo,
            customer: sale.customerId,
            totalQuantity: 0,
            totalValue: sale.total,
            date: sale.date,
          };
        }
        sale.items?.forEach((item) => {
          acc[sale.invoiceNo].totalQuantity += item.quantity;
        });
        return acc;
      },
      {} as Record<
        string,
        {
          orderId: string;
          customer: string;
          totalQuantity: number;
          totalValue: number;
          date: string;
        }
      >
    );

    // Convert to array and add forecasting logic
    return Object.values(groupedByOrder)
      .map((order) => {
        const forecastedDemand = Math.round(order.totalQuantity * 1.15); // 15% growth forecast
        const demandChange = forecastedDemand - order.totalQuantity;
        const trend =
          demandChange > 0 ? "up" : demandChange < 0 ? "down" : ("stable" as const);

        return {
          ...order,
          forecastedDemand,
          demandChange,
          trend,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [sales]);

  // Chart data - aggregated by date
  const chartData = useMemo(() => {
    const dailyData: Record<
      string,
      { date: string; actual: number; forecasted: number }
    > = {};

    forecastData.forEach((order) => {
      if (!dailyData[order.date]) {
        dailyData[order.date] = {
          date: order.date,
          actual: 0,
          forecasted: 0,
        };
      }
      dailyData[order.date].actual += order.totalQuantity;
      dailyData[order.date].forecasted += order.forecastedDemand;
    });

    return Object.values(dailyData).slice(0, 30); // Last 30 days
  }, [forecastData]);

  const filteredData = forecastData.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalOrders: filteredData.length,
    avgQuantity: filteredData.length > 0
      ? Math.round(
          filteredData.reduce((sum, o) => sum + o.totalQuantity, 0) /
            filteredData.length
        )
      : 0,
    avgForecastedDemand: filteredData.length > 0
      ? Math.round(
          filteredData.reduce((sum, o) => sum + o.forecastedDemand, 0) /
            filteredData.length
        )
      : 0,
    totalValue: filteredData.reduce((sum, o) => sum + o.totalValue, 0),
  };

  const handleExport = () => {
    const csv = [
      ["Order ID", "Customer", "Actual Quantity", "Forecasted Demand", "Change", "Trend", "Date"].join(","),
      ...filteredData.map((order) =>
        [
          order.orderId,
          order.customer,
          order.totalQuantity,
          order.forecastedDemand,
          order.demandChange,
          order.trend,
          order.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "demand-forecast-by-order.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Demand Forecasting By Order</h1>
        {filteredData.length > 0 && (
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Quantity Per Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgQuantity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Forecasted Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgForecastedDemand}</p>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +15% expected growth
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{stats.totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#8884d8"
                  name="Actual Quantity"
                />
                <Line
                  type="monotone"
                  dataKey="forecasted"
                  stroke="#82ca9d"
                  name="Forecasted Demand"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data available for chart</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Search Order / Customer</label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time Range</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Forecast Details</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found for forecasting.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Actual Quantity</TableHead>
                    <TableHead>Forecasted Demand</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Order Value</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">
                        {order.orderId}
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.totalQuantity}</TableCell>
                      <TableCell className="font-semibold">
                        {order.forecastedDemand}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ₹{
                            order.demandChange > 0
                              ? "text-green-600"
                              : order.demandChange < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {order.demandChange > 0 ? "+" : ""}
                          {order.demandChange}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ₹{
                            order.trend === "up"
                              ? "bg-green-100 text-green-800"
                              : order.trend === "down"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.trend.charAt(0).toUpperCase() +
                            order.trend.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>₹{order.totalValue.toFixed(2)}</TableCell>
                      <TableCell>{order.date}</TableCell>
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

export default DemandForecastingByOrder;
