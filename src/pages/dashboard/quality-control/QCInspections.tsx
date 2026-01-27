import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

type Inspection = {
  id: string;
  status?: string;
  inspectionDate?: string;
  createdAt?: string;
  template?: { name?: string } | null;
};

export function QCInspections() {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/qc/inspections");
        if (!res.ok) throw new Error("Failed to load inspections");
        const data = await res.json();
        setInspections(Array.isArray(data) ? data : []);
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
          <h2 className="text-3xl font-bold tracking-tight">Inspections</h2>
          <p className="text-gray-600">Manage and review quality inspections</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/dashboard/qc/inspection/new')}>
          <Plus className="w-4 h-4" />
          New Inspection
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
          <CardDescription>Listing of inspections with status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading inspections...</div>
          ) : inspections.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No inspections yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((ins) => (
                  <TableRow
                    key={ins.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/dashboard/qc/inspection/${ins.id}`)}
                  >
                    <TableCell>{ins.id.slice(0, 8)}</TableCell>
                    <TableCell>{ins.template?.name || "-"}</TableCell>
                    <TableCell className="capitalize">{ins.status || "-"}</TableCell>
                    <TableCell>
                      {ins.inspectionDate
                        ? new Date(ins.inspectionDate).toLocaleDateString()
                        : ins.createdAt
                        ? new Date(ins.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
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
