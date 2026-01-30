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
  User,
  Mail,
  MapPin,
} from "lucide-react";

interface SaleItem {
  id: string;
  product: string;
  quantity: number;
  unit: "PCS" | "KG" | "L" | "BOX" | "PACK";
  unitPrice: number;
  discount: number;
  discountType: "%" | "₹";
  taxRate: number;
  deliveryDate: string;
  notes: string;
}

interface CustomerInfo {
  id: string;
  name: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
  address: string;
  creditLimit: number;
  outstandingBalance: number;
}

const mockCustomers: CustomerInfo[] = [
  {
    id: "1",
    name: "ABC Manufacturing Ltd",
    code: "CUST-001",
    contact: "Rajesh Kumar",
    email: "rajesh@abcmfg.com",
    phone: "+91-22-4567-8901",
    rating: 4.8,
    address: "Mumbai, Maharashtra 400001",
    creditLimit: 500000,
    outstandingBalance: 150000,
  },
  {
    id: "2",
    name: "XYZ Enterprises",
    code: "CUST-002",
    contact: "Priya Singh",
    email: "priya@xyzent.com",
    phone: "+91-11-2345-6789",
    rating: 4.5,
    address: "Delhi, Delhi 110001",
    creditLimit: 750000,
    outstandingBalance: 0,
  },
  {
    id: "3",
    name: "Global Traders Inc",
    code: "CUST-003",
    contact: "Amit Patel",
    email: "amit@globaltraders.com",
    phone: "+91-79-1234-5678",
    rating: 4.7,
    address: "Ahmedabad, Gujarat 380001",
    creditLimit: 300000,
    outstandingBalance: 75000,
  },
  {
    id: "4",
    name: "Industrial Solutions Co",
    code: "CUST-004",
    contact: "Vikram Sharma",
    email: "vikram@indsol.com",
    phone: "+91-80-5678-9012",
    rating: 4.6,
    address: "Bangalore, Karnataka 560001",
    creditLimit: 600000,
    outstandingBalance: 200000,
  },
  {
    id: "5",
    name: "Tech Innovations Ltd",
    code: "CUST-005",
    contact: "Neha Gupta",
    email: "neha@techinnovate.com",
    phone: "+91-40-3456-7890",
    rating: 4.9,
    address: "Hyderabad, Telangana 500001",
    creditLimit: 800000,
    outstandingBalance: 0,
  },
  {
    id: "6",
    name: "Premium Enterprises",
    code: "CUST-006",
    contact: "Suresh Reddy",
    email: "suresh@premiument.com",
    phone: "+91-40-8765-4321",
    rating: 4.4,
    address: "Hyderabad, Telangana 500002",
    creditLimit: 450000,
    outstandingBalance: 120000,
  },
  {
    id: "7",
    name: "Metro Trading Company",
    code: "CUST-007",
    contact: "Meera Nair",
    email: "meera@metrotrading.com",
    phone: "+91-484-1234-5678",
    rating: 4.3,
    address: "Kochi, Kerala 682001",
    creditLimit: 350000,
    outstandingBalance: 85000,
  },
  {
    id: "8",
    name: "Apex Industries",
    code: "CUST-008",
    contact: "Sanjay Kumar",
    email: "sanjay@apexind.com",
    phone: "+91-33-6789-0123",
    rating: 4.7,
    address: "Kolkata, West Bengal 700001",
    creditLimit: 550000,
    outstandingBalance: 0,
  },
  {
    id: "9",
    name: "Stellar Manufacturing",
    code: "CUST-009",
    contact: "Deepak Verma",
    email: "deepak@stellarmfg.com",
    phone: "+91-141-2345-6789",
    rating: 4.2,
    address: "Jaipur, Rajasthan 302001",
    creditLimit: 400000,
    outstandingBalance: 160000,
  },
  {
    id: "10",
    name: "Universal Components Ltd",
    code: "CUST-010",
    contact: "Anjali Desai",
    email: "anjali@univcomponents.com",
    phone: "+91-20-5432-1098",
    rating: 4.6,
    address: "Pune, Maharashtra 411001",
    creditLimit: 700000,
    outstandingBalance: 220000,
  },
  {
    id: "11",
    name: "Precision Engineering Works",
    code: "CUST-011",
    contact: "Mohit Singh",
    email: "mohit@precisioneng.com",
    phone: "+91-97-7890-1234",
    rating: 4.8,
    address: "Noida, Uttar Pradesh 201301",
    creditLimit: 600000,
    outstandingBalance: 0,
  },
  {
    id: "12",
    name: "Quality Products India",
    code: "CUST-012",
    contact: "Isha Patel",
    email: "isha@qualityproducts.com",
    phone: "+91-261-3456-7890",
    rating: 4.5,
    address: "Vadodara, Gujarat 390001",
    creditLimit: 480000,
    outstandingBalance: 145000,
  },
  {
    id: "13",
    name: "Dynamic Trade Solutions",
    code: "CUST-013",
    contact: "Rakesh Gupta",
    email: "rakesh@dynamictrade.com",
    phone: "+91-124-8765-4321",
    rating: 4.4,
    address: "Gurgaon, Haryana 122001",
    creditLimit: 550000,
    outstandingBalance: 95000,
  },
  {
    id: "14",
    name: "Bright Innovations Corp",
    code: "CUST-014",
    contact: "Priya Bansal",
    email: "priya@brightinnovate.com",
    phone: "+91-877-2345-6789",
    rating: 4.7,
    address: "Lucknow, Uttar Pradesh 226001",
    creditLimit: 400000,
    outstandingBalance: 0,
  },
  {
    id: "15",
    name: "Summit Enterprise Group",
    code: "CUST-015",
    contact: "Arjun Reddy",
    email: "arjun@summitgroup.com",
    phone: "+91-40-9876-5432",
    rating: 4.9,
    address: "Secunderabad, Telangana 500003",
    creditLimit: 850000,
    outstandingBalance: 300000,
  },
  {
    id: "16",
    name: "Reliance Industrial Systems",
    code: "CUST-016",
    contact: "Vikram Singh",
    email: "vikram@relianceindsys.com",
    phone: "+91-22-7654-3210",
    rating: 4.8,
    address: "Mumbai, Maharashtra 400002",
    creditLimit: 1000000,
    outstandingBalance: 450000,
  },
  {
    id: "17",
    name: "Fortune Global Pvt Ltd",
    code: "CUST-017",
    contact: "Sanjana Verma",
    email: "sanjana@fortuneglobal.com",
    phone: "+91-11-1234-5678",
    rating: 4.6,
    address: "New Delhi, Delhi 110003",
    creditLimit: 700000,
    outstandingBalance: 180000,
  },
  {
    id: "18",
    name: "Crystal Engineering Ltd",
    code: "CUST-018",
    contact: "Harish Patel",
    email: "harish@crystaleng.com",
    phone: "+91-79-8765-4321",
    rating: 4.7,
    address: "Surat, Gujarat 395002",
    creditLimit: 550000,
    outstandingBalance: 0,
  },
  {
    id: "19",
    name: "Alpha Digital Solutions",
    code: "CUST-019",
    contact: "Maya Sharma",
    email: "maya@alphadigital.com",
    phone: "+91-80-3456-7890",
    rating: 4.9,
    address: "Bangalore, Karnataka 560002",
    creditLimit: 900000,
    outstandingBalance: 250000,
  },
  {
    id: "20",
    name: "Pioneer Manufacturing Co",
    code: "CUST-020",
    contact: "Ravi Nair",
    email: "ravi@pioneermfg.com",
    phone: "+91-44-5678-9012",
    rating: 4.5,
    address: "Chennai, Tamil Nadu 600001",
    creditLimit: 650000,
    outstandingBalance: 120000,
  },
  {
    id: "21",
    name: "Spectrum Industries",
    code: "CUST-021",
    contact: "Pooja Singh",
    email: "pooja@spectrumind.com",
    phone: "+91-712-2345-6789",
    rating: 4.8,
    address: "Nagpur, Maharashtra 440001",
    creditLimit: 480000,
    outstandingBalance: 0,
  },
  {
    id: "22",
    name: "Unity Trade Partners",
    code: "CUST-022",
    contact: "Rahul Gupta",
    email: "rahul@unitytrade.com",
    phone: "+91-33-9876-5432",
    rating: 4.4,
    address: "Kolkata, West Bengal 700002",
    creditLimit: 420000,
    outstandingBalance: 85000,
  },
  {
    id: "23",
    name: "Vertex Solutions Inc",
    code: "CUST-023",
    contact: "Divya Reddy",
    email: "divya@vertexsol.com",
    phone: "+91-40-1234-5678",
    rating: 4.7,
    address: "Hyderabad, Telangana 500004",
    creditLimit: 750000,
    outstandingBalance: 200000,
  },
  {
    id: "24",
    name: "Horizon Business Group",
    code: "CUST-024",
    contact: "Anand Kumar",
    email: "anand@horizonbiz.com",
    phone: "+91-821-3456-7890",
    rating: 4.2,
    address: "Mysore, Karnataka 570001",
    creditLimit: 380000,
    outstandingBalance: 95000,
  },
  {
    id: "25",
    name: "Elite Manufacturing Corp",
    code: "CUST-025",
    contact: "Shruti Patel",
    email: "shruti@elitemfg.com",
    phone: "+91-172-5678-9012",
    rating: 4.6,
    address: "Chandigarh, Chandigarh 160001",
    creditLimit: 600000,
    outstandingBalance: 0,
  },
  {
    id: "26",
    name: "NextGen Innovations Ltd",
    code: "CUST-026",
    contact: "Abhishek Singh",
    email: "abhishek@nextgeninno.com",
    phone: "+91-98-8765-4321",
    rating: 4.9,
    address: "Pune, Maharashtra 411002",
    creditLimit: 820000,
    outstandingBalance: 310000,
  },
  {
    id: "27",
    name: "Paramount Trading Company",
    code: "CUST-027",
    contact: "Natasha Reddy",
    email: "natasha@paramounttrade.com",
    phone: "+91-91-4567-8901",
    rating: 4.5,
    address: "Visakhapatnam, Andhra Pradesh 530001",
    creditLimit: 500000,
    outstandingBalance: 140000,
  },
];

