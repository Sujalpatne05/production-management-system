import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ForecastNew() {
  const navigate = useNavigate();
  const [forecastDate, setForecastDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [method, setMethod] = useState("manual");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      const start = startMonth || forecastDate;
      const end = endMonth || new Date(new Date(start).setMonth(new Date(start).getMonth() + 1)).toISOString().slice(0, 10);
      
      const payload = {
        name: name || "Forecast",
        method: method || "manual",
        startDate: start,
        endDate: end,
        description: description || undefined,
      };
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save forecast");
      navigate("/dashboard/forecast");
    } catch (err) {
      console.error(err);
      alert("Could not save forecast");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Forecast</h2>
          <p className="text-gray-600">Create a demand forecast</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save Forecast"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Forecast Name</Label>
              <Input id="name" placeholder="Q1 2024 Demand" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="trend">Trend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Month</Label>
              <Input
                type="date"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Month</Label>
              <Input
                type="date"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Forecast assumptions and notes"
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
