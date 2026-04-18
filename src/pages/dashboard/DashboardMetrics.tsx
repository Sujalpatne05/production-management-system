import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
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
import { TrendingUp, ShoppingCart, AlertCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/services/apiClient";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Get company ID from localStorage
        const tenant = localStorage.getItem('tenant');
        if (!tenant) {
          console.warn('No tenant/company found');
          setError('No company context');
          return;
        }
        
        const tenantData = JSON.parse(tenant);
        const companyId = tenantData.id;
        
        console.log('Fetching metrics for company:', companyId);
        
        // Fetch dashboard data for this company
        const response = await apiClient.get(`/api/dashboard/metrics?companyId=${companyId}`);
        console.log('Metrics response:', response);
        
        setMetrics(response.data || response);
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(err.message);
        // Set default empty metrics on error
        setMetrics({
          totalSales: 0,
          totalPurchase: 0,
          pendingPayments: 0,
          profitMargin: 0,
          salesChange: '+0%',
          purchaseChange: '+0%',
          paymentChange: '+0%',
          profitChange: '+0%',
          monthlySalesData: [],
          paymentStatusData: [],
          stockStatusData: [],
          lowStockProducts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  // Use real data from metrics or defaults
  const kpiMetrics = [
    {
      title: "Total Sales",
      value: `₹${(metrics?.totalSales || 0).toLocaleString('en-IN')}`,
      change: metrics?.salesChange || "+0%",
      trend: (metrics?.salesChange || "+0%").startsWith("+") ? "up" : "down",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Purchase",
      value: `₹${(metrics?.totalPurchase || 0).toLocaleString('en-IN')}`,
      change: metrics?.purchaseChange || "+0%",
      trend: (metrics?.purchaseChange || "+0%").startsWith("+") ? "up" : "down",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Payments",
      value: `₹${(metrics?.pendingPayments || 0).toLocaleString('en-IN')}`,
      change: metrics?.paymentChange || "+0%",
      trend: (metrics?.paymentChange || "+0%").startsWith("+") ? "up" : "down",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Profit Margin",
      value: `₹${(metrics?.profitMargin || 0).toLocaleString('en-IN')}`,
      change: metrics?.profitChange || "+0%",
      trend: (metrics?.profitChange || "+0%").startsWith("+") ? "up" : "down",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const monthlySalesData = metrics?.monthlySalesData || [];
  const paymentStatusData = metrics?.paymentStatusData || [];
  const stockStatusData = metrics?.stockStatusData || [];
  const lowStockProducts = metrics?.lowStockProducts || [];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            ⚠️ {lowStockProducts.length} products are running low on stock. <span className="font-semibold cursor-pointer hover:underline">View details</span>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      {monthlySalesData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Sales & Purchase Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Sales vs Purchase Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchase"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Status */}
          {paymentStatusData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>No sales data available yet for this company</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Status & Top Products */}
      {stockStatusData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Status Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stockStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Low Stock Products List */}
          {lowStockProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Low Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          Current: {product.current} | Min: {product.min}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.status === "Critical"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardMetrics;
