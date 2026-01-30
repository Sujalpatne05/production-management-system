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
import { Download, Eye, Printer } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderSheetItem {
  itemCode: string;
  itemName: string;
  specification: string;
  quantity: number;
  unit: string;
  unitRate: number;
  discount: number;
  amount: number;
}

interface OrderSheetData {
  orderNo: string;
  poNo: string;
  vendor: string;
  vendorGST: string;
  vendorAddress: string;
  deliveryAddress: string;
  items: OrderSheetItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  validityDate: string;
  orderDate: string;
}

const OrderSheetReport = () => {
  const [reportData] = useState<OrderSheetData[]>([
    {
      orderNo: "OS-2026-001",
      poNo: "PO-2026-001",
      vendor: "Tech Supplies Inc",
      vendorGST: "18AABCT5678GST",
      vendorAddress: "123 Industrial Park, New Delhi",
      deliveryAddress: "Factory Main Gate, Mumbai",
      items: [
        {
          itemCode: "MAT-101",
          itemName: "Electrical Cables",
          specification: "High-grade copper, 10mm dia",
          quantity: 500,
          unit: "Meter",
          unitRate: 155,
          discount: 5,
          amount: 73750,
        },
      ],
      subtotal: 77500,
      taxAmount: 13950,
      totalAmount: 91450,
      paymentTerms: "Net 30 days",
      deliveryTerms: "FOB",
      validityDate: "2026-02-22",
      orderDate: "2026-01-22",
    },
    {
      orderNo: "OS-2026-002",
      poNo: "PO-2026-002",
      vendor: "Industrial Parts Ltd",
      vendorGST: "18AABCI1234GST",
      vendorAddress: "456 Technology Zone, Bangalore",
      deliveryAddress: "Factory Main Gate, Mumbai",
      items: [
        {
          itemCode: "MAT-205",
          itemName: "Steel Components",
          specification: "Grade A, precision cut",
          quantity: 200,
          unit: "Piece",
          unitRate: 460,
          discount: 3,
          amount: 89320,
        },
      ],
      subtotal: 92000,
      taxAmount: 16560,
      totalAmount: 108560,
      paymentTerms: "Net 30 days",
      deliveryTerms: "CIF",
      validityDate: "2026-02-18",
      orderDate: "2026-01-18",
    },
    {
      orderNo: "OS-2026-003",
      poNo: "PO-2026-004",
      vendor: "Engineering Works Inc",
      vendorGST: "18AABCS5678GST",
      vendorAddress: "789 Manufacturing Hub, Pune",
      deliveryAddress: "Factory Main Gate, Mumbai",
      items: [
        {
          itemCode: "MAT-402",
          itemName: "Hydraulic Pumps",
          specification: "Industrial grade, 50 HP",
          quantity: 25,
          unit: "Piece",
          unitRate: 7950,
          discount: 8,
          amount: 182700,
        },
        {
          itemCode: "MAT-403",
          itemName: "Pressure Gauges",
          specification: "Digital, 0-350 bar",
          quantity: 50,
          unit: "Piece",
          unitRate: 1200,
          discount: 5,
          amount: 57000,
        },
      ],
      subtotal: 239700,
      taxAmount: 43146,
      totalAmount: 282846,
      paymentTerms: "Net 45 days",
      deliveryTerms: "FOB",
      validityDate: "2026-02-22",
      orderDate: "2026-01-22",
    },
  ]);

  const [vendorFilter, setVendorFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"consolidated" | "detailed">("consolidated");

  const filteredData = reportData.filter((row) => {
    if (vendorFilter !== "all" && row.vendor !== vendorFilter) return false;
    return true;
  });

  const totalOrders = filteredData.length;
  const totalOrderValue = filteredData.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalTaxAmount = filteredData.reduce((sum, order) => sum + order.taxAmount, 0);
  const totalItems = filteredData.reduce((sum, order) => sum + order.items.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Sheet Report"
        subtitle="Consolidated purchase orders with detailed item breakdowns and financial summaries"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-3xl font-bold text-purple-600">{totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Order Value</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{totalOrderValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Tax Amount</p>
            <p className="text-3xl font-bold text-orange-600">
              ₹{totalTaxAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
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
            <div className="flex gap-2">
              <Button
                variant={viewMode === "consolidated" ? "default" : "outline"}
                onClick={() => setViewMode("consolidated")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Consolidated View
              </Button>
              <Button
                variant={viewMode === "detailed" ? "default" : "outline"}
                onClick={() => setViewMode("detailed")}
              >
                Detailed View
              </Button>
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Consolidated View */}
      {viewMode === "consolidated" && (
        <div className="space-y-6">
          {filteredData.map((order, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {order.orderNo} - {order.vendor}
                    </h3>
                    <p className="text-sm text-gray-600">PO: {order.poNo}</p>
                  </div>
                  <Badge>₹{order.totalAmount.toLocaleString()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">GST No</p>
                    <p className="text-sm">{order.vendorGST}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Order Date</p>
                    <p className="text-sm">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Validity</p>
                    <p className="text-sm">{order.validityDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Payment Terms</p>
                    <p className="text-sm">{order.paymentTerms}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold">Item Code</TableHead>
                        <TableHead className="font-semibold">Item Name</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Unit Rate</TableHead>
                        <TableHead className="font-semibold">Discount %</TableHead>
                        <TableHead className="font-semibold text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, itemIdx) => (
                        <TableRow key={itemIdx}>
                          <TableCell className="font-medium">{item.itemCode}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell className="text-center">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell>₹{item.unitRate.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{item.discount}%</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end">
                  <div className="w-full md:w-80 space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Tax (18%):</span>
                      <span className="font-semibold">₹{order.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between bg-blue-50 p-2 rounded font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery & Terms */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Delivery Address</p>
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Delivery Terms</p>
                    <p className="text-sm">{order.deliveryTerms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed View */}
      {viewMode === "detailed" && (
        <Card>
          <CardHeader>
            <CardTitle>All Orders - Detailed Item List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Order No</TableHead>
                    <TableHead className="font-semibold">PO No</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Item Code</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Unit Rate</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Total Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((order, orderIdx) =>
                    order.items.map((item, itemIdx) => (
                      <TableRow key={`${orderIdx}-${itemIdx}`} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {itemIdx === 0 ? order.orderNo : ""}
                        </TableCell>
                        <TableCell>{itemIdx === 0 ? order.poNo : ""}</TableCell>
                        <TableCell>{itemIdx === 0 ? order.vendor : ""}</TableCell>
                        <TableCell className="font-medium">{item.itemCode}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell className="text-center">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{item.unitRate.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-blue-600">
                          {itemIdx === 0 ? (
                            `₹${order.totalAmount.toLocaleString()}`
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderSheetReport;
