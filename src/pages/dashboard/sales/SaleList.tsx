import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

const SaleList = () => {
  const navigate = useNavigate();
  const { sales, customers, products } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSale, setViewingSale] = useState<any>(null);

  const filteredSales = sales.filter((sale) => {
    const customer = customers.find(c => c.id === sale.customerId);
    return sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const cellClass = density === "compact" ? "py-2" : "py-3";

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Sale List"
        actions={(
          <Button onClick={() => navigate("/dashboard/sales/add")} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span>Add Sale</span>
          </Button>
        )}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
          <CardTitle className="text-base sm:text-lg">All Sales ({filteredSales.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
            <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
            </div>
            <div className="inline-flex rounded-md border p-1 w-full sm:w-auto">
              <Button variant={density === "comfortable" ? "default" : "ghost"} size="sm" onClick={() => setDensity("comfortable")}>Comfortable</Button>
              <Button variant={density === "compact" ? "default" : "ghost"} size="sm" onClick={() => setDensity("compact")}>Compact</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <Card key={sale.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-sm">{sale.invoiceNo}</div>
                        <div className="text-xs text-muted-foreground">{customer?.name || "N/A"}</div>
                      </div>
                      <StatusBadge status={sale.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <div className="font-medium">{sale.date}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <div className="font-medium">₹{sale.total.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Paid:</span>
                        <div className="font-medium">₹{sale.paid.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due:</span>
                        <div className="font-medium">₹{sale.due.toFixed(2)}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setViewingSale(sale)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Card>
                );
              })
            ) : (
              <EmptyState
                title="No sales found"
                description="Start by creating a new sale record."
                actionLabel="Add Sale"
                onAction={() => navigate("/dashboard/sales/add")}
              />
            )}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => {
                    const customer = customers.find(c => c.id === sale.customerId);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className={`font-medium ${cellClass}`}>{sale.invoiceNo}</TableCell>
                        <TableCell className={cellClass}>{customer?.name || "N/A"}</TableCell>
                        <TableCell className={cellClass}>{sale.date}</TableCell>
                        <TableCell className={cellClass}>₹{sale.total.toFixed(2)}</TableCell>
                        <TableCell className={cellClass}>₹{sale.paid.toFixed(2)}</TableCell>
                        <TableCell className={cellClass}>₹{sale.due.toFixed(2)}</TableCell>
                        <TableCell className={cellClass}><StatusBadge status={sale.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setViewingSale(sale)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <EmptyState
                        title="No sales found"
                        description="Start by creating a new sale record."
                        actionLabel="Add Sale"
                        onAction={() => navigate("/dashboard/sales/add")}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewingSale} onOpenChange={() => setViewingSale(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice: {viewingSale?.invoiceNo}</DialogTitle>
          </DialogHeader>
          {viewingSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{customers.find(c => c.id === viewingSale.customerId)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{viewingSale.date}</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewingSale.items.map((item: any, index: number) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <TableRow key={index}>
                        <TableCell>{product?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between"><span>Total:</span><span>₹{viewingSale.total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Paid:</span><span>₹{viewingSale.paid.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold"><span>Due:</span><span>₹{viewingSale.due.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SaleList;
