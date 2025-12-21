import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

const AddRMWaste = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rawMaterials, addRMWaste, updateRawMaterial } = useStore();
  
  const [rawMaterialId, setRawMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rawMaterialId || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const material = rawMaterials.find(m => m.id === rawMaterialId);
    if (!material) return;

    const wasteQty = parseFloat(quantity);
    if (wasteQty > material.stock) {
      toast({
        title: "Error",
        description: "Waste quantity cannot exceed available stock",
        variant: "destructive",
      });
      return;
    }

    addRMWaste({
      rawMaterialId,
      quantity: wasteQty,
      date,
      reason,
    });

    // Update stock
    updateRawMaterial(rawMaterialId, { stock: material.stock - wasteQty });

    toast({
      title: "RM Waste Recorded",
      description: "Raw material waste has been recorded successfully.",
    });

    navigate("/dashboard/rm-wastes/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add RM Waste</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Waste Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="rawMaterial">Raw Material *</Label>
              <Select value={rawMaterialId} onValueChange={setRawMaterialId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select raw material" />
                </SelectTrigger>
                <SelectContent>
                  {rawMaterials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} (Stock: {material.stock} {material.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for waste"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Record Waste</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/rm-wastes/list")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRMWaste;