import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

interface InventoryItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  reserved: number;
  available: number;
  warehouseLocation: string;
  batchLot: string;
  value: number;
  turnoverRate: number;
  lastMoved: string;
}

const chartData = [
  { name: "Available", value: 1000, fill: "#10b981" },
  { name: "In Transit", value: 250, fill: "#3b82f6" },
  { name: "Reserved", value: 150, fill: "#f59e0b" },
  { name: "Damaged", value: 30, fill: "#ef4444" },
];

const trendsData = [
  { month: "Jan", stock: 900, reserved: 100 },
  { month: "Feb", stock: 950, reserved: 130 },
  { month: "Mar", stock: 1100, reserved: 150 },
  { month: "Apr", stock: 1050, reserved: 140 },
  { month: "May", stock: 1000, reserved: 150 },
  { month: "Jun", stock: 1200, reserved: 160 },
];

export default function InventoryReportEnhanced() {
  const [reportType, setReportType] = useState("stock-statement");
  const [filterLocation, setFilterLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    {
      itemCode: "MAT-001",
      itemName: "MS ANGLE 50x50x5 MM",
      quantity: 500,
      reserved: 150,
      available: 350,
      warehouseLocation: "STORE-A1",
      batchLot: "BATCH-001",
      value: 250000,
      turnoverRate: 8.5,
      lastMoved: "2026-01-27",
    },
    {
      itemCode: "MAT-002",
      itemName: "Steel Rod 12mm",
      quantity: 300,
      reserved: 80,
      available: 220,
      warehouseLocation: "STORE-A2",
      batchLot: "BATCH-002",
      value: 180000,
      turnoverRate: 7.2,
      lastMoved: "2026-01-26",
    },
    {
      itemCode: "MAT-003",
      itemName: "MS Plate 5mm",
      quantity: 200,
      reserved: 60,
      available: 140,
      warehouseLocation: "STORE-B1",
      batchLot: "BATCH-003",
      value: 160000,
      turnoverRate: 6.8,
      lastMoved: "2026-01-25",
    },
    {
      itemCode: "MAT-004",
      itemName: "Stainless Sheet 316L",
      quantity: 150,
      reserved: 50,
      available: 100,
      warehouseLocation: "STORE-B2",
      batchLot: "BATCH-004",
      value: 300000,
      turnoverRate: 5.2,
      lastMoved: "2026-01-24",
    },
    {
      itemCode: "MAT-005",
      itemName: "Aluminum Profile",
      quantity: 280,
      reserved: 100,
      available: 180,
      warehouseLocation: "STORE-C1",
      batchLot: "BATCH-005",
      value: 140000,
      turnoverRate: 6.1,
      lastMoved: "2026-01-23",
    },
  ]);

  const handleExport = () => {
    const csv = [
      [
        "Item Code",
        "Item Name",
        "Total Qty",
        "Available",
        "Reserved",
        "Location",
        "Batch",
        "Value",
        "Turnover Rate",
      ],
      ...filteredData.map((item) => [
        item.itemCode,
        item.itemName,
        item.quantity,
        item.available,
        item.reserved,
        item.warehouseLocation,
        item.batchLot,
        item.value,
        item.turnoverRate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${reportType}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      filterLocation === "all" || item.warehouseLocation === filterLocation;
    return matchesSearch && matchesLocation;
  });

  const totalStock = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const totalReserved = inventoryData.reduce((sum, item) => sum + item.reserved, 0);
  const totalAvailable = inventoryData.reduce((sum, item) => sum + item.available, 0);

  const locations = ["all", ...new Set(inventoryData.map((item) => item.warehouseLocation))];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Reports & Analytics" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalStock}</div>
            <p className="text-xs text-gray-500 mt-1">units in hand</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Stock Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{(totalValue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-gray-500 mt-1">Total inventory value</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Reserved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {totalReserved}
            </div>
            <p className="text-xs text-gray-500 mt-1">units reserved</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {totalAvailable}
            </div>
            <p className="text-xs text-gray-500 mt-1">ready to use</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Trends (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stock"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Available Stock"
                />
                <Line
                  type="monotone"
                  dataKey="reserved"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Reserved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Type and Filters */}
      <div className="flex gap-4 items-center flex-wrap">
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
            <SelectItem value="aging">Inventory Aging</SelectItem>
            <SelectItem value="turnover">Turnover Report</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 min-w-64 relative">
          <Input
            placeholder="Search by item code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>

        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc === "all" ? "All Locations" : loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Details - {reportType.replace("-", " ").toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">Item Code</TableHead>
                  <TableHead className="font-bold">Item Name</TableHead>
                  <TableHead className="font-bold">Total Qty</TableHead>
                  <TableHead className="font-bold">Available</TableHead>
                  <TableHead className="font-bold">Reserved</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Batch/Lot</TableHead>
                  <TableHead className="font-bold">Value</TableHead>
                  <TableHead className="font-bold">Turnover</TableHead>
                  <TableHead className="font-bold">Last Moved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.itemCode} className="hover:bg-gray-50">
                      <TableCell className="font-bold text-blue-600">
                        {item.itemCode}
                      </TableCell>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-right font-bold">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {item.available}
                      </TableCell>
                      <TableCell className="text-right text-orange-600 font-medium">
                        {item.reserved}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.warehouseLocation}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{item.batchLot}</TableCell>
                      <TableCell className="text-right">
                        ₹{(item.value / 1000).toFixed(1)}K
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          {item.turnoverRate > 7 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                          )}
                          <span className="font-medium">{item.turnoverRate}x</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{item.lastMoved}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
