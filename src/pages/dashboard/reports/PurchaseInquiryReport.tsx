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
import { Download, Eye } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseInquiryData {
  inquiryNo: string;
  vendor: string;
  vendorGST: string;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedRate: number;
  status: string;
  inquiryDate: string;
  responseDate: string;
}

const PurchaseInquiryReport = () => {
  const [reportData] = useState<PurchaseInquiryData[]>([
    {
      inquiryNo: "PUI-2026-001",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      itemCode: "MAT-101",
      itemName: "Electrical Cables",
      description: "High-grade copper cables for industrial use",
      quantity: 500,
      unit: "Meter",
      estimatedRate: 150,
      status: "Quoted",
      inquiryDate: "2026-01-20",
      responseDate: "2026-01-22",
    },
    {
      inquiryNo: "PUI-2026-002",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      itemCode: "MAT-205",
      itemName: "Steel Components",
      description: "Precision engineered steel parts",
      quantity: 200,
      unit: "Piece",
      estimatedRate: 450,
      status: "Pending",
      inquiryDate: "2026-01-21",
      responseDate: "",
    },
    {
      inquiryNo: "PUI-2026-003",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      itemCode: "MAT-310",
      itemName: "Circuit Boards",
      description: "PCB with integrated circuits",
      quantity: 100,
      unit: "Piece",
      estimatedRate: 2500,
      status: "Quoted",
      inquiryDate: "2026-01-15",
      responseDate: "2026-01-17",
    },
    {
      inquiryNo: "PUI-2026-004",
      vendor: "Engineering Works Inc",
      vendorGST: "18AABCS5678GST",
      itemCode: "MAT-402",
      itemName: "Hydraulic Pumps",
      description: "Industrial grade hydraulic pump",
      quantity: 50,
      unit: "Piece",
      estimatedRate: 8000,
      status: "Ordered",
      inquiryDate: "2026-01-10",
      responseDate: "2026-01-12",
    },
    {
      inquiryNo: "PUI-2026-005",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      itemCode: "MAT-501",
      itemName: "Rubber Seals",
      description: "High-temperature resistant seals",
      quantity: 1000,
      unit: "Piece",
      estimatedRate: 25,
      status: "Pending",
      inquiryDate: "2026-01-22",
      responseDate: "",
    },
  ]);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"summary" | "vendor">("summary");

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
          inquiryCount: filteredData.filter((r) => r.vendor === item.vendor).length,
          quotedCount: filteredData.filter(
            (r) => r.vendor === item.vendor && r.status === "Quoted"
          ).length,
          pendingCount: filteredData.filter(
            (r) => r.vendor === item.vendor && r.status === "Pending"
          ).length,
          totalValue: filteredData
            .filter((r) => r.vendor === item.vendor)
            .reduce((sum, r) => sum + r.quantity * r.estimatedRate, 0),
        },
      ])
    ).values()
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Quoted: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Ordered: "bg-blue-100 text-blue-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const totalInquiries = filteredData.length;
  const quotedInquiries = filteredData.filter((r) => r.status === "Quoted").length;
  const pendingInquiries = filteredData.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Inquiry Report"
        subtitle="Track purchase inquiries sent to vendors with response status"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Inquiries</p>
            <p className="text-3xl font-bold text-blue-600">{totalInquiries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Quoted</p>
            <p className="text-3xl font-bold text-green-600">{quotedInquiries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending Response</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingInquiries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Response Rate</p>
            <p className="text-3xl font-bold text-purple-600">
              {totalInquiries > 0
                ? Math.round((quotedInquiries / totalInquiries) * 100)
                : 0}
              %
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
                    <SelectItem value="Quoted">Quoted</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Ordered">Ordered</SelectItem>
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
            <CardTitle>Purchase Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Inquiry No</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Item Code</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Est. Rate</TableHead>
                    <TableHead className="font-semibold">Est. Value</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Response Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.inquiryNo}</TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.itemCode}</TableCell>
                      <TableCell>{row.itemName}</TableCell>
                      <TableCell className="text-center">
                        {row.quantity} {row.unit}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.estimatedRate.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{(row.quantity * row.estimatedRate).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell className="text-sm">{row.responseDate || "-"}</TableCell>
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
                    <TableHead className="font-semibold">Inquiries</TableHead>
                    <TableHead className="font-semibold">Quoted</TableHead>
                    <TableHead className="font-semibold">Pending</TableHead>
                    <TableHead className="font-semibold">Response Rate</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorWiseData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.vendorGST}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {row.inquiryCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {row.quotedCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-yellow-600">
                        {row.pendingCount}
                      </TableCell>
                      <TableCell className="text-blue-600 font-semibold">
                        {row.inquiryCount > 0
                          ? Math.round((row.quotedCount / row.inquiryCount) * 100)
                          : 0}
                        %
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.totalValue.toLocaleString()}
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

export default PurchaseInquiryReport;
