import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Layers, Search, Download, AlertTriangle, TrendingUp, TrendingDown, Plus, Minus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const RawMaterialStock = () => {
  const { rawMaterials, rmCategories, updateRawMaterial, addStockAdjustment } = useStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<typeof rawMaterials[0] | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add");
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  const getCategoryName = (categoryId: string) => {
    return rmCategories.find(c => c.id === categoryId)?.name || "Unknown";
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < minStock) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const filteredMaterials = rawMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || material.categoryId === categoryFilter;
    const matchesStock = stockFilter === "all" ||
                        (stockFilter === "low" && material.stock < material.minStock && material.stock > 0) ||
                        (stockFilter === "out" && material.stock === 0) ||
                        (stockFilter === "in" && material.stock >= material.minStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalMaterials = rawMaterials.length;
  const totalStock = rawMaterials.reduce((sum, m) => sum + m.stock, 0);
  const lowStockCount = rawMaterials.filter(m => m.stock < m.minStock && m.stock > 0).length;
  const outOfStockCount = rawMaterials.filter(m => m.stock === 0).length;
  const totalValue = rawMaterials.reduce((sum, m) => sum + (m.stock * m.price), 0);

  const handleAdjustStock = (material: typeof rawMaterials[0], type: "add" | "subtract") => {
    setSelectedMaterial(material);
    setAdjustmentType(type);
    setAdjustmentQty("");
    setAdjustmentReason("");
    setAdjustDialogOpen(true);
  };

  const handleSaveAdjustment = () => {
    if (!selectedMaterial || !adjustmentQty) return;
    
    const qty = parseInt(adjustmentQty);
    if (isNaN(qty) || qty <= 0) {
      toast({ title: "Invalid quantity", variant: "destructive" });
      return;
    }

    const newStock = adjustmentType === "add" 
      ? selectedMaterial.stock + qty 
      : Math.max(0, selectedMaterial.stock - qty);

    updateRawMaterial(selectedMaterial.id, { stock: newStock });
    
    addStockAdjustment({
      rawMaterialId: selectedMaterial.id,
      type: adjustmentType,
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      reason: adjustmentReason || (adjustmentType === "add" ? "Stock addition" : "Stock removal"),
    });
    
    toast({
      title: "Stock Updated",
      description: `${selectedMaterial.name} stock ${adjustmentType === "add" ? "increased" : "decreased"} by ${qty}. New stock: ${newStock}`,
    });
    
    setAdjustDialogOpen(false);
  };

  const handleExport = () => {
    const headers = ["SKU", "Material Name", "Category", "Stock", "Min Stock", "Unit", "Price", "Value", "Status"];
    const csvData = filteredMaterials.map(m => [
      m.sku,
      m.name,
      getCategoryName(m.categoryId),
      m.stock.toString(),
      m.minStock.toString(),
      m.unit,
      m.price.toFixed(2),
      (m.stock * m.price).toFixed(2),
      getStockStatus(m.stock, m.minStock).label
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raw-material-stock-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({ title: "Export complete", description: "Raw material stock data exported successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raw Material Stock</h1>
          <p className="text-muted-foreground">Manage and track raw material inventory levels</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Materials</p>
                <p className="text-2xl font-bold">{totalMaterials}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Layers className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Stock List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {rmCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Min Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => {
                    const status = getStockStatus(material.stock, material.minStock);
                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-mono text-sm">{material.sku}</TableCell>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>{getCategoryName(material.categoryId)}</TableCell>
                        <TableCell className="text-right font-medium">{material.stock}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{material.minStock}</TableCell>
                        <TableCell>{material.unit}</TableCell>
                        <TableCell className="text-right">${material.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${(material.stock * material.price).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleAdjustStock(material, "add")}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleAdjustStock(material, "subtract")}
                              disabled={material.stock === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No raw materials found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Showing {filteredMaterials.length} of {rawMaterials.length} materials</p>
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === "add" ? "Add Stock" : "Remove Stock"}
            </DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedMaterial.name}</p>
                <p className="text-sm text-muted-foreground">Current Stock: {selectedMaterial.stock} {selectedMaterial.unit}</p>
                <p className="text-sm text-muted-foreground">Min Stock: {selectedMaterial.minStock} {selectedMaterial.unit}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input
                  id="reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g., New shipment, Damaged items, Production use"
                />
              </div>

              {adjustmentQty && !isNaN(parseInt(adjustmentQty)) && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm">
                    New Stock: <span className="font-bold">
                      {adjustmentType === "add" 
                        ? selectedMaterial.stock + parseInt(adjustmentQty)
                        : Math.max(0, selectedMaterial.stock - parseInt(adjustmentQty))}
                    </span> {selectedMaterial.unit}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdjustment}>
              {adjustmentType === "add" ? "Add Stock" : "Remove Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RawMaterialStock;
