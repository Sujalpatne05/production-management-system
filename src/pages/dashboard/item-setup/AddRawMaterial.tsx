import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddRawMaterial = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rmCategories, units, addRawMaterial } = useStore();
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    sku: "",
    price: "",
    stock: "0",
    unit: "pcs",
    minStock: "10"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    addRawMaterial({
      name: form.name,
      categoryId: form.categoryId,
      sku: form.sku || `RM-${String(Date.now()).slice(-6)}`,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      unit: form.unit,
      minStock: Number(form.minStock) || 10,
    });

    toast({ title: "Success", description: "Raw material added successfully" });
    navigate("/dashboard/item-setup/raw-materials");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Raw Material</h1>
      <Card>
        <CardHeader>
          <CardTitle>Material Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Material name" />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {rmCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Auto-generated if empty" />
              </div>
              <div>
                <Label>Unit Price</Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {units.length > 0 ? units.map(u => <SelectItem key={u.id} value={u.shortName}>{u.name}</SelectItem>) : (
                      <>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="meter">Meters</SelectItem>
                        <SelectItem value="liter">Liters</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Opening Stock</Label>
                <Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div>
                <Label>Minimum Stock Alert</Label>
                <Input type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              </div>
            </div>
            <Button type="submit" className="w-full">Save Raw Material</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRawMaterial;
