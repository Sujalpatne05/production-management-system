import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  Package,
  DollarSign,
  Truck,
  User,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  poNo: string;
  supplier: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  poDate: string;
  deliveryDate: string;
  totalAmount: number;
  paidAmount: number;
  status: "draft" | "confirmed" | "in-transit" | "received" | "invoiced" | "paid";
  items: POItem[];
  gst: number;
  discount: number;
  timeline: TimelineEvent[];
}

interface POItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
  discount: number;
  status: "pending" | "partial" | "received";
  receivedQty: number;
}

interface TimelineEvent {
  date: string;
  event: string;
  status: string;
}

const mockPurchaseOrder: PurchaseOrder = {
  id: "1",
  poNo: "PO-2026-001",
  supplier: "Industrial Supplies Co",
  supplierEmail: "orders@industrial-supplies.com",
  supplierPhone: "+91-22-XXXX-XXXX",
  supplierAddress: "123 Industrial Park, Mumbai, MH 400001",
  poDate: "2026-01-25",
  deliveryDate: "2026-02-24",
  totalAmount: 150000,
  paidAmount: 0,
  status: "confirmed",
  gst: 18,
  discount: 5000,
  items: [
    {
      id: "1",
      product: "MS Angle - 50x50",
      quantity: 100,
      unit: "KG",
      unitPrice: 800,
      tax: 18,
      discount: 0,
      status: "pending",
      receivedQty: 0,
    },
    {
      id: "2",
      product: "Steel Rod - 12mm",
      quantity: 200,
      unit: "KG",
      unitPrice: 600,
      tax: 18,
      discount: 500,
      status: "pending",
      receivedQty: 0,
    },
    {
      id: "3",
      product: "Mild Steel Plate",
      quantity: 50,
      unit: "PCS",
      unitPrice: 1200,
      tax: 18,
      discount: 0,
      status: "pending",
      receivedQty: 0,
    },
  ],
  timeline: [
    { date: "2026-01-25", event: "PO Created", status: "completed" },
    { date: "2026-01-26", event: "Supplier Confirmed", status: "completed" },
    { date: "2026-02-15", event: "Expected Dispatch", status: "pending" },
    { date: "2026-02-24", event: "Delivery Expected", status: "pending" },
    { date: "2026-02-25", event: "Invoice Due", status: "pending" },
  ],
};

export default function PurchaseOrdersEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [po, setPo] = useState<PurchaseOrder>(mockPurchaseOrder);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "invoiced":
        return "outline";
      case "received":
        return "outline";
      case "in-transit":
        return "secondary";
      case "confirmed":
        return "default";
      case "draft":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-700";
      case "partial":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculateLineTotal = (item: POItem) => {
    const subtotal = item.quantity * item.unitPrice - item.discount;
    const tax = subtotal * (item.tax / 100);
    return subtotal + tax;
  };

  const totalLineAmount = po.items.reduce((sum, item) => sum + calculateLineTotal(item), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Order Tracking" />

      {/* PO Header */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">{po.poNo}</h2>
                <Badge className="text-lg px-3 py-1">{po.status.toUpperCase()}</Badge>
              </div>
              <p className="text-gray-600 mt-2">Created: {po.poDate}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                ₹{totalLineAmount.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Order Value</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Supplier Info & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Supplier Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Supplier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-semibold">{po.supplier}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Mail className="h-4 w-4" />
                {po.supplierEmail}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FileText className="h-4 w-4" />
                {po.supplierPhone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                {po.supplierAddress}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-500">PO Date</p>
                <p className="text-sm font-semibold">{po.poDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Expected Delivery</p>
                <p className="text-sm font-semibold">{po.deliveryDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Items Count</p>
                <p className="text-sm font-semibold">{po.items.length} items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status Card */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{po.paidAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Pending Payment</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{(totalLineAmount - po.paidAmount).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Order Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {po.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      event.status === "completed" ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  {idx < po.timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        event.status === "completed" ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{event.event}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Items & Pricing</TabsTrigger>
          <TabsTrigger value="receipt">Goods Receipt</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Matching</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax %</TableHead>
                      <TableHead className="text-right">Line Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {po.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{item.unitPrice.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          {item.discount > 0 ? `₹${item.discount.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">{item.tax}%</TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{calculateLineTotal(item).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getItemStatusColor(item.status)}>
                            {item.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Cost Breakdown */}
              <div className="mt-8 space-y-4">
                <div className="text-sm font-semibold">Cost Breakdown</div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Subtotal (before tax & discount)</p>
                    <p className="text-xl font-bold">
                      ₹
                      {po.items
                        .reduce(
                          (sum, item) => sum + (item.quantity * item.unitPrice - item.discount),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Tax/GST</p>
                    <p className="text-xl font-bold text-orange-600">
                      ₹
                      {po.items
                        .reduce((sum, item) => {
                          const subtotal =
                            item.quantity * item.unitPrice - item.discount;
                          return sum + subtotal * (item.tax / 100);
                        }, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">PO Discount</p>
                    <p className="text-xl font-bold text-green-600">
                      -₹{po.discount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                    <p className="text-xs text-gray-600">Grand Total</p>
                    <p className="text-xl font-bold text-purple-600">
                      ₹{totalLineAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goods Receipt Tab */}
        <TabsContent value="receipt">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Track received goods against PO items</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Ordered</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead>Receipt Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {po.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {item.receivedQty} {item.unit}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          {item.quantity - item.receivedQty} {item.unit}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">AWAITING</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button className="mt-4 gap-2">
                  <Package className="h-4 w-4" />
                  Record Goods Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Tab */}
        <TabsContent value="invoice">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">No Invoice Received Yet</p>
                  <p className="text-sm text-yellow-800">
                    Invoice matching will be available once supplier sends the invoice
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Invoice Management Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Upload Supplier Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Eye className="h-4 w-4" />
                    View PO Summary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{po.paidAmount.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Amount Due</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{(totalLineAmount - po.paidAmount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-3">Payment Actions</p>
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PO
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Print
        </Button>
        <Button className="gap-2">
          <Mail className="h-4 w-4" />
          Send to Supplier
        </Button>
      </div>
    </div>
  );
}
