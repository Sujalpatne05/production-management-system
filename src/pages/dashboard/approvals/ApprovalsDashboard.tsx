import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, LockOpen } from 'lucide-react';

export function ApprovalsDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    unlockRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/approvals/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch approval stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Pending Approvals',
      description: 'Approvals awaiting action',
      count: stats.pending,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
      onClick: () => navigate('/dashboard/approvals/pending')
    },
    {
      title: 'Approval History',
      description: 'Completed approvals and rejections',
      count: stats.approved + stats.rejected,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
      onClick: () => navigate('/dashboard/approvals/history')
    },
    {
      title: 'Unlock Requests',
      description: 'Requests for record unlock',
      count: stats.unlockRequests,
      icon: LockOpen,
      color: 'text-blue-600 bg-blue-50',
      onClick: () => navigate('/dashboard/approvals/unlock-requests')
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Approvals Management</h2>
        <p className="text-gray-600">Manage approvals and unlock requests across the system</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading approval stats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={item.onClick}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{item.count}</div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onClick();
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
