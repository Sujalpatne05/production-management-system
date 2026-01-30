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
  Users,
  TrendingUp,
} from "lucide-react";

interface Customer {
  id: string;
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  outstandingBalance: number;
  rating: number;
}

const CustomerListEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock customers - in real app, this would come from state management
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      code: "CUST-001",
      name: "ABC Manufacturing Ltd",
      contact: "Rajesh Kumar",
      email: "rajesh@abcmfg.com",
      phone: "+91-22-4567-8901",
      address: "Mumbai, Maharashtra 400001",
      creditLimit: 500000,
      outstandingBalance: 150000,
      rating: 4.8,
    },
    {
      id: "2",
      code: "CUST-002",
      name: "XYZ Enterprises",
      contact: "Priya Singh",
      email: "priya@xyzent.com",
      phone: "+91-11-2345-6789",
      address: "Delhi, Delhi 110001",
      creditLimit: 750000,
      outstandingBalance: 0,
      rating: 4.5,
    },
    {
      id: "3",
      code: "CUST-003",
      name: "Global Traders Inc",
      contact: "Amit Patel",
      email: "amit@globaltraders.com",
      phone: "+91-79-1234-5678",
      address: "Ahmedabad, Gujarat 380001",
      creditLimit: 300000,
      outstandingBalance: 75000,
      rating: 4.7,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Filter Customers
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "5star" && cust.rating >= 4.8) ||
      (ratingFilter === "4star" && cust.rating >= 4.0 && cust.rating < 4.8) ||
      (ratingFilter === "3star" && cust.rating < 4.0);

    return matchesSearch && matchesRating;
  });

  // KPI Calculations
  const totalCustomers = customers.length;
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalOutstanding = customers.reduce(
    (sum, c) => sum + c.outstandingBalance,
    0
  );
  const avgRating =
    customers.reduce((sum, c) => sum + c.rating, 0) / customers.length;

  // Handle Delete
  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This cannot be undone."
      )
    ) {
      setCustomers(customers.filter((c) => c.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    }
  };

  // Handle Export
  const handleExport = () => {
    const csv = [
      [
        "Customer Code",
        "Customer Name",
        "Contact Person",
        "Email",
        "Phone",
        "Address",
        "Credit Limit",
        "Outstanding",
        "Rating",
      ].join(","),
      ...filteredCustomers.map((cust) =>
        [
          cust.code,
          cust.name,
          cust.contact,
          cust.email,
          cust.phone,
          cust.address,
          cust.creditLimit,
          cust.outstandingBalance,
          cust.rating,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers-list.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{totalCustomers}</div>
            <p className="text-xs text-blue-600">Active customers</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Total Credit Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ₹{(totalCreditLimit / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-green-600">Available credit</p>
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
            <p className="text-xs text-orange-600">Total receivables</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-600" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-purple-600">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
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

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          onClick={() => navigate("/dashboard/sales/add")}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Invoice
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Code</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => {
                    const cityMatch = cust.address.split(",")[0];
                    return (
                      <TableRow key={cust.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-semibold text-blue-600">
                          {cust.code}
                        </TableCell>
                        <TableCell className="font-semibold">{cust.name}</TableCell>
                        <TableCell>{cust.contact}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${cust.email}`} className="hover:underline text-xs">
                              {cust.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">{cust.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{cityMatch}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{cust.creditLimit.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              cust.outstandingBalance > 0
                                ? "text-orange-600 font-semibold"
                                : "text-green-600 font-semibold"
                            }
                          >
                            ₹{cust.outstandingBalance.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{cust.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(cust.id)}
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
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="space-y-2">
                        <p className="text-gray-500">No customers found</p>
                        <Button
                          onClick={() => navigate("/dashboard/sales/add")}
                          variant="outline"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create First Customer
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

export default CustomerListEnhanced;
