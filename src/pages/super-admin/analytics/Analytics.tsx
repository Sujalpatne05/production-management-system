import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "@/config/apiConfig";
import { Download, TrendingUp } from "lucide-react";

interface Analytics {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  totalUsers: number;
  totalRevenue: number;
  timestamp: string;
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/analytics/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${Date.now()}.csv`;
      a.click();
    } catch (err) {
      setError("Failed to export analytics");
    }
  };

  if (loading) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalCompanies}</div>
              <p className="text-xs text-gray-500 mt-1">All registered companies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{analytics.activeCompanies}</div>
              <p className="text-xs text-gray-500 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inactive Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{analytics.inactiveCompanies}</div>
              <p className="text-xs text-gray-500 mt-1">Inactive or deleted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Across all companies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${(analytics.totalRevenue || 0).toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">From paid invoices</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Active Rate</p>
              <p className="text-2xl font-bold">
                {analytics && analytics.totalCompanies > 0 ? ((analytics.activeCompanies / analytics.totalCompanies) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Users per Company</p>
              <p className="text-2xl font-bold">
                {analytics && analytics.totalCompanies > 0 ? (analytics.totalUsers / analytics.totalCompanies).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{analytics ? new Date(analytics.timestamp).toLocaleString() : "N/A"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
