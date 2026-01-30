import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Download,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Star,
  BarChart3,
  Building2,
  TrendingDown,
} from "lucide-react";

interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: number;
  rating: number;
  outstandingBalance: number;
  totalPurchased: number;
}

const SupplierListEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock suppliers - in real app, this would come from state management
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      code: "SUP-001",
      name: "Steel Valley Industries",
      contact: "Vikram Sharma",
      email: "vikram@steelvalley.com",
      phone: "+91-22-5678-9012",
      address: "Mumbai, Maharashtra 400002",
      paymentTerms: 30,
      rating: 4.8,
      outstandingBalance: 450000,
      totalPurchased: 2500000,
    },
    {
      id: "2",
      code: "SUP-002",
      name: "Premium Metals Pvt Ltd",
      contact: "Sanjay Patel",
      email: "sanjay@premiummetals.com",
      phone: "+91-11-3456-7890",
      address: "New Delhi, Delhi 110001",
      paymentTerms: 45,
      rating: 4.6,
      outstandingBalance: 320000,
      totalPurchased: 1800000,
    },
    {
      id: "3",
      code: "SUP-003",
      name: "Precision Steel Corp",
      contact: "Rajiv Kumar",
      email: "rajiv@precisionsteel.com",
      phone: "+91-79-7890-1234",
      address: "Ahmedabad, Gujarat 380001",
      paymentTerms: 30,
      rating: 4.9,
      outstandingBalance: 0,
      totalPurchased: 3200000,
    },
    {
      id: "4",
      code: "SUP-004",
      name: "Elite Manufacturing Co",
      contact: "Ravi Nair",
      email: "ravi@elitemfg.com",
      phone: "+91-80-2345-6789",
      address: "Bangalore, Karnataka 560001",
      paymentTerms: 60,
      rating: 4.4,
      outstandingBalance: 550000,
      totalPurchased: 1500000,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Filter Suppliers
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "5star" && sup.rating >= 4.8) ||
      (ratingFilter === "4star" && sup.rating >= 4.0 && sup.rating < 4.8) ||
      (ratingFilter === "3star" && sup.rating < 4.0);

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "30" && sup.paymentTerms === 30) ||
      (paymentFilter === "45" && sup.paymentTerms === 45) ||
      (paymentFilter === "60" && sup.paymentTerms === 60);

    return matchesSearch && matchesRating && matchesPayment;
  });

  // KPI Calculations
  const totalSuppliers = suppliers.length;
  const totalOutstanding = suppliers.reduce(
    (sum, s) => sum + s.outstandingBalance,
    0
  );
  const totalPurchased = suppliers.reduce((sum, s) => sum + s.totalPurchased, 0);
  const avgRating =
    suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;

  // Handle Delete
  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this supplier? This cannot be undone."
      )
    ) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
    }
  };

  // Handle Export
  const handleExport = () => {
    const csv = [
      [
        "Supplier Code",
        "Supplier Name",
        "Contact Person",
        "Email",
        "Phone",
        "Address",
        "Payment Terms (Days)",
        "Outstanding Balance",
        "Total Purchased",
        "Rating",
      ].join(","),
      ...filteredSuppliers.map((sup) =>
        [
          sup.code,
          sup.name,
          sup.contact,
          sup.email,
          sup.phone,
          sup.address,
          sup.paymentTerms,
          sup.outstandingBalance,
          sup.totalPurchased,
          sup.rating,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suppliers-list.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Supplier Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Total Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{totalSuppliers}</div>
            <p className="text-xs text-blue-600">Active suppliers</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-purple-600" />
              Total Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              ₹{(totalPurchased / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-purple-600">Cumulative purchases</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              ₹{(totalOutstanding / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-orange-600">Total payables</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <Star className="h-4 w-4 text-green-600" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-green-600">Supplier quality</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, code, email or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5star">⭐⭐⭐⭐⭐ (4.8+)</SelectItem>
            <SelectItem value="4star">⭐⭐⭐⭐ (4.0-4.7)</SelectItem>
            <SelectItem value="3star">⭐⭐⭐ (Below 4.0)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Payment Terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Terms</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="45">45 Days</SelectItem>
            <SelectItem value="60">60 Days</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          onClick={() => navigate("/dashboard/purchases/add")}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Purchase
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Code</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-center">Terms</TableHead>
                  <TableHead className="text-right">Purchased</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((sup) => {
                    const cityMatch = sup.address.split(",")[0];
                    return (
                      <TableRow key={sup.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-semibold text-blue-600">
                          {sup.code}
                        </TableCell>
                        <TableCell className="font-semibold">{sup.name}</TableCell>
                        <TableCell>{sup.contact}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${sup.email}`} className="hover:underline text-xs">
                              {sup.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">{sup.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{cityMatch}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-50">
                            {sup.paymentTerms} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{(sup.totalPurchased / 100000).toFixed(1)}L
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              sup.outstandingBalance > 0
                                ? "text-orange-600 font-semibold"
                                : "text-green-600 font-semibold"
                            }
                          >
                            ₹{(sup.outstandingBalance / 100000).toFixed(1)}L
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{sup.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(sup.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <div className="space-y-2">
                        <p className="text-gray-500">No suppliers found</p>
                        <Button
                          onClick={() => navigate("/dashboard/purchases/add")}
                          variant="outline"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create First Supplier
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierListEnhanced;
