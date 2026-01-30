import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Download, Eye } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PurchaseOrderItem {
  itemCode: string;
  itemName: string;
  specification: string;
  qty: number;
  unit: string;
  unitRate: number;
  discount: number;
  amount: number;
  hsnCode: string;
  gstRate: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  requisitionNo: string;
  requisitionDate: string;
  buyerCompany: string;
  buyerGST: string;
  supplierName: string;
  supplierGST: string;
  supplierAddress: string;
  deliveryAddress: string;
  items: PurchaseOrderItem[];
  deliveryTerms: string;
  paymentTerms: string;
  transporterName: string;
  insuranceNo: string;
  pnfCharges: number;
  installationCharges: number;
  commissionCharges: number;
  tds: number;
  totalAmount: number;
  status: "Draft" | "Approved" | "Ordered" | "Delivered" | "Cancelled";
  createdDate: string;
}

const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "1",
      poNumber: "PO-2026-001",
      poDate: "2026-01-20",
      requisitionNo: "REQ-2026-001",
      requisitionDate: "2026-01-15",
      buyerCompany: "IProduction Ltd",
      buyerGST: "18AABCU1234GST",
      supplierName: "Tech Supplies Inc",
      supplierGST: "18AABCT5678GST",
      supplierAddress: "Mumbai, MH",
      deliveryAddress: "Pune, MH",
      items: [
        {
          itemCode: "MAT-001",
          itemName: "Steel Sheet",
          specification: "2mm Grade A",
          qty: 100,
          unit: "KG",
          unitRate: 150,
          discount: 5,
          amount: 14250,
          hsnCode: "7208.1000",
          gstRate: 5,
        },
      ],
      deliveryTerms: "FOB Shipping Point",
      paymentTerms: "Net 30",
      transporterName: "Fast Logistics",
      insuranceNo: "INS-2026-001",
      pnfCharges: 500,
      installationCharges: 1000,
      commissionCharges: 500,
      tds: 100,
      totalAmount: 16250,
      status: "Approved",
      createdDate: "2026-01-20",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<PurchaseOrder>({
    id: "",
    poNumber: "",
    poDate: new Date().toISOString().split("T")[0],
    requisitionNo: "",
    requisitionDate: "",
    buyerCompany: "",
    buyerGST: "",
    supplierName: "",
    supplierGST: "",
    supplierAddress: "",
    deliveryAddress: "",
    items: [
      {
        itemCode: "",
        itemName: "",
        specification: "",
        qty: 0,
        unit: "",
        unitRate: 0,
        discount: 0,
        amount: 0,
        hsnCode: "",
        gstRate: 0,
      },
    ],
    deliveryTerms: "",
    paymentTerms: "Net 30",
    transporterName: "",
    insuranceNo: "",
    pnfCharges: 0,
    installationCharges: 0,
    commissionCharges: 0,
    tds: 0,
    totalAmount: 0,
    status: "Draft",
    createdDate: new Date().toISOString().split("T")[0],
  });

  const handleAddPO = () => {
    const newPO: PurchaseOrder = {
      ...formData,
      id: Date.now().toString(),
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
    resetForm();
    setDialogOpen(false);
  };

  const handleEditPO = () => {
    if (!editingPO) return;
    setPurchaseOrders(
      purchaseOrders.map((po) => (po.id === editingPO.id ? formData : po))
    );
    resetForm();
    setDialogOpen(false);
  };

  const handleDeletePO = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter((po) => po.id !== id));
    setDeleteConfirm(null);
  };

  const handleEditClick = (po: PurchaseOrder) => {
    setEditingPO(po);
    setFormData(po);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPO(null);
    setFormData({
      id: "",
      poNumber: "",
      poDate: new Date().toISOString().split("T")[0],
      requisitionNo: "",
      requisitionDate: "",
      buyerCompany: "",
      buyerGST: "",
      supplierName: "",
      supplierGST: "",
      supplierAddress: "",
      deliveryAddress: "",
      items: [
        {
          itemCode: "",
          itemName: "",
          specification: "",
          qty: 0,
          unit: "",
          unitRate: 0,
          discount: 0,
          amount: 0,
          hsnCode: "",
          gstRate: 0,
        },
      ],
      deliveryTerms: "",
      paymentTerms: "Net 30",
      transporterName: "",
      insuranceNo: "",
      pnfCharges: 0,
      installationCharges: 0,
      commissionCharges: 0,
      tds: 0,
      totalAmount: 0,
      status: "Draft",
      createdDate: new Date().toISOString().split("T")[0],
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-gray-100 text-gray-800",
      Approved: "bg-blue-100 text-blue-800",
      Ordered: "bg-orange-100 text-orange-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage and track purchase orders with complete details"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total POs</p>
            <p className="text-3xl font-bold text-blue-600">{purchaseOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {purchaseOrders.filter((p) => p.status === "Approved").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Ordered</p>
            <p className="text-3xl font-bold text-orange-600">
              {purchaseOrders.filter((p) => p.status === "Ordered").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-3xl font-bold text-purple-600">
              ₹{purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchase Orders List</CardTitle>
          <Button
            className="gap-2"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> New Purchase Order
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">PO Number</TableHead>
                  <TableHead className="font-semibold">Requisition</TableHead>
                  <TableHead className="font-semibold">Supplier</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Total Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.length > 0 ? (
                  purchaseOrders.map((po) => (
                    <TableRow key={po.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell className="text-sm">{po.requisitionNo}</TableCell>
                      <TableCell>{po.supplierName}</TableCell>
                      <TableCell className="text-sm">{po.items.length} item(s)</TableCell>
                      <TableCell className="font-semibold">₹{po.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-sm">{po.poDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 gap-1"
                            onClick={() => handleEditClick(po)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(po)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => setDeleteConfirm(po.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* PO Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPO ? "Edit Purchase Order" : "Create New Purchase Order"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Header Section */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Requisition Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requisition No</Label>
                  <Input
                    value={formData.requisitionNo}
                    onChange={(e) =>
                      setFormData({ ...formData, requisitionNo: e.target.value })
                    }
                    placeholder="REQ-2026-001"
                  />
                </div>
                <div>
                  <Label>Requisition Date</Label>
                  <Input
                    type="date"
                    value={formData.requisitionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, requisitionDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Buyer & Supplier */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Buyer & Supplier Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Buyer Company</Label>
                  <Input
                    value={formData.buyerCompany}
                    onChange={(e) =>
                      setFormData({ ...formData, buyerCompany: e.target.value })
                    }
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label>Buyer GST No</Label>
                  <Input
                    value={formData.buyerGST}
                    onChange={(e) => setFormData({ ...formData, buyerGST: e.target.value })}
                    placeholder="GST number"
                  />
                </div>
                <div>
                  <Label>Supplier Name</Label>
                  <Input
                    value={formData.supplierName}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierName: e.target.value })
                    }
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <Label>Supplier GST No</Label>
                  <Input
                    value={formData.supplierGST}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierGST: e.target.value })
                    }
                    placeholder="GST number"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Supplier Address</Label>
                  <Textarea
                    value={formData.supplierAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierAddress: e.target.value })
                    }
                    placeholder="Address"
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Delivery Address</Label>
                  <Textarea
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryAddress: e.target.value })
                    }
                    placeholder="Address"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Items</h3>
              <div className="space-y-3">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <Input
                        placeholder="Item Code"
                        value={item.itemCode}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].itemCode = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        placeholder="Item Name"
                        value={item.itemName}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].itemName = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        placeholder="HSN Code"
                        value={item.hsnCode}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].hsnCode = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].qty = parseFloat(e.target.value);
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].unit = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Rate"
                        value={item.unitRate}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].unitRate = parseFloat(e.target.value);
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <h3 className="font-semibold mb-3">Terms & Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Delivery Terms</Label>
                  <Input
                    value={formData.deliveryTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryTerms: e.target.value })
                    }
                    placeholder="FOB/CIF/etc"
                  />
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Input
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTerms: e.target.value })
                    }
                    placeholder="Net 30"
                  />
                </div>
                <div>
                  <Label>Transporter Name</Label>
                  <Input
                    value={formData.transporterName}
                    onChange={(e) =>
                      setFormData({ ...formData, transporterName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Insurance No</Label>
                  <Input
                    value={formData.insuranceNo}
                    onChange={(e) =>
                      setFormData({ ...formData, insuranceNo: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Charges */}
            <div>
              <h3 className="font-semibold mb-3">Additional Charges</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>P&F Charges</Label>
                  <Input
                    type="number"
                    value={formData.pnfCharges}
                    onChange={(e) =>
                      setFormData({ ...formData, pnfCharges: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Installation Charges</Label>
                  <Input
                    type="number"
                    value={formData.installationCharges}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        installationCharges: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Commission Charges</Label>
                  <Input
                    type="number"
                    value={formData.commissionCharges}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionCharges: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingPO ? handleEditPO : handleAddPO}>
              {editingPO ? "Update" : "Create"} Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteConfirm && handleDeletePO(deleteConfirm)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseOrder;
