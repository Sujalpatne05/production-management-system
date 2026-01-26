import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkOrderData {
  woNo: string;
  vendor: string;
  vendorGST: string;
  poNo: string;
  tenderNo: string;
  itemCount: number;
  totalValue: number;
  status: string;
  date: string;
}

const WorkOrderReport = () => {
  const [reportData] = useState<WorkOrderData[]>([
    {
      woNo: "WO-2026-001",
      vendor: "Engineering Works Inc",
      vendorGST: "18AABCS5678GST",
      poNo: "PO-2026-001",
      tenderNo: "TEND-2026-001",
      itemCount: 5,
      totalValue: 150000,
      status: "In Progress",
      date: "2026-01-20",
    },
    {
      woNo: "WO-2026-002",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT9876GST",
      poNo: "PO-2026-002",
      tenderNo: "TEND-2026-002",
      itemCount: 3,
      totalValue: 85000,
      status: "Completed",
      date: "2026-01-15",
    },
    {
      woNo: "WO-2026-003",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      poNo: "PO-2026-003",
      tenderNo: "TEND-2026-003",
      itemCount: 8,
      totalValue: 250000,
      status: "Planning",
      date: "2026-01-18",
    },
  ]);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"summary" | "vendor">( "summary");

  const filteredData = reportData.filter((row) => {
    if (vendorFilter !== "all" && row.vendor !== vendorFilter) return false;
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    return true;
  });

  const vendorWiseData = Array.from(
    new Map(
      filteredData.map((item) => [
        item.vendor,
        {
          vendor: item.vendor,
          vendorGST: item.vendorGST,
          woCount: filteredData.filter((r) => r.vendor === item.vendor).length,
          totalValue: filteredData
            .filter((r) => r.vendor === item.vendor)
            .reduce((sum, r) => sum + r.totalValue, 0),
          avgValue:
            filteredData
              .filter((r) => r.vendor === item.vendor)
              .reduce((sum, r) => sum + r.totalValue, 0) /
            filteredData.filter((r) => r.vendor === item.vendor).length,
        },
      ])
    ).values()
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Planning: "bg-blue-100 text-blue-800",
      "In Progress": "bg-orange-100 text-orange-800",
      Completed: "bg-green-100 text-green-800",
      "On Hold": "bg-red-100 text-red-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const totalValue = filteredData.reduce((sum, item) => sum + item.totalValue, 0);
  const totalWOs = filteredData.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Order Report"
        subtitle="Comprehensive analysis of all work orders with vendor-wise breakup"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Work Orders</p>
            <p className="text-3xl font-bold text-blue-600">{totalWOs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-3xl font-bold text-purple-600">
              ₹{totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg Value per WO</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{totalWOs > 0 ? Math.round(totalValue / totalWOs).toLocaleString() : "0"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Unique Vendors</p>
            <p className="text-3xl font-bold text-orange-600">
              {new Set(filteredData.map((r) => r.vendor)).size}
            </p>
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
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
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
                Detailed View
              </Button>
              <Button
                variant={viewMode === "vendor" ? "default" : "outline"}
                onClick={() => setViewMode("vendor")}
              >
                Vendor Wise
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed View */}
      {viewMode === "summary" && (
        <Card>
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">WO No</TableHead>
                    <TableHead className="font-semibold">Vendor Name</TableHead>
                    <TableHead className="font-semibold">Vendor GST</TableHead>
                    <TableHead className="font-semibold">PO No</TableHead>
                    <TableHead className="font-semibold">Tender No</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.woNo}</TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.vendorGST}</TableCell>
                      <TableCell>{row.poNo}</TableCell>
                      <TableCell>{row.tenderNo}</TableCell>
                      <TableCell className="text-center">{row.itemCount}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell className="text-sm">{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendor Wise View */}
      {viewMode === "vendor" && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Wise Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Vendor Name</TableHead>
                    <TableHead className="font-semibold">GST No</TableHead>
                    <TableHead className="font-semibold">Work Orders</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                    <TableHead className="font-semibold">Avg Value/WO</TableHead>
                    <TableHead className="font-semibold">%Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorWiseData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.vendorGST}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {row.woCount}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>₹{Math.round(row.avgValue).toLocaleString()}</TableCell>
                      <TableCell className="text-orange-600 font-semibold">
                        {totalValue > 0
                          ? ((row.totalValue / totalValue) * 100).toFixed(1)
                          : "0"}
                        %
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

export default WorkOrderReport;
