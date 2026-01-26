import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Upload,
  Copy,
  DollarSign,
  Percent,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface PurchaseItem {
  id: string;
  product: string;
  quantity: number;
  unit: "PCS" | "KG" | "L" | "BOX" | "PACK";
  unitPrice: number;
  discount: number; // percentage
  discountType: "%" | "₹"; // percentage or fixed amount
  taxRate: number; // percentage
  deliveryDate: string;
  notes: string;
}

interface SupplierInfo {
  id: string;
  name: string;
  code: string;
  contact: string;
  email: string;
  rating: number;
  paymentTerms: string;
  address: string;
  lastOrderAmount: number;
  lastOrderDate: string;
}

const mockSuppliers: SupplierInfo[] = [
  {
    id: "1",
    name: "Industrial Supplies Co",
    code: "SUP-001",
    contact: "John Smith",
    email: "john@suppliers.com",
    rating: 4.5,
    paymentTerms: "30 Days",
    address: "123 Industrial Ave, Mumbai, MH 400001",
    lastOrderAmount: 150000,
    lastOrderDate: "2026-01-20",
  },
  {
    id: "2",
    name: "Premium Materials Ltd",
    code: "SUP-002",
    contact: "Sarah Johnson",
    email: "sarah@materials.com",
    rating: 4.8,
    paymentTerms: "Net 45",
    address: "456 Business Park, Delhi, DL 110001",
    lastOrderAmount: 280000,
    lastOrderDate: "2026-01-15",
  },
  {
    id: "3",
    name: "Eco Materials",
    code: "SUP-003",
    contact: "Rajesh Patel",
    email: "rajesh@ecomaterials.com",
    rating: 4.2,
    paymentTerms: "15 Days",
    address: "789 Green Street, Bangalore, KA 560001",
    lastOrderAmount: 95000,
    lastOrderDate: "2026-01-18",
  },
  {
    id: "4",
    name: "Steel Hub India",
    code: "SUP-004",
    contact: "Amit Kumar",
    email: "amit@steelhub.com",
    rating: 4.7,
    paymentTerms: "Net 30",
    address: "321 Steel Complex, Kolkata, WB 700001",
    lastOrderAmount: 450000,
    lastOrderDate: "2026-01-12",
  },
  {
    id: "5",
    name: "Global Metals Trading",
    code: "SUP-005",
    contact: "Priya Sharma",
    email: "priya@globalmetals.com",
    rating: 4.6,
    paymentTerms: "45 Days",
    address: "654 Trade Center, Pune, MH 411001",
    lastOrderAmount: 320000,
    lastOrderDate: "2026-01-10",
  },
  {
    id: "6",
    name: "Quality Industrial Works",
    code: "SUP-006",
    contact: "Vikram Singh",
    email: "vikram@qualityind.com",
    rating: 4.4,
    paymentTerms: "Net 30",
    address: "987 Industrial Zone, Ahmedabad, GJ 380001",
    lastOrderAmount: 210000,
    lastOrderDate: "2026-01-08",
  },
  {
    id: "7",
    name: "Precision Engineering Supplies",
    code: "SUP-007",
    contact: "Neha Gupta",
    email: "neha@precisioneng.com",
    rating: 4.9,
    paymentTerms: "Due on Receipt",
    address: "456 Tech Park, Hyderabad, TG 500001",
    lastOrderAmount: 175000,
    lastOrderDate: "2026-01-16",
  },
  {
    id: "8",
    name: "Universal Traders",
    code: "SUP-008",
    contact: "Suresh Reddy",
    email: "suresh@universal.com",
    rating: 4.3,
    paymentTerms: "Net 60",
    address: "123 Export House, Surat, GJ 395001",
    lastOrderAmount: 145000,
    lastOrderDate: "2026-01-14",
  },
];

