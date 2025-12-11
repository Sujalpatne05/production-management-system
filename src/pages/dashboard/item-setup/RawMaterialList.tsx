import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Download, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const RawMaterialList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rawMaterials, rmCategories, updateRawMaterial, deleteRawMaterial } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", categoryId: "", price: 0, stock: 0, minStock: 0 });

  const filteredMaterials = rawMaterials.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (id: string) => rmCategories.find(c => c.id === id)?.name || "Unknown";
  const lowStockCount = rawMaterials.filter(m => m.stock <= m.minStock).length;

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setEditForm({ name: material.name, categoryId: material.categoryId, price: material.price, stock: material.stock, minStock: material.minStock });
  };

  const handleSaveEdit = () => {
    if (editingMaterial) {
      updateRawMaterial(editingMaterial.id, editForm);
      toast({ title: "Success", description: "Material updated successfully" });
      setEditingMaterial(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteRawMaterial(id);
    toast({ title: "Success", description: "Material deleted successfully" });
  };

  const handleExport = () => {
    const csv = [
      ["Name", "SKU", "Category", "Price", "Stock", "Unit", "Min Stock"],
      ...filteredMaterials.map(m => [m.name, m.sku, getCategoryName(m.categoryId), m.price, m.stock, m.unit, m.minStock])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raw-materials.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Raw Materials</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/item-setup/add-raw-material")} className="gap-2">
            <Plus className="w-4 h-4" /> Add Material
          </Button>
        </div>
      </div>

      {lowStockCount > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">{lowStockCount} items are low on stock</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Consider reordering soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Materials ({filteredMaterials.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.sku}</TableCell>
                      <TableCell>{getCategoryName(material.categoryId)}</TableCell>
                      <TableCell>₹{material.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={material.stock <= material.minStock ? "text-red-600 font-semibold" : ""}>
                          {material.stock} {material.unit}
                        </span>
                        {material.stock <= material.minStock && (
                          <Badge variant="destructive" className="ml-2">Low</Badge>
                        )}
                      </TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(material)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Material</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(material.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No materials found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Raw Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={editForm.categoryId} onValueChange={(v) => setEditForm({ ...editForm, categoryId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {rmCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price</Label>
                <Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Min Stock</Label>
                <Input type="number" value={editForm.minStock} onChange={(e) => setEditForm({ ...editForm, minStock: Number(e.target.value) })} />
              </div>
            </div>
            <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RawMaterialList;
