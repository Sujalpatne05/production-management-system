import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Activity, Users, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AuditStats {
  totalLogs: number;
  totalUsers: number;
  topActions: { action: string; count: number }[];
  topEntities: { entityType: string; count: number }[];
  recentActivity: { date: string; count: number }[];
}

export function AuditExportStats() {
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/audit/stats?days=${dateRange}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch audit stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/audit/export?format=${exportFormat}&days=${dateRange}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-export-${new Date().toISOString()}.${exportFormat}`;
        a.click();
      }
    } catch (err) {
      console.error('Failed to export:', err);
      alert('Could not export audit logs');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Export & Statistics</h2>
          <p className="text-gray-600">View audit statistics and export logs</p>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-2xl font-bold">{stats?.totalLogs || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-8 h-8 text-green-600" />
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Top Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Activity className="w-8 h-8 text-orange-600" />
                  <div className="text-2xl font-bold">
                    {stats?.topActions[0]?.action || '-'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Most Active Entity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="text-2xl font-bold">
                    {stats?.topEntities[0]?.entityType || '-'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.topActions && stats.topActions.length > 0 ? (
                  <div className="space-y-2">
                    {stats.topActions.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium capitalize">{item.action}</span>
                        <span className="text-gray-600">{item.count} times</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Active Entities</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.topEntities && stats.topEntities.length > 0 ? (
                  <div className="space-y-2">
                    {stats.topEntities.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{item.entityType}</span>
                        <span className="text-gray-600">{item.count} changes</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Audit Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="dateRange">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger id="exportFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full gap-2" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Export Logs
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
