import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "@/config/apiConfig";
import { Download } from "lucide-react";

interface AuditLog {
  id: string;
  userId: string;
  companyId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: any;
  ipAddress: string;
  status: string;
  errorMessage: string;
  createdAt: string;
  user: { name: string; email: string };
  company: { name: string };
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, resourceFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `${API_CONFIG.API_URL}/super-admin/audit-logs?limit=100`;
      
      if (actionFilter !== "all") url += `&action=${actionFilter}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch audit logs");
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
      a.download = `audit-logs-${Date.now()}.csv`;
      a.click();
    } catch (err) {
      setError("Failed to export logs");
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResource = resourceFilter === "all" || log.resourceType === resourceFilter;
    return matchesAction && matchesResource;
  });

  if (loading) return <div className="p-6">Loading audit logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Resource Type</label>
            <select 
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All Resources</option>
              <option value="company">Company</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Resource</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <div>
                        <p className="font-medium">{log.user?.name || "System"}</p>
                        <p className="text-xs text-gray-600">{log.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2">{log.company?.name || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {log.resourceType}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
