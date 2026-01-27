import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function BOMList() {
  const navigate = useNavigate();
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API
    // For now, show empty state
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bill of Materials (BOM)</h2>
          <p className="text-gray-600">Manage product components and assembly instructions</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/dashboard/bom/add')}>
          <Plus className="w-4 h-4" />
          Create BOM
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All BOMs</CardTitle>
          <CardDescription>List of bill of materials for your products</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : boms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No BOMs created yet</p>
              <Button onClick={() => navigate('/dashboard/bom/add')}>Create First BOM</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boms.map((bom) => (
                  <TableRow key={bom.id}>
                    <TableCell className="font-medium">{bom.name}</TableCell>
                    <TableCell>v{bom.version}</TableCell>
                    <TableCell>{bom.components?.length || 0}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        {bom.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(bom.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate(`/dashboard/bom/${bom.id}`)}>
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
