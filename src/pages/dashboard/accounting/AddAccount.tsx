import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const AddAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addAccount } = useStore();
  const [form, setForm] = useState({
    name: "",
    type: "bank" as "bank" | "cash" | "mobile",
    balance: "",
    accountNumber: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast({ title: "Error", description: "Account name is required", variant: "destructive" });
      return;
    }

    addAccount({
      name: form.name,
      type: form.type,
      balance: Number(form.balance) || 0,
      accountNumber: form.accountNumber,
    });

    toast({ title: "Success", description: "Account added successfully" });
    navigate("/dashboard/accounting/accounts");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Account Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter account name" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Account Type</Label>
                <Select value={form.type} onValueChange={(v: "bank" | "cash" | "mobile") => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mobile">Mobile Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Account Number</Label>
                <Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="Enter account number" />
              </div>
            </div>
            <div>
              <Label>Opening Balance</Label>
              <Input type="number" min="0" step="0.01" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} placeholder="0.00" />
            </div>
            <Button type="submit" className="w-full">Save Account</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAccount;
