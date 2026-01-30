import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

type NCR = {
  id: string;
  reportNo?: string;
  severity?: string;
  status?: string;
  createdAt?: string;
};

export function NonConformance() {
  const navigate = useNavigate();
  const [ncrs, setNcrs] = useState<NCR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/qc/non-conformance");
        if (!res.ok) throw new Error("Failed to load NCRs");
        const data = await res.json();
        setNcrs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Non-Conformance</h2>
          <p className="text-gray-600">Log and resolve quality issues</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/dashboard/qc/ncr/new") }>
          <Plus className="w-4 h-4" />
          New NCR
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Non-Conformance Reports</CardTitle>
          <CardDescription>Track issues and resolutions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading NCRs...</div>
          ) : ncrs.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No NCRs yet. Add one to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report #</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ncrs.map((ncr) => (
                  <TableRow key={ncr.id}>
                    <TableCell>{ncr.reportNo || ncr.id.slice(0, 8)}</TableCell>
                    <TableCell className="capitalize">{ncr.severity || "-"}</TableCell>
                    <TableCell className="capitalize">{ncr.status || "-"}</TableCell>
                    <TableCell>{ncr.createdAt ? new Date(ncr.createdAt).toLocaleDateString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
