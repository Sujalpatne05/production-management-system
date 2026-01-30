import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

const OrderList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { quotations, customers, products, deleteQuotation, updateQuotation } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "sent" | "accepted" | "rejected">("all");
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  // Filter quotations to only show orders (those with status other than just draft)
  const orders = quotations.filter((q) => q.status !== "draft");

  const filteredOrders = orders.filter((order) => {
    const customer = customers.find((c) => c.id === order.customerId);
    const customerName = customer?.name || "Unknown";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.quotationNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (id: string) => {
    navigate(`/dashboard/orders/${id}`);
  };

  const handleAcceptOrder = (id: string) => {
    try {
      updateQuotation(id, { status: "accepted" });
      toast({
        title: "Success",
        description: "Order accepted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept order",
        variant: "destructive",
      });
    }
  };

  const handleRejectOrder = (id: string) => {
    try {
      updateQuotation(id, { status: "rejected" });
      toast({
        title: "Success",
        description: "Order rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject order",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        deleteQuotation(id);
        toast({
          title: "Success",
          description: "Order deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = () => {
    const csv = [
      ["Order No", "Customer", "Total Amount", "Status", "Delivery Date", "Created Date"].join(","),
      ...filteredOrders.map((order) => {
        const customer = customers.find((c) => c.id === order.customerId);
        return [
          order.quotationNo,
          customer?.name || "Unknown",
          order.total.toFixed(2),
          order.status,
          order.validUntil,
          order.createdAt || "N/A",
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  const stats = {
    total: filteredOrders.length,
    sent: filteredOrders.filter((o) => o.status === "sent").length,
    accepted: filteredOrders.filter((o) => o.status === "accepted").length,
    rejected: filteredOrders.filter((o) => o.status === "rejected").length,
    totalValue: filteredOrders.reduce((sum, o) => sum + o.total, 0),
  };

  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const cellClass = density === "compact" ? "py-2" : "py-3";

  return (
    <div className="space-y-6">
        <PageHeader
          title="Orders"
          actions={(
            <>
              <Button onClick={() => navigate("/dashboard/orders/add")} className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Order</span>
                <span className="sm:hidden">Add</span>
              </Button>
              {filteredOrders.length > 0 && (
                <Button onClick={handleExport} variant="outline" className="gap-2 w-full sm:w-auto">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}
            </>
          )}
        />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{stats.totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Search Order / Customer</label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Status</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
          <CardTitle>Order Records</CardTitle>
          <div className="inline-flex rounded-md border p-1 w-full sm:w-auto">
            <Button variant={density === "comfortable" ? "default" : "ghost"} size="sm" onClick={() => setDensity("comfortable")}>Comfortable</Button>
            <Button variant={density === "compact" ? "default" : "ghost"} size="sm" onClick={() => setDensity("compact")}>Compact</Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found.</p>
              <Button
                onClick={() => navigate("/dashboard/orders/add")}
                className="mt-4"
              >
                Create First Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Order No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const customer = customers.find((c) => c.id === order.customerId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className={`font-medium ${cellClass}`}>{order.quotationNo}</TableCell>
                        <TableCell className={cellClass}>{customer?.name || "Unknown"}</TableCell>
                        <TableCell className={cellClass}>{order.items.length} items</TableCell>
                        <TableCell className={`font-semibold ${cellClass}`}>₹{order.total.toFixed(2)}</TableCell>
                        <TableCell className={cellClass}>{order.validUntil}</TableCell>
                        <TableCell className={cellClass}>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className={`text-right ${cellClass}`}>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id)} title="View order details">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            {order.status === "sent" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleAcceptOrder(order.id)} title="Accept order" className="text-green-600 hover:bg-green-100">✓</Button>
                                <Button variant="ghost" size="sm" onClick={() => handleRejectOrder(order.id)} title="Reject order" className="text-red-600 hover:bg-red-100">✗</Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(order.id)} title="Delete order">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;
