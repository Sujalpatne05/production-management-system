import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

type Template = {
  id: string;
  name: string;
  type?: string;
  updatedAt?: string;
};

export function QCTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/qc/templates");
        if (!res.ok) throw new Error("Failed to load templates");
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
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
          <h2 className="text-3xl font-bold tracking-tight">QC Templates</h2>
          <p className="text-gray-600">Define reusable quality checklists</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/dashboard/qc/templates/new") }>
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>Standard quality templates</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No templates yet. Create a template to begin.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((tpl) => (
                  <TableRow key={tpl.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/qc/templates/${tpl.id}`)}>
                    <TableCell>{tpl.name}</TableCell>
                    <TableCell className="capitalize">{tpl.type || "-"}</TableCell>
                    <TableCell>{tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : "-"}</TableCell>
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
