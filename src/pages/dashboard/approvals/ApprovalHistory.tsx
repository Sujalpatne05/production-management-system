import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

interface ApprovalRecord {
  id: string;
  entityType: string;
  entityId: string;
  requesterId: string;
  approverId?: string;
  status: string;
  requestedAt: string;
  respondedAt?: string;
  comments?: string;
}

export function ApprovalHistory() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await fetch('/api/approvals/history');
        if (res.ok) {
          const data = await res.json();
          setApprovals(data);
        }
      } catch (err) {
        console.error('Failed to fetch approval history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Approval History</h2>
          <p className="text-gray-600">View completed approvals and rejections</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/approvals')}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No approval history</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Approved/Rejected By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responded Date</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.entityType}</TableCell>
                    <TableCell>{approval.entityId}</TableCell>
                    <TableCell>{approval.requesterId}</TableCell>
                    <TableCell>{approval.approverId || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(approval.status)}>
                        {approval.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {approval.respondedAt
                        ? new Date(approval.respondedAt).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {approval.comments || '-'}
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
