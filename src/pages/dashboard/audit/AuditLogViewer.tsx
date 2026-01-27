import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/audit/logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
          setFilteredLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entityType === entityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [actionFilter, entityFilter, searchTerm, logs]);

  const getActionBadge = (action: string) => {
    const colors: { [key: string]: string } = {
      create: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      delete: 'bg-red-100 text-red-800',
      approve: 'bg-emerald-100 text-emerald-800',
      reject: 'bg-orange-100 text-orange-800',
      unlock: 'bg-purple-100 text-purple-800',
      login: 'bg-gray-100 text-gray-800',
      logout: 'bg-gray-100 text-gray-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.userId || '-',
        log.action,
        log.entityType,
        log.entityId,
        log.ipAddress || '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Log Viewer</h2>
          <p className="text-gray-600">View and search system audit logs</p>
        </div>
        <Button className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by entity ID or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2 min-w-[150px]">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="unlock">Unlock</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[150px]">
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="Order">Order</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {logs.length === 0 ? 'No audit logs found' : 'No logs match the selected filters'}
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{log.userId || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getActionBadge(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.entityType}</TableCell>
                      <TableCell>{log.entityId}</TableCell>
                      <TableCell className="text-sm">{log.ipAddress || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {filteredLogs.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
