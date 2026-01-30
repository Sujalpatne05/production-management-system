import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LockOpen, Plus, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UnlockRequest {
  id: string;
  entityType: string;
  entityId: string;
  requesterId: string;
  approverId?: string;
  status: string;
  requestedAt: string;
  respondedAt?: string;
  reason?: string;
  approvalLevel?: string;
  impactArea?: string;
}

export function UnlockRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<UnlockRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<UnlockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/approvals/unlock-requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
          setFilteredRequests(data);
        }
      } catch (err) {
        console.error('Failed to fetch unlock requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    if (impactFilter !== 'all') {
      filtered = filtered.filter(r => r.impactArea === impactFilter);
    }
    
    setFilteredRequests(filtered);
  }, [statusFilter, impactFilter, requests]);

  const handleApprove = async (requestId: string) => {
    try {
      const res = await fetch(`/api/approvals/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: 'Unlock approved' })
      });
      if (res.ok) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
        alert('Unlock request approved');
      }
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Could not approve unlock');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const res = await fetch(`/api/approvals/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: 'Unlock denied' })
      });
      if (res.ok) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
        alert('Unlock request rejected');
      }
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Could not reject unlock');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getImpactBadge = (impact: string) => {
    const colors: { [key: string]: string } = {
      'Standard': 'bg-blue-100 text-blue-800',
      'Moderate': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[impact] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Unlock Requests</h2>
          <p className="text-gray-600">Manage requests for record unlock</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => navigate('/dashboard/approvals/unlock-requests/new')}>
            <Plus className="w-4 h-4" />
            New Request
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/approvals')}>
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unlock Requests</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Select value={impactFilter} onValueChange={setImpactFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Filter by impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impact Levels</SelectItem>
                  <SelectItem value="Standard">Standard (Low)</SelectItem>
                  <SelectItem value="Moderate">Moderate (Medium)</SelectItem>
                  <SelectItem value="Critical">Critical (High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <LockOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {requests.length === 0 ? 'No unlock requests' : 'No requests match the selected filters'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.entityType}</TableCell>
                    <TableCell>{request.entityId}</TableCell>
                    <TableCell className="text-sm">{request.requesterId}</TableCell>
                    <TableCell>
                      <Badge className={getImpactBadge(request.impactArea || 'Standard')}>
                        {request.impactArea || 'Standard'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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
