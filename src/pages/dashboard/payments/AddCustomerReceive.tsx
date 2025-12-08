import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddCustomerReceive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, addCustomerReceive, updateCustomer } = useStore();
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    reference: ""
  });

  const selectedCustomer = customers.find(c => c.id === form.customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId || !form.amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const amount = Number(form.amount);
    addCustomerReceive({
      customerId: form.customerId,
      amount,
      date: form.date,
      paymentMethod: form.paymentMethod,
      reference: form.reference || `REC-${String(Date.now()).slice(-6)}`,
    });

    if (selectedCustomer) {
      updateCustomer(form.customerId, { balance: Math.max(0, selectedCustomer.balance - amount) });
    }

    toast({ title: "Success", description: "Payment received successfully" });
    navigate("/dashboard/customer-receives/list");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Customer Receive</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Customer *</Label>
              <Select value={form.customerId} onValueChange={(v) => setForm({ ...form, customerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} (Due: ${c.balance.toFixed(2)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCustomer && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">Current Balance Due: <strong>${selectedCustomer.balance.toFixed(2)}</strong></p>
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

export default AddCustomerReceive;
