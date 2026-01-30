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

const AddProductWaste = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addProductWaste, updateProduct } = useStore();
  
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const wasteQty = parseInt(quantity);
    if (wasteQty > product.stock) {
      toast({
        title: "Error",
        description: "Waste quantity cannot exceed available stock",
        variant: "destructive",
      });
      return;
    }

    addProductWaste({
      productId,
      quantity: wasteQty,
      date,
      reason,
    });

    // Update stock
    updateProduct(productId, { stock: product.stock - wasteQty });

    toast({
      title: "Product Waste Recorded",
      description: "Product waste has been recorded successfully.",
    });

    navigate("/dashboard/product-wastes/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Product Waste</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Waste Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock} {product.unit})
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
                min="1"
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
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/product-wastes/list")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductWaste;