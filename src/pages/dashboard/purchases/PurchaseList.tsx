import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PurchaseList = () => {
  const navigate = useNavigate();
  const { purchases, suppliers, rawMaterials } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suppliers.find(s => s.id === purchase.supplierId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || "Unknown";
  const getMaterialName = (id: string) => rawMaterials.find(m => m.id === id)?.name || "Unknown";

  const handleExport = () => {
    const csv = [
      ["Invoice No", "Supplier", "Total", "Paid", "Due", "Status", "Date"],
      ...filteredPurchases.map(p => [p.invoiceNo, getSupplierName(p.supplierId), p.total, p.paid, p.due, p.status, p.date])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchases.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/purchases/add")} className="gap-2">
            <Plus className="w-4 h-4" /> Add Purchase
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Purchases ({filteredPurchases.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search purchases..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.invoiceNo}</TableCell>
                      <TableCell>{getSupplierName(purchase.supplierId)}</TableCell>
                      <TableCell>${purchase.total.toFixed(2)}</TableCell>
                      <TableCell>${purchase.paid.toFixed(2)}</TableCell>
                      <TableCell>${purchase.due.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={purchase.status === "paid" ? "default" : purchase.status === "partial" ? "secondary" : "destructive"}>
                          {purchase.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPurchase(purchase)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No purchases found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Details - {selectedPurchase?.invoiceNo}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Supplier:</strong> {getSupplierName(selectedPurchase.supplierId)}</div>
                <div><strong>Date:</strong> {selectedPurchase.date}</div>
                <div><strong>Status:</strong> <Badge>{selectedPurchase.status}</Badge></div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPurchase.items.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{getMaterialName(item.rawMaterialId)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="grid grid-cols-3 gap-4 text-right">
                <div><strong>Total:</strong> ${selectedPurchase.total.toFixed(2)}</div>
                <div><strong>Paid:</strong> ${selectedPurchase.paid.toFixed(2)}</div>
                <div><strong>Due:</strong> ${selectedPurchase.due.toFixed(2)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseList;
