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
import { Plus, Trash2, Save } from "lucide-react";

interface SaleItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

export default function AddSaleSimple() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [invoiceNo, setInvoiceNo] = useState("INV-" + Date.now().toString().slice(-6));
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<SaleItem[]>([
    { id: "1", product: "", quantity: 1, unitPrice: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/parties?type=customer", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        const customerList = data.data || data || [];
        console.log("Loaded customers:", customerList);
        setCustomers(Array.isArray(customerList) ? customerList : []);
      } catch (error) {
        console.error("Failed to load customers:", error);
        toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
      }
    };
    loadCustomers();
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
  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Save sale
  const handleSave = async () => {
    // Validation
    if (!customer) {
      toast({ title: "Error", description: "Please select a customer", variant: "destructive" });
      return;
    }

    if (items.some(item => !item.product || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast({ title: "Error", description: "Please fill all item details", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const saleData = {
        invoiceNo,
        date: new Date(invoiceDate),
        customerId: customer,
        customer: customers.find(c => c.id === customer)?.name || "",
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        })),
        total,
        paid: 0,
        due: total,
        status: "draft"
      };

      const response = await fetch("http://localhost:5001/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        toast({ title: "Success", description: "Sale created successfully" });
        setTimeout(() => navigate("/dashboard/sales/list"), 1500);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving sale:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save sale",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Sales Invoice" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Invoice Number */}
        <Card>
          <CardHeader className="pb-2">
            <Label className="text-xs font-medium">Invoice Number</Label>
          </CardHeader>
          <CardContent>
            <Input value={invoiceNo} readOnly className="font-mono text-sm" />
          </CardContent>
        </Card>

        {/* Invoice Date */}
        <Card>
          <CardHeader className="pb-2">
            <Label className="text-xs font-medium">Invoice Date</Label>
          </CardHeader>
          <CardContent>
            <Input 
              type="date" 
              value={invoiceDate} 
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader className="pb-2">
            <Label className="text-xs font-medium">Customer *</Label>
          </CardHeader>
          <CardContent>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger>
                <SelectValue placeholder={customers.length === 0 ? "No customers available" : "Select customer"} />
              </SelectTrigger>
              <SelectContent>
                {customers.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No customers found. Add one in Customer List.</div>
                ) : (
                  customers.map(cust => (
                    <SelectItem key={cust.id} value={cust.id}>
                      {cust.name}
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
                        placeholder="e.g., Product A, Service B"
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
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
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
              <span className="font-bold text-green-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dashboard/sales/list")}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Sale"}
        </Button>
      </div>
    </div>
  );
}
