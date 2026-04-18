import { useState, useEffect } from "react";
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
import { Search, Plus, Trash2 } from "lucide-react";

interface Purchase {
  id: string;
  invoiceNo: string;
  supplier: string;
  total: number;
  date: string;
  status: string;
}

export default function PurchaseListSimple() {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/purchases", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPurchases(data.data || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast({ title: "Error", description: "Failed to load purchases", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this purchase?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/purchases/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(purchases.filter(p => p.id !== id));
      toast({ title: "Success", description: "Purchase deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/purchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setPurchases(purchases.map(p =>
          p.id === id ? { ...p, status: newStatus } : p
        ));
        toast({ title: "Success", description: `Status changed to ${newStatus}` });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredPurchases = purchases.filter(p =>
    p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase List" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Purchases</CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Purchase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by PO or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : filteredPurchases.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No purchases found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.map(purchase => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-mono">{purchase.invoiceNo}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>₹{purchase.total.toLocaleString()}</TableCell>
                      <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select value={purchase.status} onValueChange={(newStatus) => handleStatusChange(purchase.id, newStatus)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(purchase.id)}
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
    </div>
  );
}
