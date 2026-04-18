import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface Sale {
  id: string;
  invoiceNo: string;
  customer: string;
  total: number;
  date: string;
  status: string;
}

export default function SaleListSimple() {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/sales", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setSales(data.data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({ title: "Error", description: "Failed to load sales", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sale?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/sales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setSales(sales.filter(s => s.id !== id));
      toast({ title: "Success", description: "Sale deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/sales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSales(sales.map(s =>
          s.id === id ? { ...s, status: newStatus } : s
        ));
        toast({ title: "Success", description: `Status changed to ${newStatus}` });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredSales = sales.filter(s =>
    s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Sales List" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Sales</CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Sale
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by invoice or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : filteredSales.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No sales found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map(sale => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono">{sale.invoiceNo}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>₹{sale.total.toLocaleString()}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select value={sale.status} onValueChange={(newStatus) => handleStatusChange(sale.id, newStatus)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sale.id)}
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
