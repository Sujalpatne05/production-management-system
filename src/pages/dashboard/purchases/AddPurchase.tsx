import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const AddPurchase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { suppliers, rawMaterials, addPurchase } = useStore();
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<{ rawMaterialId: string; quantity: number; price: number }[]>([
    { rawMaterialId: "", quantity: 1, price: 0 }
  ]);
  const [paid, setPaid] = useState(0);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const due = total - paid;

  const addItem = () => {
    setItems([...items, { rawMaterialId: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === "rawMaterialId") {
      newItems[index].rawMaterialId = value as string;
      const material = rawMaterials.find(m => m.id === value);
      if (material) {
        newItems[index].price = material.price;
      }
    } else if (field === "quantity") {
      newItems[index].quantity = Number(value);
    } else if (field === "price") {
      newItems[index].price = Number(value);
    }
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.some(item => !item.rawMaterialId)) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const invoiceNo = `PUR-${String(Date.now()).slice(-6)}`;
    const status = paid >= total ? "paid" : paid > 0 ? "partial" : "unpaid";

    addPurchase({
      invoiceNo,
      supplierId,
      items,
      total,
      paid,
      due,
      date: new Date().toISOString().split("T")[0],
      status,
    });

    toast({ title: "Success", description: "Purchase added successfully" });
    navigate("/dashboard/purchases/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Purchase</h1>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                  <div className="col-span-5">
                    <Label>Raw Material</Label>
                    <Select value={item.rawMaterialId} onValueChange={(v) => updateItem(index, "rawMaterialId", v)}>
                      <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                      <SelectContent>
                        {rawMaterials.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label>Price</Label>
                    <Input type="number" min="0" step="0.01" value={item.price} onChange={(e) => updateItem(index, "price", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label>Subtotal</Label>
                    <Input value={(item.quantity * item.price).toFixed(2)} disabled />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={items.length === 1}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Total</Label>
                <Input value={total.toFixed(2)} disabled />
              </div>
              <div>
                <Label>Paid Amount</Label>
                <Input type="number" min="0" max={total} step="0.01" value={paid} onChange={(e) => setPaid(Number(e.target.value))} />
              </div>
              <div>
                <Label>Due Amount</Label>
                <Input value={due.toFixed(2)} disabled />
              </div>
            </div>

            <Button type="submit" className="w-full">Save Purchase</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPurchase;
