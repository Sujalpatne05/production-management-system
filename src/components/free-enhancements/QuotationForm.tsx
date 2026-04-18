import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function QuotationForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    customerId: "",
    items: [],
    total: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sales/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Quotation created successfully"
        });
        setFormData({ customer: "", customerId: "", items: [], total: 0 });
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quotation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Quotation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Customer Name"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            required
          />
          <Input
            placeholder="Total Amount"
            type="number"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) })}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Quotation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
