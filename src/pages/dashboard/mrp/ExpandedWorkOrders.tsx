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
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface WorkOrderItem {
  itemCode: string;
  itemDescription: string;
  hsnCode: string;
  qty: number;
  unit: string;
  labourRate: number;
  discount: number;
  amount: number;
  gstRate: number;
}

interface WorkOrder {
  id: string;
  workOrderNo: string;
  workOrderDate: string;
  tenderNo: string;
  tenderDate: string;
  buyerCompany: string;
  buyerGST: string;
  supplierName: string;
  supplierGST: string;
  poNo: string;
  poDate: string;
  items: WorkOrderItem[];
  supplyTermsCondition: string;
  deliveryTime: string;
  insuranceNo: string;
  transporterName: string;
  pnfCharges: number;
  installationCharges: number;
  commissionCharges: number;
  manpowerQty: number;
  termsAndCondition: string;
  tds: number;
  totalAmount: number;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  efficiency: number;
  createdDate: string;
}

const ExpandedWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: "1",
      workOrderNo: "WO-2026-001",
      workOrderDate: "2026-01-20",
      tenderNo: "TEND-2026-001",
      tenderDate: "2026-01-15",
      buyerCompany: "IProduction Ltd",
      buyerGST: "18AABCU1234GST",
      supplierName: "Engineering Works Inc",
      supplierGST: "18AABCS5678GST",
      poNo: "PO-2026-001",
      poDate: "2026-01-18",
      items: [
        {
          itemCode: "PROD-001",
          itemDescription: "Custom Assembly",
          hsnCode: "8431.4390",
          qty: 50,
          unit: "PCS",
          labourRate: 500,
          discount: 5,
          amount: 23750,
          gstRate: 12,
        },
      ],
      supplyTermsCondition: "FOB Shipping Point",
      deliveryTime: "30 days",
      insuranceNo: "INS-2026-001",
      transporterName: "Fast Transport",
      pnfCharges: 500,
      installationCharges: 1000,
      commissionCharges: 500,
      manpowerQty: 10,
      termsAndCondition: "Payment in 2 instalments",
      tds: 100,
      totalAmount: 26500,
      status: "In Progress",
      efficiency: 90,
      createdDate: "2026-01-20",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWO, setEditingWO] = useState<WorkOrder | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkOrder>({
    id: "",
    workOrderNo: "",
    workOrderDate: new Date().toISOString().split("T")[0],
    tenderNo: "",
    tenderDate: "",
    buyerCompany: "",
    buyerGST: "",
    supplierName: "",
    supplierGST: "",
    poNo: "",
    poDate: "",
    items: [
      {
        itemCode: "",
        itemDescription: "",
        hsnCode: "",
        qty: 0,
        unit: "",
        labourRate: 0,
        discount: 0,
        amount: 0,
        gstRate: 0,
      },
    ],
    supplyTermsCondition: "",
    deliveryTime: "",
    insuranceNo: "",
    transporterName: "",
    pnfCharges: 0,
    installationCharges: 0,
    commissionCharges: 0,
    manpowerQty: 0,
    termsAndCondition: "",
    tds: 0,
    totalAmount: 0,
    status: "Planning",
    efficiency: 0,
    createdDate: new Date().toISOString().split("T")[0],
  });

  const handleAddWO = () => {
    const newWO: WorkOrder = {
      ...formData,
      id: Date.now().toString(),
    };
    setWorkOrders([...workOrders, newWO]);
    resetForm();
    setDialogOpen(false);
  };

  const handleEditWO = () => {
    if (!editingWO) return;
    setWorkOrders(workOrders.map((wo) => (wo.id === editingWO.id ? formData : wo)));
    resetForm();
    setDialogOpen(false);
  };

  const handleDeleteWO = (id: string) => {
    setWorkOrders(workOrders.filter((wo) => wo.id !== id));
    setDeleteConfirm(null);
  };

  const handleEditClick = (wo: WorkOrder) => {
    setEditingWO(wo);
    setFormData(wo);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingWO(null);
    setFormData({
      id: "",
      workOrderNo: "",
      workOrderDate: new Date().toISOString().split("T")[0],
      tenderNo: "",
      tenderDate: "",
      buyerCompany: "",
      buyerGST: "",
      supplierName: "",
      supplierGST: "",
      poNo: "",
      poDate: "",
      items: [
        {
          itemCode: "",
          itemDescription: "",
          hsnCode: "",
          qty: 0,
          unit: "",
          labourRate: 0,
          discount: 0,
          amount: 0,
          gstRate: 0,
        },
      ],
      supplyTermsCondition: "",
      deliveryTime: "",
      insuranceNo: "",
      transporterName: "",
      pnfCharges: 0,
      installationCharges: 0,
      commissionCharges: 0,
      manpowerQty: 0,
      termsAndCondition: "",
      tds: 0,
      totalAmount: 0,
      status: "Planning",
      efficiency: 0,
      createdDate: new Date().toISOString().split("T")[0],
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Planning: "bg-blue-100 text-blue-800",
      "In Progress": "bg-orange-100 text-orange-800",
      Completed: "bg-green-100 text-green-800",
      "On Hold": "bg-red-100 text-red-800",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const avgEfficiency = Math.round(
    workOrders.reduce((sum, w) => sum + w.efficiency, 0) / workOrders.length || 0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Orders - Detailed Management"
        subtitle="Create and manage comprehensive work orders with complete specifications"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Work Orders</p>
            <p className="text-3xl font-bold text-blue-600">{workOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-3xl font-bold text-orange-600">
              {workOrders.filter((w) => w.status === "In Progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {workOrders.filter((w) => w.status === "Completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg Efficiency</p>
            <p className="text-3xl font-bold text-purple-600">{avgEfficiency}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Orders List</CardTitle>
          <Button
            className="gap-2"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> New Work Order
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">WO Number</TableHead>
                  <TableHead className="font-semibold">Supplier</TableHead>
                  <TableHead className="font-semibold">Tender No</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Total Amount</TableHead>
                  <TableHead className="font-semibold">Efficiency</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.length > 0 ? (
                  workOrders.map((wo) => (
                    <TableRow key={wo.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{wo.workOrderNo}</TableCell>
                      <TableCell>{wo.supplierName}</TableCell>
                      <TableCell className="text-sm">{wo.tenderNo}</TableCell>
                      <TableCell className="text-sm">{wo.items.length} item(s)</TableCell>
                      <TableCell className="font-semibold">₹{wo.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${wo.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{wo.efficiency}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(wo.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(wo)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => setDeleteConfirm(wo.id)}
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
                      No work orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Work Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWO ? "Edit Work Order" : "Create New Work Order"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Header */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Work Order Header</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>WO Number</Label>
                  <Input
                    value={formData.workOrderNo}
                    onChange={(e) =>
                      setFormData({ ...formData, workOrderNo: e.target.value })
                    }
                    placeholder="WO-2026-001"
                  />
                </div>
                <div>
                  <Label>WO Date</Label>
                  <Input
                    type="date"
                    value={formData.workOrderDate}
                    onChange={(e) =>
                      setFormData({ ...formData, workOrderDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Tender No</Label>
                  <Input
                    value={formData.tenderNo}
                    onChange={(e) =>
                      setFormData({ ...formData, tenderNo: e.target.value })
                    }
                    placeholder="TEND-2026-001"
                  />
                </div>
                <div>
                  <Label>Tender Date</Label>
                  <Input
                    type="date"
                    value={formData.tenderDate}
                    onChange={(e) =>
                      setFormData({ ...formData, tenderDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Buyer & Supplier */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Company Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Buyer Company</Label>
                  <Input
                    value={formData.buyerCompany}
                    onChange={(e) =>
                      setFormData({ ...formData, buyerCompany: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Buyer GST</Label>
                  <Input
                    value={formData.buyerGST}
                    onChange={(e) =>
                      setFormData({ ...formData, buyerGST: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Supplier Name</Label>
                  <Input
                    value={formData.supplierName}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Supplier GST</Label>
                  <Input
                    value={formData.supplierGST}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierGST: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>PO No</Label>
                  <Input
                    value={formData.poNo}
                    onChange={(e) =>
                      setFormData({ ...formData, poNo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>PO Date</Label>
                  <Input
                    type="date"
                    value={formData.poDate}
                    onChange={(e) =>
                      setFormData({ ...formData, poDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Work Order Items</h3>
              <div className="space-y-3">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="border rounded p-3 bg-gray-50">
                    <div className="grid grid-cols-4 gap-2 text-xs">
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
                        placeholder="Description"
                        value={item.itemDescription}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].itemDescription = e.target.value;
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
                        placeholder="Labour Rate"
                        value={item.labourRate}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].labourRate = parseFloat(e.target.value);
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Discount %"
                        value={item.discount}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].discount = parseFloat(e.target.value);
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="GST %"
                        value={item.gstRate}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].gstRate = parseFloat(e.target.value);
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supply Terms */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Supply & Delivery Terms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Supply Terms & Condition</Label>
                  <Input
                    value={formData.supplyTermsCondition}
                    onChange={(e) =>
                      setFormData({ ...formData, supplyTermsCondition: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Delivery Time</Label>
                  <Input
                    value={formData.deliveryTime}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryTime: e.target.value })
                    }
                    placeholder="30 days"
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

            {/* Charges & Manpower */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Charges & Manpower</h3>
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
                <div>
                  <Label>Manpower Qty</Label>
                  <Input
                    type="number"
                    value={formData.manpowerQty}
                    onChange={(e) =>
                      setFormData({ ...formData, manpowerQty: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Efficiency %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.efficiency}
                    onChange={(e) =>
                      setFormData({ ...formData, efficiency: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <Label>Terms and Conditions</Label>
              <Textarea
                value={formData.termsAndCondition}
                onChange={(e) =>
                  setFormData({ ...formData, termsAndCondition: e.target.value })
                }
                rows={3}
                placeholder="Enter terms and conditions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingWO ? handleEditWO : handleAddWO}>
              {editingWO ? "Update" : "Create"} Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Work Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this work order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteConfirm && handleDeleteWO(deleteConfirm)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpandedWorkOrders;
