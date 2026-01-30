import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DueDeliveryData {
  poNo: string;
  vendor: string;
  vendorGST: string;
  itemCode: string;
  itemName: string;
  specification: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  unitRate: number;
  expectedDate: string;
  daysOverdue: number;
  status: string;
}

const DuePurchaseDeliveryReport = () => {
  const [reportData] = useState<DueDeliveryData[]>([
    {
      poNo: "PO-2026-001",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      itemCode: "MAT-101",
      itemName: "Electrical Cables",
      specification: "High-grade copper, 10mm dia",
      orderedQty: 500,
      receivedQty: 300,
      unit: "Meter",
      unitRate: 155,
      expectedDate: "2026-01-25",
      daysOverdue: 5,
      status: "Partially Received",
    },
    {
      poNo: "PO-2026-002",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      itemCode: "MAT-205",
      itemName: "Steel Components",
      specification: "Grade A, precision cut",
      orderedQty: 200,
      receivedQty: 0,
      unit: "Piece",
      unitRate: 460,
      expectedDate: "2026-02-10",
      daysOverdue: 0,
      status: "Pending Delivery",
    },
    {
      poNo: "PO-2026-003",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      itemCode: "MAT-310",
      itemName: "Circuit Boards",
      specification: "PCB with ICs, tested",
      orderedQty: 100,
      receivedQty: 50,
      unit: "Piece",
      unitRate: 2450,
      expectedDate: "2026-01-30",
      daysOverdue: 0,
      status: "In Transit",
    },
    {
      poNo: "PO-2026-004",
      vendor: "Engineering Works Inc",
      vendorGST: "18AABCS5678GST",
      itemCode: "MAT-402",
      itemName: "Hydraulic Pumps",
      specification: "Industrial grade, 50 HP",
      orderedQty: 50,
      receivedQty: 0,
      unit: "Piece",
      unitRate: 7950,
      expectedDate: "2026-01-20",
      daysOverdue: 10,
      status: "Delayed",
    },
    {
      poNo: "PO-2025-098",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      itemCode: "MAT-501",
      itemName: "Rubber Seals",
      specification: "High-temp resistant",
      orderedQty: 1000,
      receivedQty: 800,
      unit: "Piece",
      unitRate: 25,
      expectedDate: "2026-01-15",
      daysOverdue: 15,
      status: "Awaiting Final Shipment",
    },
  ]);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"summary" | "itemcode">("summary");

  const filteredData = reportData.filter((row) => {
    if (vendorFilter !== "all" && row.vendor !== vendorFilter) return false;
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    return true;
  });

  const itemCodeWiseData: Array<{
    itemCode: string;
    itemName: string;
    totalOrdered: number;
    totalReceived: number;
    unit: string;
    avgRate: number;
    completionPct: number;
  }> = [];

  filteredData.forEach((item) => {
    const existing = itemCodeWiseData.find((m) => m.itemCode === item.itemCode);
    if (existing) {
      existing.totalOrdered += item.orderedQty;
      existing.totalReceived += item.receivedQty;
      existing.avgRate = (existing.avgRate + item.unitRate) / 2;
    } else {
      itemCodeWiseData.push({
        itemCode: item.itemCode,
        itemName: item.itemName,
        totalOrdered: item.orderedQty,
        totalReceived: item.receivedQty,
        unit: item.unit,
        avgRate: item.unitRate,
        completionPct: (item.receivedQty / item.orderedQty) * 100,
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "Partially Received": "bg-yellow-100 text-yellow-800",
      "Pending Delivery": "bg-blue-100 text-blue-800",
      "In Transit": "bg-purple-100 text-purple-800",
      Delayed: "bg-red-100 text-red-800",
      "Awaiting Final Shipment": "bg-orange-100 text-orange-800",
    };
    return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const pendingQty = filteredData.reduce(
    (sum, item) => sum + (item.orderedQty - item.receivedQty),
    0
  );
  const totalOrderedQty = filteredData.reduce((sum, item) => sum + item.orderedQty, 0);
  const totalReceivedQty = filteredData.reduce((sum, item) => sum + item.receivedQty, 0);
  const delayedCount = filteredData.filter((r) => r.daysOverdue > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Due Purchase Delivery Report"
        subtitle="Track pending deliveries and material-wise status with item code breakdown"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Ordered</p>
            <p className="text-3xl font-bold text-blue-600">{totalOrderedQty}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Received</p>
            <p className="text-3xl font-bold text-green-600">{totalReceivedQty}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending Quantity</p>
            <p className="text-3xl font-bold text-orange-600">{pendingQty}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Delayed Deliveries
            </p>
            <p className="text-3xl font-bold text-red-600">{delayedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="flex gap-4 flex-1">
              <div className="flex-1">
                <label className="text-sm font-medium">Filter by Vendor</label>
                <Select value={vendorFilter} onValueChange={setVendorFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {Array.from(new Set(reportData.map((r) => r.vendor))).map(
                      (vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Filter by Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Pending Delivery">Pending Delivery</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Partially Received">
                      Partially Received
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "summary" ? "default" : "outline"}
                onClick={() => setViewMode("summary")}
              >
                <Eye className="w-4 h-4 mr-2" />
                PO Summary
              </Button>
              <Button
                variant={viewMode === "itemcode" ? "default" : "outline"}
                onClick={() => setViewMode("itemcode")}
              >
                Item Code Wise
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* PO Summary View */}
      {viewMode === "summary" && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">PO No</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Item Code</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Ordered</TableHead>
                    <TableHead className="font-semibold">Received</TableHead>
                    <TableHead className="font-semibold">Pending</TableHead>
                    <TableHead className="font-semibold">Days Overdue</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.poNo}</TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.itemCode}</TableCell>
                      <TableCell>{row.itemName}</TableCell>
                      <TableCell className="text-center">
                        {row.orderedQty} {row.unit}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {row.receivedQty} {row.unit}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-orange-600">
                        {row.orderedQty - row.receivedQty} {row.unit}
                      </TableCell>
                      <TableCell
                        className={`font-semibold text-center ${
                          row.daysOverdue > 0 ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {row.daysOverdue > 0 ? `${row.daysOverdue} days` : "On time"}
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Code Wise View */}
      {viewMode === "itemcode" && (
        <Card>
          <CardHeader>
            <CardTitle>Material Item Code Wise Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Item Code</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Total Ordered</TableHead>
                    <TableHead className="font-semibold">Total Received</TableHead>
                    <TableHead className="font-semibold">Pending</TableHead>
                    <TableHead className="font-semibold">Completion %</TableHead>
                    <TableHead className="font-semibold">Avg Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemCodeWiseData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.itemCode}</TableCell>
                      <TableCell>{row.itemName}</TableCell>
                      <TableCell className="text-center">
                        {row.totalOrdered} {row.unit}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {row.totalReceived} {row.unit}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-orange-600">
                        {row.totalOrdered - row.totalReceived} {row.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${row.completionPct}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold">
                            {Math.round(row.completionPct)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{Math.round(row.avgRate).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DuePurchaseDeliveryReport;
