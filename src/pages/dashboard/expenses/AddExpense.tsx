import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddExpense = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { expenseCategories, addExpense } = useStore();
  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "Cash"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    addExpense({
      categoryId: form.categoryId,
      amount: Number(form.amount),
      date: form.date,
      description: form.description,
      paymentMethod: form.paymentMethod,
    });

    toast({ title: "Success", description: "Expense added successfully" });
    navigate("/dashboard/expenses/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Expense</h1>
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount *</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter expense description" />
            </div>
            <Button type="submit" className="w-full">Save Expense</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpense;
