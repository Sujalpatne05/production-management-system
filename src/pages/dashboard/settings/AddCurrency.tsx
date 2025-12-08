import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

const AddCurrency = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCurrency } = useStore();
  
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [rate, setRate] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !symbol.trim()) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    addCurrency({ name, code, symbol, rate: parseFloat(rate) || 1 });
    toast({ title: "Currency Created", description: `Currency "${name}" created.` });
    navigate("/dashboard/settings/currencies");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Currency</h1>
      <Card>
        <CardHeader><CardTitle>Currency Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., US Dollar" required /></div>
            <div className="space-y-2"><Label htmlFor="code">Code *</Label><Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., USD" required /></div>
            <div className="space-y-2"><Label htmlFor="symbol">Symbol *</Label><Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g., $" required /></div>
            <div className="space-y-2"><Label htmlFor="rate">Exchange Rate</Label><Input id="rate" type="number" step="0.0001" value={rate} onChange={(e) => setRate(e.target.value)} /></div>
            <div className="flex gap-4 pt-4">
              <Button type="submit">Create Currency</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/settings/currencies")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCurrency;