import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, CreditCard } from 'lucide-react';
import { API_CONFIG } from '@/config/apiConfig';

interface Analytics {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalRevenue: number;
}

export function SuperAdminOverview() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">Error: {error}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">No data available</div>;
  }

  const stats = [
    {
      title: 'Total Companies',
      value: analytics.totalCompanies,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Companies',
      value: analytics.activeCompanies,
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics.totalRevenue || 0).toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to the Super Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">Platform wide</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h3 className="font-semibold text-gray-900">Add New Company</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new company account</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h3 className="font-semibold text-gray-900">View All Companies</h3>
              <p className="text-sm text-gray-600 mt-1">Manage existing companies</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h3 className="font-semibold text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Configure platform settings</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
