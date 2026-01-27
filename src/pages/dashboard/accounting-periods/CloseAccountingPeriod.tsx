import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface AccountingPeriod {
  id: string;
  tenantId: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: "open" | "closed";
}

export function CloseAccountingPeriod() {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string>("default");

  const fetchOpenPeriods = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounting-periods?tenantId=${encodeURIComponent(tenantId)}`);
      if (res.ok) {
        const data: AccountingPeriod[] = await res.json();
        setPeriods((data || []).filter((p) => p.status !== "closed"));
      }
    } catch (err) {
      console.error("Failed to fetch periods", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenPeriods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const closePeriod = async (id: string) => {
    if (!confirm("Are you sure you want to close this period?")) return;
    try {
      const res = await fetch(`/api/accounting-periods/${id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "system" }),
      });
      if (res.ok) {
        await fetchOpenPeriods();
        alert("Period closed successfully");
      }
    } catch (err) {
      console.error("Failed to close period", err);
      alert("Could not close period");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Close Accounting Period</h2>
          <p className="text-gray-600">Close open periods to lock postings within date range</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard/accounting-periods")}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Open Periods
          </CardTitle>
          <div className="flex gap-2 mt-4">
            <Input
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="Tenant ID"
              className="w-40"
            />
            <Button variant="outline" onClick={fetchOpenPeriods}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : periods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No open periods found</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periods.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{new Date(p.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(p.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => closePeriod(p.id)}>
                          Close Period
                        </Button>
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
