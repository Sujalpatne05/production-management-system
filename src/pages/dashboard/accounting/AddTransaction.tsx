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

const AddTransaction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { accounts, addTransaction, updateAccount } = useStore();
  const [form, setForm] = useState({
    accountId: "",
    type: "deposit" as "deposit" | "withdraw",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accountId || !form.amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const account = accounts.find(a => a.id === form.accountId);
    if (!account) return;

    const amount = Number(form.amount);
    if (form.type === "withdraw" && amount > account.balance) {
      toast({ title: "Error", description: "Insufficient balance", variant: "destructive" });
      return;
    }

    addTransaction({
      accountId: form.accountId,
      type: form.type,
      amount,
      date: form.date,
      description: form.description,
    });

    const newBalance = form.type === "deposit" 
      ? account.balance + amount 
      : account.balance - amount;
    updateAccount(form.accountId, { balance: newBalance });

    toast({ title: "Success", description: "Transaction recorded successfully" });
    navigate("/dashboard/accounting/transactions");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Deposit/Withdraw</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Account *</Label>
                <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name} (₹{a.balance.toFixed(2)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select value={form.type} onValueChange={(v: "deposit" | "withdraw") => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdraw">Withdraw</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Transaction description" />
            </div>
            <Button type="submit" className="w-full">Save Transaction</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransaction;
