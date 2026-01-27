import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BudgetNew() {
  const navigate = useNavigate();
  const [budgetDate, setBudgetDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [totalAmount, setTotalAmount] = useState("0");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name: name || "Budget",
        budgetPeriod: period || "monthly",
        status: status || "draft",
        totalBudgetAmount: Number(totalAmount) || 0,
        startDate: budgetDate,
        description: description || undefined,
      };
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save budget");
      navigate("/dashboard/budget");
    } catch (err) {
      console.error(err);
      alert("Could not save budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Budget</h2>
          <p className="text-gray-600">Create a financial budget</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save Budget"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name</Label>
              <Input id="name" placeholder="Q1 2024 Operations" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={budgetDate} onChange={(e) => setBudgetDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Budget Amount</Label>
              <Input id="amount" type="number" min="0" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Budget purpose and notes"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
