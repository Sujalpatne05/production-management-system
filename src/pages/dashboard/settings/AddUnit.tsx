import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

const AddUnit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addUnit } = useStore();
  
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !shortName.trim()) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    addUnit({ name, shortName });
    toast({ title: "Unit Created", description: `Unit "${name}" created.` });
    navigate("/dashboard/settings/units");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Unit</h1>
      <Card>
        <CardHeader><CardTitle>Unit Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Kilogram" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input id="shortName" value={shortName} onChange={(e) => setShortName(e.target.value)} placeholder="e.g., kg" required />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit">Create Unit</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/settings/units")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUnit;