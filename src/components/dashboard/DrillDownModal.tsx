import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DrillDownModalProps {
  isOpen: boolean;
  metric: string | null;
  onClose: () => void;
}

interface TransactionData {
  id: string;
  date: string;
  value: number;
  status: "success" | "warning" | "error";
  details: string;
}

const mockTransactionData: Record<string, TransactionData[]> = {
  oee: [
    {
      id: "OEE-001",
      date: "2026-01-24 10:00",
      value: 82,
      status: "success",
      details: "Machine A - Normal operation",
    },
    {
      id: "OEE-002",
      date: "2026-01-24 11:00",
      value: 78,
      status: "warning",
      details: "Machine B - Minor downtime",
    },
    {
      id: "OEE-003",
      date: "2026-01-24 12:00",
      value: 85,
      status: "success",
      details: "Machine A - Optimized",
    },
  ],
  efficiency: [
    {
      id: "EFF-001",
      date: "2026-01-24 10:00",
      value: 92,
      status: "success",
      details: "Production line 1 - 92% efficiency",
    },
    {
      id: "EFF-002",
      date: "2026-01-24 11:00",
      value: 88,
      status: "warning",
      details: "Production line 2 - 88% efficiency",
    },
    {
      id: "EFF-003",
      date: "2026-01-24 12:00",
      value: 95,
      status: "success",
      details: "Production line 1 - 95% efficiency",
    },
  ],
  uptime: [
    {
      id: "UP-001",
      date: "2026-01-24 10:00",
      value: 98,
      status: "success",
      details: "All machines operational",
    },
    {
      id: "UP-002",
      date: "2026-01-24 11:00",
      value: 95,
      status: "warning",
      details: "Machine C maintenance",
    },
    {
      id: "UP-003",
      date: "2026-01-24 12:00",
      value: 99,
      status: "success",
      details: "All machines operational",
    },
  ],
  defectRate: [
    {
      id: "DEF-001",
      date: "2026-01-24 10:00",
      value: 2.1,
      status: "success",
      details: "2.1% defect rate",
    },
    {
      id: "DEF-002",
      date: "2026-01-24 11:00",
      value: 3.5,
      status: "warning",
      details: "3.5% defect rate - Quality check needed",
    },
    {
      id: "DEF-003",
      date: "2026-01-24 12:00",
      value: 1.8,
      status: "success",
      details: "1.8% defect rate",
    },
  ],
};

const chartData = [
  { time: "10:00", oee: 82, efficiency: 92, uptime: 98, defectRate: 2.1 },
  { time: "11:00", oee: 78, efficiency: 88, uptime: 95, defectRate: 3.5 },
  { time: "12:00", oee: 85, efficiency: 95, uptime: 99, defectRate: 1.8 },
  { time: "13:00", oee: 88, efficiency: 91, uptime: 97, defectRate: 2.3 },
  { time: "14:00", oee: 90, efficiency: 94, uptime: 99, defectRate: 1.9 },
];

export const DrillDownModal = ({
  isOpen,
  metric,
  onClose,
}: DrillDownModalProps) => {
  const transactions = metric ? mockTransactionData[metric] || [] : [];

  const getMetricTitle = (m: string | null) => {
    switch (m) {
      case "oee":
        return "Overall Equipment Effectiveness (OEE)";
      case "efficiency":
        return "Production Efficiency";
      case "uptime":
        return "Machine Uptime";
      case "defectRate":
        return "Defect Rate";
      default:
        return "Metric Details";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getMetricTitle(metric)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {metric === "oee" && (
                    <Line
                      type="monotone"
                      dataKey="oee"
                      stroke="#3b82f6"
                      name="OEE %"
                    />
                  )}
                  {metric === "efficiency" && (
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#10b981"
                      name="Efficiency %"
                    />
                  )}
                  {metric === "uptime" && (
                    <Line
                      type="monotone"
                      dataKey="uptime"
                      stroke="#8b5cf6"
                      name="Uptime %"
                    />
                  )}
                  {metric === "defectRate" && (
                    <Line
                      type="monotone"
                      dataKey="defectRate"
                      stroke="#ef4444"
                      name="Defect Rate %"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detailed Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell className="font-semibold">
                          {tx.value}
                          {metric === "defectRate" ? "%" : "%"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{tx.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
