import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from "@/config/apiConfig";
import { Edit2 } from "lucide-react";

interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
  createdAt: string;
  company: { name: string; email: string };
  plan: { name: string; price: number; maxUsers: number };
}

export function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = statusFilter === "all" 
        ? `${API_CONFIG.API_URL}/super-admin/subscriptions`
        : `${API_CONFIG.API_URL}/super-admin/subscriptions?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading subscriptions...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company Subscriptions</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Filter by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchSubscriptions();
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="all">All Subscriptions</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({subscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Max Users</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Auto Renew</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div>
                        <p className="font-medium">{sub.company.name}</p>
                        <p className="text-sm text-gray-600">{sub.company.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2">{sub.plan.name}</td>
                    <td className="px-4 py-2">${sub.plan.price}</td>
                    <td className="px-4 py-2">{sub.plan.maxUsers}</td>
                    <td className="px-4 py-2">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "N/A"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        sub.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : sub.status === "expired"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {sub.autoRenew ? "✓ Yes" : "✗ No"}
                    </td>
                    <td className="px-4 py-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </td>
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
