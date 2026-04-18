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
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus } from "lucide-react";

interface PurchaseOrder {
  id: string;
  invoiceNo: string;
  supplier: string;
  total: number;
  date: string;
  status: string;
}

export default function PurchaseOrdersSimple() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/purchases", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({ title: "Error", description: "Failed to load orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Orders</CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Order
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
            <p className="text-center py-8">Loading...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.invoiceNo}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>₹{order.total.toLocaleString()}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge>{order.status}</Badge>
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