const products = [
  { id: "1", name: "MS ANGLE 50x50x5 MM", hsn: "928414" },
  { id: "2", name: "Steel Rod 12mm", hsn: "928311" },
  { id: "3", name: "Mild Steel Plate", hsn: "928325" },
  { id: "4", name: "Stainless Steel Sheet", hsn: "941310" },
];

export default function AddPurchaseEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Header Section
  const [poNo, setPoNo] = useState("PO-2026-" + Date.now().toString().slice(-6));
  const [poDate, setPoDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"draft" | "confirmed" | "received">("draft");
  const [supplier, setSupplier] = useState<SupplierInfo | null>(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30");

  // New Supplier Form
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    code: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "30 Days",
  });

  // Filter suppliers based on search
  const filteredSuppliers = mockSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.contact.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const handleCreateNewSupplier = () => {
    if (!newSupplier.name || !newSupplier.contact || !newSupplier.email) {
      toast({
        title: "Please fill required fields",
        description: "Name, Contact, and Email are required",
        variant: "destructive",
      });
      return;
    }

    // Create new supplier
    const createdSupplier: SupplierInfo = {
      id: (mockSuppliers.length + 1).toString(),
      name: newSupplier.name,
      code: newSupplier.code || `SUP-${String(mockSuppliers.length + 1).padStart(3, "0")}`,
      contact: newSupplier.contact,
      email: newSupplier.email,
      rating: 4.0, // Default rating
      paymentTerms: newSupplier.paymentTerms,
      address: newSupplier.address,
      lastOrderAmount: 0,
      lastOrderDate: "-",
    };

    setSupplier(createdSupplier);
    mockSuppliers.push(createdSupplier); // Add to list
    setShowNewSupplierForm(false);
    setNewSupplier({
      name: "",
      code: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      paymentTerms: "30 Days",
    });
    setSupplierSearch("");
    toast({
      title: "Supplier created successfully",
      description: `${createdSupplier.name} has been added`,
    });
  };

  // Items
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: "1",
      product: "",
      quantity: 1,
      unit: "PCS",
      unitPrice: 0,
      discount: 0,
      discountType: "%",
      taxRate: 18,
      deliveryDate: "",
      notes: "",
    },
  ]);

  // Additional Details
  const [shippingCost, setShippingCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [termsConditions, setTermsConditions] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Calculations
  const calculateItemTotal = (item: PurchaseItem) => {
    let lineTotal = item.quantity * item.unitPrice;
    const discountAmount =
      item.discountType === "%"
        ? (lineTotal * item.discount) / 100
        : item.discount;
    const beforeTax = lineTotal - discountAmount;
    const taxAmount = (beforeTax * item.taxRate) / 100;
    return beforeTax + taxAmount;
  };

  const subtotal = items.reduce((sum, item) => {
    let lineTotal = item.quantity * item.unitPrice;
    const discountAmount =
      item.discountType === "%"
        ? (lineTotal * item.discount) / 100
        : item.discount;
    return sum + (lineTotal - discountAmount);
  }, 0);

  const totalTax = items.reduce((sum, item) => {
    let lineTotal = item.quantity * item.unitPrice;
    const discountAmount =
      item.discountType === "%"
        ? (lineTotal * item.discount) / 100
        : item.discount;
    const beforeTax = lineTotal - discountAmount;
    return sum + (beforeTax * item.taxRate) / 100;
  }, 0);

  const totalCharges = shippingCost + insuranceCost + otherCharges;
  const grandTotal = subtotal + totalTax + totalCharges;

  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        product: "",
        quantity: 1,
        unit: "PCS",
        unitPrice: 0,
        discount: 0,
        discountType: "%",
        taxRate: 18,
        deliveryDate: "",
        notes: "",
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleSave = () => {
    if (!supplier) {
      toast({ title: "Please select a supplier", variant: "destructive" });
      return;
    }
    if (items.some((item) => !item.product)) {
      toast({
        title: "All items must have a product selected",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Purchase Order saved successfully" });
    setTimeout(() => navigate("/dashboard/purchases/list"), 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Purchase Order" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="items">Items & Pricing</TabsTrigger>
          <TabsTrigger value="delivery">Delivery & Terms</TabsTrigger>
          <TabsTrigger value="notes">Notes & Documents</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-4">
          {/* PO Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <Label className="text-xs">PO Number</Label>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={poNo} readOnly className="font-mono" />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Label className="text-xs">PO Date</Label>
              </CardHeader>
              <CardContent>
                <Input type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Label className="text-xs">Status</Label>
              </CardHeader>
              <CardContent>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Status Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    status === "draft"
                      ? "secondary"
                      : status === "confirmed"
                      ? "default"
                      : "outline"
                  }
                >
                  {status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Supplier *</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type supplier name, code or contact..."
                      value={supplier ? `${supplier.code} - ${supplier.name}` : supplierSearch}
                      onChange={(e) => {
                        setSupplierSearch(e.target.value);
                        setShowSupplierDropdown(true);
                        if (supplier) setSupplier(null);
                      }}
                      onFocus={() => setShowSupplierDropdown(true)}
                      className="w-full"
                    />
                    {showSupplierDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {filteredSuppliers.length > 0 ? (
                          <>
                            {filteredSuppliers.map((sup) => (
                              <button
                                key={sup.id}
                                onClick={() => {
                                  setSupplier(sup);
                                  setSupplierSearch("");
                                  setShowSupplierDropdown(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 flex justify-between items-start"
                              >
                                <div>
                                  <p className="font-semibold text-sm">{sup.code} - {sup.name}</p>
                                  <p className="text-xs text-gray-600">{sup.contact} • {sup.email}</p>
                                </div>
                                <div className="text-right text-xs">
                                  <p className="font-semibold">⭐ {sup.rating}</p>
                                </div>
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                setShowNewSupplierForm(true);
                                setShowSupplierDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-green-50 border-t border-gray-100 text-green-600 font-semibold text-sm flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add New Supplier
                            </button>
                          </>
                        ) : supplierSearch ? (
                          <div className="space-y-2 p-3">
                            <p className="text-sm text-gray-500">No suppliers found matching "{supplierSearch}"</p>
                            <button
                              onClick={() => {
                                setShowNewSupplierForm(true);
                                setShowSupplierDropdown(false);
                              }}
                              className="w-full px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-green-600 font-semibold text-sm flex items-center justify-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Create "{supplierSearch}" as New Supplier
                            </button>
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            {mockSuppliers.length} suppliers available - start typing to filter
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Payment Terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Due on Receipt</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="45">45 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* New Supplier Form Modal */}
              {showNewSupplierForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <Card className="w-full max-w-2xl mx-4">
                    <CardHeader>
                      <CardTitle>Add New Supplier</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Supplier Name *</Label>
                          <Input
                            placeholder="e.g., Small Manufacturing Co"
                            value={newSupplier.name}
                            onChange={(e) =>
                              setNewSupplier({ ...newSupplier, name: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Supplier Code (Optional)</Label>
                          <Input
                            placeholder="e.g., SUP-009"
                            value={newSupplier.code}
                            onChange={(e) =>
                              setNewSupplier({ ...newSupplier, code: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Contact Person *</Label>
                          <Input
                            placeholder="Full name"
                            value={newSupplier.contact}
                            onChange={(e) =>
                              setNewSupplier({ ...newSupplier, contact: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Email Address *</Label>
                          <Input
                            type="email"
                            placeholder="contact@supplier.com"
                            value={newSupplier.email}
                            onChange={(e) =>
                              setNewSupplier({ ...newSupplier, email: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input
                            placeholder="+91-XXXX-XXXX-XXXX"
                            value={newSupplier.phone}
                            onChange={(e) =>
                              setNewSupplier({ ...newSupplier, phone: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Payment Terms</Label>
                          <Select
                            value={newSupplier.paymentTerms}
                            onValueChange={(value) =>
                              setNewSupplier({ ...newSupplier, paymentTerms: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                              <SelectItem value="15 Days">15 Days</SelectItem>
                              <SelectItem value="30 Days">30 Days</SelectItem>
                              <SelectItem value="45 Days">45 Days</SelectItem>
                              <SelectItem value="60 Days">60 Days</SelectItem>
                              <SelectItem value="Net 30">Net 30</SelectItem>
                              <SelectItem value="Net 45">Net 45</SelectItem>
                              <SelectItem value="Net 60">Net 60</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Address</Label>
                        <Textarea
                          placeholder="Full business address"
                          value={newSupplier.address}
                          onChange={(e) =>
                            setNewSupplier({ ...newSupplier, address: e.target.value })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowNewSupplierForm(false);
                            setNewSupplier({
                              name: "",
                              code: "",
                              contact: "",
                              email: "",
                              phone: "",
                              address: "",
                              paymentTerms: "30 Days",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateNewSupplier}
                          className="bg-green-600 hover:bg-green-700 gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create Supplier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {supplier && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Contact Person</p>
                      <p className="font-semibold">{supplier.contact}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold text-blue-600">{supplier.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <p className="font-semibold">⭐ {supplier.rating}/5</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Address</p>
                      <p className="font-semibold">{supplier.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Order</p>
                      <p className="font-semibold">₹{supplier.lastOrderAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Delivery Address</Label>
              <Textarea
                placeholder="Enter complete delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items & Pricing Tab */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Purchase Line Items</CardTitle>
              <Button size="sm" className="gap-2" onClick={addItem}>
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Tax %</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const lineTotal = calculateItemTotal(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select
                              value={item.product}
                              onValueChange={(value) =>
                                updateItem(item.id, "product", value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((prod) => (
                                  <SelectItem key={prod.id} value={prod.id}>
                                    {prod.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.unit}
                              onValueChange={(value: any) =>
                                updateItem(item.id, "unit", value)
                              }
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PCS">PCS</SelectItem>
                                <SelectItem value="KG">KG</SelectItem>
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="BOX">BOX</SelectItem>
                                <SelectItem value="PACK">PACK</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-24"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                value={item.discount}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "discount",
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="w-16"
                              />
                              <Select
                                value={item.discountType}
                                onValueChange={(value: any) =>
                                  updateItem(item.id, "discountType", value)
                                }
                              >
                                <SelectTrigger className="w-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="%">%</SelectItem>
                                  <SelectItem value="₹">₹</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "taxRate",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-16"
                            />
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₹{lineTotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Subtotal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{subtotal.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Total Tax (GST)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{totalTax.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Charges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{totalCharges.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-2 border-purple-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Grand Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{grandTotal.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Charges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Charges</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Shipping Cost</Label>
                <Input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                  className="mt-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Insurance</Label>
                <Input
                  type="number"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(parseFloat(e.target.value))}
                  className="mt-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Other Charges</Label>
                <Input
                  type="number"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(parseFloat(e.target.value))}
                  className="mt-2"
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery & Terms Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Line Item Delivery Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Expected Delivery Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product || "-"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={item.deliveryDate}
                          onChange={(e) =>
                            updateItem(item.id, "deliveryDate", e.target.value)
                          }
                          className="w-40"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Special instructions..."
                          value={item.notes}
                          onChange={(e) =>
                            updateItem(item.id, "notes", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter payment terms, delivery terms, quality requirements, penalties, etc."
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes & Documents Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add internal remarks, approval notes, quality checks, etc."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attachments</CardTitle>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  Drag and drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported: PDF, Images, Excel, Word
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Summary & Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>PO Number:</strong> {poNo}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Supplier:</strong> {supplier?.name || "Not selected"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Total Items:</strong> {items.length}
                </p>
                <p className="text-lg font-bold text-purple-600">
                  <strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/dashboard/purchases/list")}>
                  Cancel
                </Button>
                <Button className="gap-2" onClick={() => handleSave()}>
                  <CheckCircle2 className="h-4 w-4" />
                  Save & Confirm PO
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
