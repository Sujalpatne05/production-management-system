import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  date: string;
  status: string;
}

export default function OrderListSimple() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/orders", {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o.id !== id));
      toast({ title: "Success", description: "Order deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(o =>
          o.id === id ? { ...o, status: newStatus } : o
        ));
        toast({ title: "Success", description: `Status changed to ${newStatus}` });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Orders" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Orders</CardTitle>
            <Button onClick={() => navigate("/dashboard/orders/add")} className="gap-2">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by order number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>₹{order.total.toLocaleString()}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
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
                          onClick={() => handleDelete(order.id)}
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
