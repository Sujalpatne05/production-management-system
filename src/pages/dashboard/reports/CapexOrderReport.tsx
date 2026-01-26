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

interface CapexOrderItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  department: string;
}

interface CapexOrderData {
  capexNo: string;
  projectName: string;
  vendor: string;
  vendorGST: string;
  items: CapexOrderItem[];
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryDate: string;
  budget: number;
}

const CapexOrderReport = () => {
  const [reportData] = useState<CapexOrderData[]>([
    {
      capexNo: "CAPEX-2026-001",
      projectName: "Plant Expansion",
      vendor: "Industrial Equipment Corp",
      vendorGST: "18AABCE5678GST",
      items: [
        {
          itemCode: "EQUIP-101",
          itemName: "CNC Machine",
          quantity: 2,
          unit: "Piece",
          rate: 500000,
          amount: 1000000,
          department: "Manufacturing",
        },
        {
          itemCode: "EQUIP-102",
          itemName: "Hydraulic Press",
          quantity: 1,
          unit: "Piece",
          rate: 300000,
          amount: 300000,
          department: "Manufacturing",
        },
      ],
      totalAmount: 1300000,
      status: "Approved",
      orderDate: "2026-01-20",
      deliveryDate: "2026-03-20",
      budget: 1500000,
    },
    {
      capexNo: "CAPEX-2026-002",
      projectName: "Warehouse Automation",
      vendor: "Automation Systems Ltd",
      vendorGST: "18AABCA1234GST",
      items: [
        {
          itemCode: "AUTO-201",
          itemName: "Conveyor System",
          quantity: 100,
          unit: "Meter",
          rate: 5000,
          amount: 500000,
          department: "Logistics",
        },
      ],
      totalAmount: 500000,
      status: "Ordered",
      orderDate: "2026-01-15",
      deliveryDate: "2026-02-15",
      budget: 600000,
    },
    {
      capexNo: "CAPEX-2026-003",
      projectName: "Quality Lab Setup",
      vendor: "Lab Equipment Suppliers",
      vendorGST: "18AABCL5678GST",
      items: [
        {
          itemCode: "LAB-301",
          itemName: "Spectrophotometer",
          quantity: 2,
          unit: "Piece",
          rate: 150000,
          amount: 300000,
          department: "QA",
        },
        {
          itemCode: "LAB-302",
          itemName: "pH Meter",
          quantity: 5,
          unit: "Piece",
          rate: 20000,
          amount: 100000,
          department: "QA",
        },
        {
          itemCode: "LAB-303",
          itemName: "Laboratory Oven",
          quantity: 1,
          unit: "Piece",
          rate: 200000,
          amount: 200000,
          department: "QA",
        },
      ],
      totalAmount: 600000,
      status: "Draft",
      orderDate: "2026-01-22",
      deliveryDate: "2026-02-22",
      budget: 700000,
    },
  ]);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"summary" | "material">("summary");

  const filteredData = reportData.filter((row) => {
    if (vendorFilter !== "all" && row.vendor !== vendorFilter) return false;
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    return true;
  });

  const materialWiseData: Array<{
    itemCode: string;
    itemName: string;
    totalQty: number;
    unit: string;
    rate: number;
    totalAmount: number;
    department: string;
  }> = [];

  filteredData.forEach((order) => {
    order.items.forEach((item) => {
      const existing = materialWiseData.find((m) => m.itemCode === item.itemCode);
      if (existing) {
        existing.totalQty += item.quantity;
        existing.totalAmount += item.amount;
      } else {
        materialWiseData.push({
          itemCode: item.itemCode,
          itemName: item.itemName,
          totalQty: item.quantity,
          unit: item.unit,
          rate: item.rate,
          totalAmount: item.amount,
          department: item.department,
        });
      }
    });
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Approved: "bg-blue-100 text-blue-800",
      Ordered: "bg-orange-100 text-orange-800",
      Delivered: "bg-green-100 text-green-800",
      Draft: "bg-gray-100 text-gray-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const totalCapex = filteredData.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalBudget = filteredData.reduce((sum, order) => sum + order.budget, 0);
  const budgetUtilization = totalBudget > 0 ? ((totalCapex / totalBudget) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="CAPEX Order Report"
        subtitle="Capital Expenditure tracking with material-wise rates and budget analysis"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total CAPEX Orders</p>
            <p className="text-3xl font-bold text-blue-600">{filteredData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-purple-600">
              ₹{totalCapex.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Budget Utilization</p>
            <p
              className={`text-3xl font-bold ${
                Number(budgetUtilization) <= 100
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {budgetUtilization}%
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
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Ordered">Ordered</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
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
                CAPEX Order Summary
              </Button>
              <Button
                variant={viewMode === "material" ? "default" : "outline"}
                onClick={() => setViewMode("material")}
              >
                Material Wise
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* CAPEX Order Summary View */}
      {viewMode === "summary" && (
        <Card>
          <CardHeader>
            <CardTitle>CAPEX Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">CAPEX No</TableHead>
                    <TableHead className="font-semibold">Project Name</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Total Amount</TableHead>
                    <TableHead className="font-semibold">Budget</TableHead>
                    <TableHead className="font-semibold">Utilization</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Delivery Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, idx) => {
                    const util = ((row.totalAmount / row.budget) * 100).toFixed(1);
                    return (
                      <TableRow key={idx} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{row.capexNo}</TableCell>
                        <TableCell>{row.projectName}</TableCell>
                        <TableCell>{row.vendor}</TableCell>
                        <TableCell className="text-center">
                          {row.items.length}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{row.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>₹{row.budget.toLocaleString()}</TableCell>
                        <TableCell
                          className={`font-semibold ${
                            Number(util) <= 100 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {util}%
                        </TableCell>
                        <TableCell>{getStatusBadge(row.status)}</TableCell>
                        <TableCell className="text-sm">{row.deliveryDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Wise View */}
      {viewMode === "material" && (
        <Card>
          <CardHeader>
            <CardTitle>Material Wise Rates and Quantities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Item Code</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Unit</TableHead>
                    <TableHead className="font-semibold">Rate</TableHead>
                    <TableHead className="font-semibold">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialWiseData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.itemCode}</TableCell>
                      <TableCell>{row.itemName}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {row.totalQty}
                      </TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.rate.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{row.totalAmount.toLocaleString()}
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

export default CapexOrderReport;
