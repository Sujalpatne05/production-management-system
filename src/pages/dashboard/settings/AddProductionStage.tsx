import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

const AddProductionStage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProductionStage, productionStages } = useStore();
  
  const [name, setName] = useState("");
  const [order, setOrder] = useState(String(productionStages.length + 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter stage name", variant: "destructive" });
      return;
    }
    addProductionStage({ name, order: parseInt(order) || 1 });
    toast({ title: "Stage Created", description: `Production stage "${name}" created.` });
    navigate("/dashboard/settings/stages");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Production Stage</h1>
      <Card>
        <CardHeader><CardTitle>Stage Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2"><Label htmlFor="name">Stage Name *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Assembly" required /></div>
            <div className="space-y-2"><Label htmlFor="order">Order</Label><Input id="order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} /></div>
            <div className="flex gap-4 pt-4">
              <Button type="submit">Create Stage</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/settings/stages")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductionStage;