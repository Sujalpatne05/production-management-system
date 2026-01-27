import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QCTemplateNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [parameters, setParameters] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name,
        description,
        type: category || "incoming",
        parameters: parameters
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/qc/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save template");
      navigate("/dashboard/qc/templates");
    } catch (err) {
      console.error(err);
      alert("Could not save template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New QC Template</h2>
          <p className="text-gray-600">Define a reusable inspection checklist</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" placeholder="Incoming QC - Electronics" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="inprocess">In-Process</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Short description of when to use this template" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parameters">Check Parameters</Label>
            <Textarea
              id="parameters"
              placeholder="One check per line, e.g. voltage: must be 5V ± 0.1"
              rows={6}
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
