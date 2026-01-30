import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Template = { id: string; name: string };

export function QCInspectionNew() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [inspectionDate, setInspectionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [batchNo, setBatchNo] = useState("");
  const [passedQty, setPassedQty] = useState("0");
  const [rejectedQty, setRejectedQty] = useState("0");
  const [resultStatus, setResultStatus] = useState("passed");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/api/qc/templates");
        if (!res.ok) throw new Error("Failed to load templates");
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setTemplateId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTemplates();
  }, []);

  const onSave = async () => {
    try {
      if (!templateId) {
        alert("Select a template");
        return;
      }
      setSaving(true);
      const payload = {
        templateId,
        batchNo: batchNo || undefined,
        passedQuantity: Number(passedQty) || 0,
        rejectedQuantity: Number(rejectedQty) || 0,
        defectNotes: notes || undefined,
        results: {
          overall: { passed: resultStatus === "passed", note: notes },
        },
      };
      const res = await fetch("/api/qc/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save inspection");
      navigate("/dashboard/qc/inspections");
    } catch (err) {
      console.error(err);
      alert("Could not save inspection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Inspection</h2>
          <p className="text-gray-600">Create a quality inspection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save Inspection"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((tpl) => (
                    <SelectItem key={tpl.id} value={tpl.id}>{tpl.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchNo">Batch / Reference</Label>
              <Input id="batchNo" placeholder="Batch or PO" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Result</Label>
              <Select value={resultStatus} onValueChange={setResultStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passed">Passed Qty</Label>
              <Input id="passed" type="number" min="0" value={passedQty} onChange={(e) => setPassedQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejected">Rejected Qty</Label>
              <Input id="rejected" type="number" min="0" value={rejectedQty} onChange={(e) => setRejectedQty(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Findings</Label>
            <Textarea
              id="notes"
              placeholder="Record observations, measurements, and results"
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