const products = [
  { id: "1", name: "MS ANGLE 50x50x5 MM", hsn: "928414" },
  { id: "2", name: "Steel Rod 12mm", hsn: "928311" },
  { id: "3", name: "Mild Steel Plate", hsn: "928325" },
  { id: "4", name: "Stainless Steel Sheet", hsn: "941310" },
];

export default function AddSaleEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Customer Management State
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    creditLimit: 500000,
    rating: 4.5,
  });

  const invoiceNo = "INV-2026-" + Date.now().toString().slice(-6);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [status, setStatus] = useState<"draft" | "confirmed" | "shipped" | "delivered">("draft");
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30");

  // Add new customer function
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.contact || !newCustomer.email || !newCustomer.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required customer fields",
        variant: "destructive",
      });
      return;
    }

    const customerId = (customers.length + 1).toString();
    const customerCode = `CUST-${String(customers.length + 1).padStart(3, "0")}`;

    const customerToAdd: CustomerInfo = {
      id: customerId,
      code: customerCode,
      name: newCustomer.name,
      contact: newCustomer.contact,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      creditLimit: newCustomer.creditLimit,
      outstandingBalance: 0,
      rating: newCustomer.rating,
    };

    setCustomers([...customers, customerToAdd]);
    setCustomer(customerToAdd);
    setCustomerSearch("");
    setShowAddCustomerModal(false);
    setShowCustomerDropdown(false);

    // Reset form
    setNewCustomer({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      creditLimit: 500000,
      rating: 4.5,
    });

    toast({
      title: "Success",
      description: `Customer ${customerToAdd.name} added successfully!`,
    });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.contact.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const [items, setItems] = useState<SaleItem[]>([
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

  const [shippingCost, setShippingCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [termsConditions, setTermsConditions] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const calculateItemTotal = (item: SaleItem) => {
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

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
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
    if (!customer) {
      toast({ title: "Please select a customer", variant: "destructive" });
      return;
    }
    if (items.some((item) => !item.product)) {
      toast({
        title: "All items must have a product selected",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Sales Invoice saved successfully" });
    setTimeout(() => navigate("/dashboard/sales/list"), 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Sales Invoice" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="items">Items & Pricing</TabsTrigger>
          <TabsTrigger value="delivery">Delivery & Terms</TabsTrigger>
          <TabsTrigger value="notes">Notes & Documents</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-4">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <Label className="text-xs">Invoice Number</Label>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={invoiceNo} readOnly className="font-mono" />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Label className="text-xs">Invoice Date</Label>
              </CardHeader>
              <CardContent>
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Label className="text-xs">Due Date</Label>
              </CardHeader>
              <CardContent>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Customer *</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type customer name, code or contact..."
                      value={customer ? `${customer.code} - ${customer.name}` : customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                        if (customer) setCustomer(null);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      className="w-full"
                    />
                    {showCustomerDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((cust) => (
                            <button
                              key={cust.id}
                              onClick={() => {
                                setCustomer(cust);
                                setCustomerSearch("");
                                setShowCustomerDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 flex justify-between items-start"
                            >
                              <div>
                                <p className="font-semibold text-sm">{cust.code} - {cust.name}</p>
                                <p className="text-xs text-gray-600">{cust.contact} • {cust.email}</p>
                              </div>
                              <div className="text-right text-xs">
                                <p className="font-semibold">⭐ {cust.rating}</p>
                              </div>
                            </button>
                          ))
                        ) : customerSearch ? (
                          <div className="space-y-2 p-3">
                            <div className="px-2 py-2 text-sm text-gray-600">
                              No customers found for "{customerSearch}"
                            </div>
                            <Button
                              onClick={() => {
                                setShowCustomerDropdown(false);
                                setShowAddCustomerModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Customer
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 p-3">
                            <div className="text-sm text-gray-500">
                              {customers.length > 0 
                                ? `${customers.length} customers available - start typing to filter`
                                : "No customers yet - add one to get started"}
                            </div>
                            <Button
                              onClick={() => {
                                setShowCustomerDropdown(false);
                                setShowAddCustomerModal(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Customer
                            </Button>
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

              {customer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Contact Person</p>
                      <p className="font-semibold">{customer.contact}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold text-blue-600">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <p className="font-semibold">⭐ {customer.rating}/5</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Outstanding</p>
                      <p className="font-semibold text-orange-600">₹{customer.outstandingBalance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-gray-600 text-xs">Address</p>
                    <p className="font-semibold text-sm">{customer.address}</p>
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
                placeholder="Enter delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items & Pricing Tab */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax %</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select value={item.product} onValueChange={(value) => updateItem(item.id, "product", value)}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value))}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Select value={item.unit} onValueChange={(value: any) => updateItem(item.id, "unit", value)}>
                            <SelectTrigger className="w-24">
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
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value))}
                            className="w-28 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 items-center w-32">
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value))}
                              className="w-16 text-right text-sm"
                            />
                            <Select value={item.discountType} onValueChange={(value: any) => updateItem(item.id, "discountType", value)}>
                              <SelectTrigger className="w-12 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="%">%</SelectItem>
                                <SelectItem value="₹">₹</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.taxRate}
                            onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value))}
                            className="w-16 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{calculateItemTotal(item).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button onClick={addItem} className="mt-4 gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Additional Charges */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Charges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Shipping Cost</Label>
                  <div className="flex gap-2">
                    <Truck className="h-4 w-4 mt-3 text-gray-400" />
                    <Input
                      type="number"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label>Insurance Cost</Label>
                  <Input
                    type="number"
                    value={insuranceCost}
                    onChange={(e) => setInsuranceCost(parseFloat(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Other Charges</Label>
                  <Input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(parseFloat(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600">Subtotal</p>
                <p className="text-2xl font-bold">₹{subtotal.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600">Tax/GST</p>
                <p className="text-2xl font-bold text-orange-600">₹{totalTax.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600">Charges</p>
                <p className="text-2xl font-bold text-green-600">₹{totalCharges.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-2 border-purple-200">
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600">Grand Total</p>
                <p className="text-2xl font-bold text-purple-600">₹{grandTotal.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Delivery & Terms Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Special Instructions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product || "N/A"}</TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={item.deliveryDate}
                          onChange={(e) => updateItem(item.id, "deliveryDate", e.target.value)}
                          className="w-40"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="e.g., Fragile, Handle with care"
                          value={item.notes}
                          onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                          className="w-60"
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
                placeholder="Enter payment terms, delivery requirements, quality specifications..."
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                rows={5}
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
                placeholder="Add internal notes, customer special requests, follow-up notes..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold">{invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold">{customer?.name || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-semibold">{items.length} items</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Grand Total:</span>
                <span className="text-purple-600">₹{grandTotal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => navigate("/dashboard/sales/list")}>
              Cancel
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              Confirm & Send Invoice
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add New Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
              <CardTitle>Add New Customer</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddCustomerModal(false)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {/* Customer Name */}
              <div>
                <Label>Company Name *</Label>
                <Input
                  placeholder="Enter company name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Contact Person */}
              <div>
                <Label>Contact Person *</Label>
                <Input
                  placeholder="Enter contact person name"
                  value={newCustomer.contact}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <Textarea
                  placeholder="Enter full address (City, State, Postal Code)"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>

              {/* Credit Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Credit Limit (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter credit limit"
                    value={newCustomer.creditLimit}
                    onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Rating (⭐)</Label>
                  <Input
                    type="number"
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newCustomer.rating}
                    onChange={(e) => setNewCustomer({ ...newCustomer, rating: parseFloat(e.target.value) || 4.5 })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAddCustomerModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomer}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const Download = Plus; // Placeholder icon
