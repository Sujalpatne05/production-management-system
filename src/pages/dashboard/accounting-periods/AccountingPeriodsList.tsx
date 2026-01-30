import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw } from "lucide-react";

interface AccountingPeriod {
  id: string;
  tenantId: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: "open" | "closed";
  notes?: string;
}

export function AccountingPeriodsList() {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string>("default");

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounting-periods?tenantId=${encodeURIComponent(tenantId)}`);
      if (res.ok) {
        const data = await res.json();
        setPeriods(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch accounting periods", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const closePeriod = async (id: string) => {
    try {
      const res = await fetch(`/api/accounting-periods/${id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "system" }),
      });
      if (res.ok) {
        await fetchPeriods();
        alert("Period closed successfully");
      }
    } catch (err) {
      console.error("Failed to close period", err);
      alert("Could not close period");
    }
  };

  const reopenPeriod = async (id: string) => {
    try {
      const res = await fetch(`/api/accounting-periods/${id}/reopen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "system" }),
      });
      if (res.ok) {
        await fetchPeriods();
        alert("Period reopened successfully");
      }
    } catch (err) {
      console.error("Failed to reopen period", err);
      alert("Could not reopen period");
    }
  };

  const statusBadge = (status?: string) => {
    const cls = status === "closed" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
    return <Badge className={cls}>{status === "closed" ? "Closed" : "Open"}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounting Periods</h2>
          <p className="text-gray-600">View and manage fiscal periods</p>
        </div>
        <div className="flex gap-2">
          <Input
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            placeholder="Tenant ID"
            className="w-40"
          />
          <Button variant="outline" className="gap-2" onClick={fetchPeriods}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2" onClick={() => navigate("/dashboard/accounting-periods/close")}> 
            <Plus className="w-4 h-4" />
            Close Period
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Periods</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : periods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No periods found for tenant</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periods.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{statusBadge(p.status)}</TableCell>
                      <TableCell>{new Date(p.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(p.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {p.status === "closed" ? (
                            <Button size="sm" variant="outline" onClick={() => reopenPeriod(p.id)}>Reopen</Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => closePeriod(p.id)}>Close</Button>
                          )}
                        </div>
                      </TableCell>
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
}
