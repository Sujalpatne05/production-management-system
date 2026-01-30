import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Plus, Search, Download } from "lucide-react";

const ProductWasteList = () => {
  const navigate = useNavigate();
  const { productWastes, products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const getProductName = (id: string) => {
    const product = products.find(p => p.id === id);
    return product?.name || "Unknown";
  };

  const getProductUnit = (id: string) => {
    const product = products.find(p => p.id === id);
    return product?.unit || "";
  };

  const filteredWastes = productWastes.filter(waste => {
    const productName = getProductName(waste.productId);
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           waste.reason.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const exportToCSV = () => {
    const headers = ["Date", "Product", "Quantity", "Unit", "Reason"];
    const rows = productWastes.map(w => [
      w.date,
      getProductName(w.productId),
      w.quantity,
      getProductUnit(w.productId),
      w.reason
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-wastes.csv";
    a.click();
  };

  const totalWasteValue = productWastes.reduce((sum, waste) => {
    const product = products.find(p => p.id === waste.productId);
    return sum + (waste.quantity * (product?.cost || 0));
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Wastes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/product-wastes/add")}>
            <Plus className="h-4 w-4 mr-2" /> Add Product Waste
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{productWastes.length}</div>
            <p className="text-sm text-muted-foreground">Total Waste Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">₹{totalWasteValue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Waste Value (Cost)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wastes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWastes.map((waste) => {
                const product = products.find(p => p.id === waste.productId);
                return (
                  <TableRow key={waste.id}>
                    <TableCell>{waste.date}</TableCell>
                    <TableCell className="font-medium">{getProductName(waste.productId)}</TableCell>
                    <TableCell>{waste.quantity} {getProductUnit(waste.productId)}</TableCell>
                    <TableCell className="text-destructive">
                      ₹{(waste.quantity * (product?.cost || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>{waste.reason || "-"}</TableCell>
                  </TableRow>
                );
              })}
              {filteredWastes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No waste records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductWasteList;