import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash2, Download } from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { quotations, customers, products, updateQuotation, deleteQuotation } = useStore();

  const order = quotations.find((q) => q.id === orderId);
  const customer = order ? customers.find((c) => c.id === order.customerId) : null;

  if (!order || !customer) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/orders/list")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Order not found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        deleteQuotation(order.id);
        toast({
          title: "Success",
          description: "Order deleted successfully",
        });
        navigate("/dashboard/orders/list");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    }
  };

  const handleAccept = () => {
    try {
      updateQuotation(order.id, { status: "accepted" });
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

  const handleReject = () => {
    try {
      updateQuotation(order.id, { status: "rejected" });
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

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/orders/list")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Print
          </Button>
          {order.status === "sent" && (
            <>
              <Button
                onClick={handleAccept}
                variant="default"
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                Accept Order
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                className="gap-2"
              >
                Reject Order
              </Button>
            </>
          )}
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order No</p>
                  <p className="font-semibold">{order.quotationNo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ₹{getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="font-semibold">{order.validUntil}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">{order.createdAt ? order.createdAt.split("T")[0] : "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => {
                      const product = products.find((p) => p.id === item.productId);
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {product?.name || "Unknown"}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information & Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-semibold">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold text-sm">{customer.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal:</p>
                <p className="font-semibold">₹{order.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <p>Total:</p>
                <p className="text-green-600">₹{order.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Number of Items:</p>
                <p>{order.items.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
