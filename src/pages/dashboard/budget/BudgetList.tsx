import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';

export function BudgetList() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch budgets
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget Planning</h2>
          <p className="text-gray-600">Create and track financial budgets</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/dashboard/budget/new')}>
          <Plus className="w-4 h-4" />
          Create Budget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No budgets created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Budget Name</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Budget</TableHead>
                  <TableHead>Actual Spend</TableHead>
                  <TableHead>Usage %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => {
                  const usage = budget.totalBudget > 0 ? (budget.totalActual / budget.totalBudget) * 100 : 0;
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.name}</TableCell>
                      <TableCell>{budget.budgetPeriod}</TableCell>
                      <TableCell>${budget.totalBudget.toLocaleString()}</TableCell>
                      <TableCell>${budget.totalActual.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={Math.min(usage, 100)} />
                          <span className="text-xs text-gray-500 mt-1">{usage.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{budget.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
