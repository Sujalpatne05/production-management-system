import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Trash2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export default function CustomerListSimple() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/parties?type=customer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          type: "customer"
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Customer added successfully" });
        setShowDialog(false);
        setNewCustomer({ name: "", email: "", phone: "", address: "" });
        fetchCustomers();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to add customer");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to add customer",
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/parties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(customers.filter(c => c.id !== id));
      toast({ title: "Success", description: "Customer deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Management" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Customers</CardTitle>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No customers found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>{customer.address || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>Add a new customer to your system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Name *</Label>
              <Input
                placeholder="e.g., ABC Manufacturing Ltd"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="e.g., contact@company.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                placeholder="e.g., +91-22-1234-5678"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                placeholder="e.g., Mumbai, Maharashtra 400001"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddCustomer} className="flex-1">
                Add Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
