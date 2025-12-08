import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddSupplierPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { suppliers, addSupplierPayment, updateSupplier } = useStore();
  const [form, setForm] = useState({
    supplierId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    reference: ""
  });

  const selectedSupplier = suppliers.find(s => s.id === form.supplierId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplierId || !form.amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const amount = Number(form.amount);
    addSupplierPayment({
      supplierId: form.supplierId,
      amount,
      date: form.date,
      paymentMethod: form.paymentMethod,
      reference: form.reference || `PAY-${String(Date.now()).slice(-6)}`,
    });

    if (selectedSupplier) {
      updateSupplier(form.supplierId, { balance: Math.max(0, selectedSupplier.balance - amount) });
    }

    toast({ title: "Success", description: "Payment recorded successfully" });
    navigate("/dashboard/supplier-payments/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Supplier Payment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Supplier *</Label>
              <Select value={form.supplierId} onValueChange={(v) => setForm({ ...form, supplierId: v })}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} (Due: ${s.balance.toFixed(2)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSupplier && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">Current Balance Due: <strong>${selectedSupplier.balance.toFixed(2)}</strong></p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Amount *</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reference</Label>
                <Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Payment reference" />
              </div>
            </div>
            <Button type="submit" className="w-full">Save Payment</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSupplierPayment;
