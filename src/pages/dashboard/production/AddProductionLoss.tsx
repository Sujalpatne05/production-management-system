import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const productionLossSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  lossType: z.string().min(1, "Please select a loss type"),
  date: z.string().min(1, "Date is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  notes: z.string().optional(),
});

type ProductionLossFormData = z.infer<typeof productionLossSchema>;

const AddProductionLoss = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { products, addProductionLoss } = useStore();

  const form = useForm<ProductionLossFormData>({
    resolver: zodResolver(productionLossSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      lossType: "damage",
      date: new Date().toISOString().split("T")[0],
      reason: "",
      notes: "",
    },
  });

  const handleSubmit = (data: ProductionLossFormData) => {
    const product = products.find((p) => p.id === data.productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    try {
      addProductionLoss({
        productId: data.productId,
        productName: product.name,
        quantity: data.quantity,
        lossType: data.lossType as "damage" | "defect" | "expiry" | "spillage" | "theft" | "other",
        date: data.date,
        reason: data.reason,
        notes: data.notes || "",
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Production loss recorded successfully",
      });
      navigate("/dashboard/production/loss-list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record production loss",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Production Loss</h1>

      <Card>
        <CardHeader>
          <CardTitle>Production Loss Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Lost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lossType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loss Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select loss type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="damage">Damage</SelectItem>
                          <SelectItem value="defect">Defect</SelectItem>
                          <SelectItem value="expiry">Expiry</SelectItem>
                          <SelectItem value="spillage">Spillage</SelectItem>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter reason for loss"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter additional notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit">Save Production Loss</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/production/loss-list")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductionLoss;
