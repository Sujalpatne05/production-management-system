import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, History } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface EntityHistory {
  id: string;
  entityType: string;
  entityId: string;
  changes: ChangeRecord[];
}

interface ChangeRecord {
  id: string;
  action: string;
  userId?: string;
  timestamp: string;
  oldValue?: any;
  newValue?: any;
}

export function EntityHistory() {
  const [entities, setEntities] = useState<EntityHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityTypeFilter, setEntityTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/audit/entities');
        if (res.ok) {
          const data = await res.json();
          setEntities(data);
        }
      } catch (err) {
        console.error('Failed to fetch entity history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredEntities = entities.filter(entity => {
    const matchesType = entityTypeFilter === 'all' || entity.entityType === entityTypeFilter;
    const matchesSearch = !searchTerm || entity.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const renderChangeDiff = (oldValue: any, newValue: any) => {
    if (!oldValue && !newValue) return <span className="text-gray-500">No changes</span>;
    
    return (
      <div className="space-y-2 text-sm">
        {oldValue && (
          <div>
            <span className="font-medium text-red-600">Old: </span>
            <span className="text-gray-700">{JSON.stringify(oldValue, null, 2)}</span>
          </div>
        )}
        {newValue && (
          <div>
            <span className="font-medium text-green-600">New: </span>
            <span className="text-gray-700">{JSON.stringify(newValue, null, 2)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Entity History</h2>
          <p className="text-gray-600">Track changes to individual records</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Entities</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by entity ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Order">Order</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {entities.length === 0 ? 'No entity history found' : 'No entities match the search criteria'}
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredEntities.map((entity) => (
                <AccordionItem key={entity.id} value={entity.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{entity.entityType}</Badge>
                      <span className="font-medium">{entity.entityId}</span>
                      <span className="text-sm text-gray-500">
                        {entity.changes.length} changes
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {entity.changes.map((change) => (
                        <div key={change.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="text-xs">{change.action}</Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(change.timestamp).toLocaleString()}
                            </span>
                            {change.userId && (
                              <span className="text-sm text-gray-500">by {change.userId}</span>
                            )}
                          </div>
                          {renderChangeDiff(change.oldValue, change.newValue)}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
