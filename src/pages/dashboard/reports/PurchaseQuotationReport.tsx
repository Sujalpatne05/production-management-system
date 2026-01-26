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

interface PurchaseQuotationData {
  quotationNo: string;
  vendor: string;
  vendorGST: string;
  inquiryNo: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  quotedRate: number;
  quotedValue: number;
  validityDate: string;
  status: string;
  quotationDate: string;
}

const PurchaseQuotationReport = () => {
  const [reportData] = useState<PurchaseQuotationData[]>([
    {
      quotationNo: "QT-2026-001",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      inquiryNo: "PUI-2026-001",
      itemCode: "MAT-101",
      itemName: "Electrical Cables",
      quantity: 500,
      unit: "Meter",
      quotedRate: 155,
      quotedValue: 77500,
      validityDate: "2026-02-22",
      status: "Active",
      quotationDate: "2026-01-22",
    },
    {
      quotationNo: "QT-2026-002",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      inquiryNo: "PUI-2026-002",
      itemCode: "MAT-205",
      itemName: "Steel Components",
      quantity: 200,
      unit: "Piece",
      quotedRate: 460,
      quotedValue: 92000,
      validityDate: "2026-02-01",
      status: "Expired",
      quotationDate: "2026-01-01",
    },
    {
      quotationNo: "QT-2026-003",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      inquiryNo: "PUI-2026-003",
      itemCode: "MAT-310",
      itemName: "Circuit Boards",
      quantity: 100,
      unit: "Piece",
      quotedRate: 2450,
      quotedValue: 245000,
      validityDate: "2026-03-17",
      status: "Active",
      quotationDate: "2026-01-17",
    },
    {
      quotationNo: "QT-2026-004",
      vendor: "Engineering Works Inc",
      vendorGST: "18AABCS5678GST",
      inquiryNo: "PUI-2026-004",
      itemCode: "MAT-402",
      itemName: "Hydraulic Pumps",
      quantity: 50,
      unit: "Piece",
      quotedRate: 7950,
      quotedValue: 397500,
      validityDate: "2026-02-12",
      status: "Active",
      quotationDate: "2026-01-12",
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
          quotationCount: filteredData.filter((r) => r.vendor === item.vendor)
            .length,
          activeCount: filteredData.filter(
            (r) => r.vendor === item.vendor && r.status === "Active"
          ).length,
          totalValue: filteredData
            .filter((r) => r.vendor === item.vendor)
            .reduce((sum, r) => sum + r.quotedValue, 0),
          avgValue:
            filteredData
              .filter((r) => r.vendor === item.vendor)
              .reduce((sum, r) => sum + r.quotedValue, 0) /
            filteredData.filter((r) => r.vendor === item.vendor).length,
        },
      ])
    ).values()
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-100 text-green-800",
      Expired: "bg-red-100 text-red-800",
      Accepted: "bg-blue-100 text-blue-800",
      Rejected: "bg-gray-100 text-gray-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const totalQuotations = filteredData.length;
  const activeQuotations = filteredData.filter((r) => r.status === "Active").length;
  const totalQuotationValue = filteredData.reduce((sum, r) => sum + r.quotedValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Quotation Report"
        subtitle="Comparison and analysis of vendor quotations for purchase items"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Quotations</p>
            <p className="text-3xl font-bold text-blue-600">{totalQuotations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active Quotations</p>
            <p className="text-3xl font-bold text-green-600">{activeQuotations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-3xl font-bold text-purple-600">
              ₹{totalQuotationValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg Quotation Value</p>
            <p className="text-3xl font-bold text-orange-600">
              ₹
              {totalQuotations > 0
                ? Math.round(totalQuotationValue / totalQuotations).toLocaleString()
                : "0"}
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
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
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Quote No</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Item Code</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Quoted Rate</TableHead>
                    <TableHead className="font-semibold">Quote Value</TableHead>
                    <TableHead className="font-semibold">Validity Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.quotationNo}</TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.itemCode}</TableCell>
                      <TableCell>{row.itemName}</TableCell>
                      <TableCell className="text-center">
                        {row.quantity} {row.unit}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.quotedRate.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.quotedValue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{row.validityDate}</TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
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
            <CardTitle>Vendor Wise Quotation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Vendor Name</TableHead>
                    <TableHead className="font-semibold">GST No</TableHead>
                    <TableHead className="font-semibold">Quotations</TableHead>
                    <TableHead className="font-semibold">Active Quotes</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                    <TableHead className="font-semibold">Avg Value/Quote</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorWiseData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.vendor}</TableCell>
                      <TableCell className="text-sm">{row.vendorGST}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {row.quotationCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {row.activeCount}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>₹{Math.round(row.avgValue).toLocaleString()}</TableCell>
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

export default PurchaseQuotationReport;
