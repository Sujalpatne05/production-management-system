import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Package } from 'lucide-react';

export function GRNList() {
  const navigate = useNavigate();
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch GRNs
    setLoading(false);
  }, []);

  const statusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Goods Receipt Notes (GRN)</h2>
          <p className="text-gray-600">Track received purchase orders</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/dashboard/grn/new')}>
          <Plus className="w-4 h-4" />
          Create GRN
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All GRNs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : grns.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No GRNs created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GRN No</TableHead>
                  <TableHead>Purchase Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Received Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grns.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-medium">{grn.grnNo}</TableCell>
                    <TableCell>{grn.purchase?.poNo}</TableCell>
                    <TableCell>{grn.purchase?.supplier?.name}</TableCell>
                    <TableCell>{grn.totalQuantity}</TableCell>
                    <TableCell>
                      <Badge className={statusColor(grn.status)}>{grn.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(grn.receivedDate).toLocaleDateString()}</TableCell>
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
