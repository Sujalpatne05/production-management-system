import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";

interface InventoryItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  warehouseLocation: string;
  batchLot: string;
  value: number;
}

const chartData = [
  { name: "Stock Available", value: 1000 },
  { name: "Stock In Transit", value: 250 },
  { name: "Stock Reserved", value: 150 },
  { name: "Stock Rejected", value: 50 },
];

export default function InventoryReport() {
  const [reportType, setReportType] = useState("stock-statement");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    {
      itemCode: "YYYY",
      itemName: "MS ANGLE 50x50x5 MM",
      quantity: 500,
      warehouseLocation: "STORE-A1",
      batchLot: "BATCH-001",
      value: 250000,
    },
    {
      itemCode: "ZZZZ",
      itemName: "Steel Rod 12mm",
      quantity: 300,
      warehouseLocation: "STORE-A2",
      batchLot: "BATCH-002",
      value: 180000,
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Reports" />

      <div className="flex gap-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stock-statement">Stock Statement</SelectItem>
            <SelectItem value="stock-summary">Stock Summary</SelectItem>
            <SelectItem value="stock-ledger">Stock Ledger</SelectItem>
            <SelectItem value="abc-analysis">ABC Analysis</SelectItem>
            <SelectItem value="consumption">Consumption Report</SelectItem>
            <SelectItem value="finsh-goods">Finished Goods Report</SelectItem>
            <SelectItem value="dispatch">Dispatch Reports</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,450</div>
            <p className="text-xs text-gray-500">units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8.7L</div>
            <p className="text-xs text-gray-500">total value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-gray-500">units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-gray-500">units</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Warehouse Location</TableHead>
                <TableHead>Batch/Lot</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.itemCode}>
                  <TableCell className="font-medium">{item.itemCode}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.warehouseLocation}</TableCell>
                  <TableCell>{item.batchLot}</TableCell>
                  <TableCell>₹{item.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
