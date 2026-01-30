import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

interface Approval {
  id: string;
  entityType: string;
  entityId: string;
  requesterId: string;
  level: number;
  requestedAt: string;
  status: string;
}

export function PendingApprovals() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await fetch('/api/approvals/pending');
        if (res.ok) {
          const data = await res.json();
          setApprovals(data);
        }
      } catch (err) {
        console.error('Failed to fetch pending approvals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleApprove = async (approvalId: string) => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: '' })
      });
      if (res.ok) {
        setApprovals(approvals.filter(a => a.id !== approvalId));
        alert('Approval granted');
      }
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Could not approve');
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: 'Rejected' })
      });
      if (res.ok) {
        setApprovals(approvals.filter(a => a.id !== approvalId));
        alert('Request rejected');
      }
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Could not reject');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
          <p className="text-gray-600">Review and action pending approval requests</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/approvals')}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No pending approvals</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.entityType}</TableCell>
                    <TableCell>{approval.entityId}</TableCell>
                    <TableCell>{approval.requesterId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Level {approval.level}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(approval.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(approval.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
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
