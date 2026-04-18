import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/services/apiClient";
import { AuthService } from "@/services/authService";
import { Plus, Trash2, Save } from "lucide-react";

interface PurchaseItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

interface Supplier {
  id: string;
  name: string;
  code: string;
  email: string;
}

export default function AddPurchaseSimple() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [poNo, setPoNo] = useState("PO-" + Date.now().toString().slice(-6));
  const [poDate, setPoDate] = useState(new Date().toISOString().split("T")[0]);
  const [supplier, setSupplier] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: "1", product: "", quantity: 1, unitPrice: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  // Load suppliers
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/parties?type=supplier", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        const supplierList = data.data || data || [];
        console.log("Loaded suppliers:", supplierList);
        setSuppliers(Array.isArray(supplierList) ? supplierList : []);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
        toast({ title: "Error", description: "Failed to load suppliers", variant: "destructive" });
      }
    };
    loadSuppliers();
  }, [toast]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  // Add item row
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), product: "", quantity: 1, unitPrice: 0 }
    ]);
  };

  // Remove item row
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Update item
  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Save purchase order
  const handleSave = async () => {
    // Validation
    if (!supplier) {
      toast({ title: "Error", description: "Please select a supplier", variant: "destructive" });
      return;
    }

    if (items.some(item => !item.product || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast({ title: "Error", description: "Please fill all item details", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const purchaseData = {
        poNo,
        poDate,
        supplierId: supplier,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        })),
        subtotal,
        tax,
        total,
        status: "draft"
      };

      const response = await fetch("http://localhost:5001/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(purchaseData)
      });

      if (response.ok) {
        toast({ title: "Success", description: "Purchase order created successfully" });
        setTimeout(() => navigate("/dashboard/purchases/list"), 1500);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving purchase:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save purchase order",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Purchase Order" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PO Number */}
        <Card>
          <CardHeader className="pb-2">
            <Label className="text-xs font-medium">PO Number</Label>
          </CardHeader>
          <CardContent>
            <Input value={poNo} readOnly className="font-mono text-sm" />
          </CardContent>
        </Card>

        {/* PO Date */}
        <Card>
          <CardHeader className="pb-2">
            <Label className="text-xs font-medium">PO Date</Label>
          </CardHeader>
          <CardContent>
            <Input 
              type="date" 
              value={poDate} 
              onChange={(e) => setPoDate(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Supplier */}
        <Card>
          <CardHeader className="pb-2">
            <Label className="text-xs font-medium">Supplier *</Label>
          </CardHeader>
          <CardContent>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger>
                <SelectValue placeholder={suppliers.length === 0 ? "No suppliers available" : "Select supplier"} />
              </SelectTrigger>
              <SelectContent>
                {suppliers.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No suppliers found. Add one in Supplier List.</div>
                ) : (
                  suppliers.map(sup => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Items</CardTitle>
            <Button 
              onClick={addItem} 
              size="sm" 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="w-24">Quantity</TableHead>
                  <TableHead className="w-24">Unit Price</TableHead>
                  <TableHead className="w-24">Total</TableHead>
                  <TableHead className="w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="e.g., Steel Rod, Cotton Thread"
                        value={item.product}
                        onChange={(e) => updateItem(item.id, "product", e.target.value)}
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="text-sm"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{(item.quantity * item.unitPrice).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST):</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dashboard/purchases/list")}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Purchase Order"}
        </Button>
      </div>
    </div>
  );
}
