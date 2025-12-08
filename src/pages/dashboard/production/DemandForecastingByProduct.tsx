import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ProductForecast {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalValue: number;
  salesCount: number;
  avgPerSale: number;
  trend: "up" | "down" | "stable";
  forecastedDemand: number;
  demandChange: number;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#a4de6c",
  "#d084d0",
];

const DemandForecastingByProduct = () => {
  const { sales, products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("quantity"); // quantity, value, trend

  // Calculate demand forecasting data by product
  const forecastData = useMemo(() => {
    const productMap: Record<string, ProductForecast> = {};

    sales.forEach((sale) => {
      sale.items?.forEach((item) => {
        if (!productMap[item.productId]) {
          const product = products.find((p) => p.id === item.productId);
          productMap[item.productId] = {
            productId: item.productId,
            productName: product?.name || "Unknown",
            totalQuantity: 0,
            totalValue: 0,
            salesCount: 0,
            avgPerSale: 0,
            trend: "stable",
            forecastedDemand: 0,
            demandChange: 0,
          };
        }

        productMap[item.productId].totalQuantity += item.quantity;
        productMap[item.productId].totalValue += item.quantity * item.price;
        productMap[item.productId].salesCount += 1;
      });
    });

    // Calculate forecasting
    return Object.values(productMap)
      .map((product) => {
        const avgPerSale =
          product.salesCount > 0
            ? Math.round(product.totalQuantity / product.salesCount)
            : 0;
        const forecastedDemand = Math.round(product.totalQuantity * 1.2); // 20% growth forecast
        const demandChange = forecastedDemand - product.totalQuantity;
        const trend =
          demandChange > 10
            ? ("up" as const)
            : demandChange < -10
            ? ("down" as const)
            : ("stable" as const);

        return {
          ...product,
          avgPerSale,
          forecastedDemand,
          demandChange,
          trend,
        };
      })
      .sort((a, b) => {
        if (sortBy === "quantity") return b.totalQuantity - a.totalQuantity;
        if (sortBy === "value") return b.totalValue - a.totalValue;
        if (sortBy === "trend") {
          const trendOrder = { up: -1, down: 1, stable: 0 };
          return trendOrder[a.trend] - trendOrder[b.trend];
        }
        return 0;
      });
  }, [sales, products]);

  // Pie chart data
  const pieData = useMemo(() => {
    return forecastData
      .slice(0, 6)
      .map((product) => ({
        name: product.productName,
        value: product.totalQuantity,
      }));
  }, [forecastData]);

  // Bar chart data
  const barData = useMemo(() => {
    return forecastData.slice(0, 10).map((product) => ({
      name: product.productName.substring(0, 12),
      actual: product.totalQuantity,
      forecasted: product.forecastedDemand,
    }));
  }, [forecastData]);

  const filteredData = forecastData.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalProducts: filteredData.length,
    avgQuantity:
      filteredData.length > 0
        ? Math.round(
            filteredData.reduce((sum, p) => sum + p.totalQuantity, 0) /
              filteredData.length
          )
        : 0,
    avgForecastedDemand:
      filteredData.length > 0
        ? Math.round(
            filteredData.reduce((sum, p) => sum + p.forecastedDemand, 0) /
              filteredData.length
          )
        : 0,
    totalValue: filteredData.reduce((sum, p) => sum + p.totalValue, 0),
  };

  const handleExport = () => {
    const csv = [
      [
        "Product Name",
        "Total Quantity Sold",
        "Sales Count",
        "Avg Per Sale",
        "Forecasted Demand",
        "Change",
        "Trend",
        "Total Value",
      ].join(","),
      ...filteredData.map((product) =>
        [
          product.productName,
          product.totalQuantity,
          product.salesCount,
          product.avgPerSale,
          product.forecastedDemand,
          product.demandChange,
          product.trend,
          product.totalValue.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "demand-forecast-by-product.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Demand Forecasting By Product</h1>
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
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Quantity Per Product
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
              +20% expected growth
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Product Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products - Actual vs Forecasted</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="#8884d8" name="Actual Quantity" />
                  <Bar
                    dataKey="forecasted"
                    fill="#82ca9d"
                    name="Forecasted Demand"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution (Top 6)</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ${value}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Search Product</label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sort By</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="quantity">Quantity Sold</option>
                <option value="value">Total Value</option>
                <option value="trend">Demand Trend</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Forecast Details</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No products found for forecasting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Sales Count</TableHead>
                    <TableHead>Avg Per Sale</TableHead>
                    <TableHead>Forecasted Demand</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>{product.totalQuantity}</TableCell>
                      <TableCell>{product.salesCount}</TableCell>
                      <TableCell>{product.avgPerSale}</TableCell>
                      <TableCell className="font-semibold">
                        {product.forecastedDemand}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            product.demandChange > 0
                              ? "text-green-600"
                              : product.demandChange < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {product.demandChange > 0 ? "+" : ""}
                          {product.demandChange}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.trend === "up"
                              ? "bg-green-100 text-green-800"
                              : product.trend === "down"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.trend.charAt(0).toUpperCase() +
                            product.trend.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>${product.totalValue.toFixed(2)}</TableCell>
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

export default DemandForecastingByProduct;
