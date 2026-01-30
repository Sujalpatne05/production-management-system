import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp } from 'lucide-react';

export function ForecastList() {
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch forecasts
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Demand Forecasting</h2>
          <p className="text-gray-600">Plan product demand and inventory</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/dashboard/forecast/new')}>
          <Plus className="w-4 h-4" />
          Create Forecast
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : forecasts.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No forecasts created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Forecast Name</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Line Items</TableHead>
                  <TableHead>Avg Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecasts.map((forecast) => (
                  <TableRow key={forecast.id}>
                    <TableCell className="font-medium">{forecast.name}</TableCell>
                    <TableCell>{forecast.forecastMethod}</TableCell>
                    <TableCell>
                      {new Date(forecast.startDate).toLocaleDateString()} -
                      {new Date(forecast.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{forecast.lineItems?.length || 0}</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>
                      <Badge>{forecast.status}</Badge>
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
