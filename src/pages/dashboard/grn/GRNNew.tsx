import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GRNNew() {
  const navigate = useNavigate();
  const [grnDate, setGrnDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [supplier, setSupplier] = useState("");
  const [totalQty, setTotalQty] = useState("0");
  const [acceptedQty, setAcceptedQty] = useState("0");
  const [rejectedQty, setRejectedQty] = useState("0");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      const payload = {
        purchaseOrderNo: purchaseOrder || "PO-AUTO",
        receivedDate: grnDate,
        totalQuantity: Number(totalQty) || 0,
        acceptedQuantity: Number(acceptedQty) || 0,
        rejectedQuantity: Number(rejectedQty) || 0,
        status: status || "pending",
        remarks: notes || undefined,
      };
      const res = await fetch("/api/grn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save GRN");
      navigate("/dashboard/grn");
    } catch (err) {
      console.error(err);
      alert("Could not save GRN");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New GRN</h2>
          <p className="text-gray-600">Create a goods receipt note</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save GRN"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GRN Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po">Purchase Order</Label>
              <Input id="po" placeholder="PO-001" value={purchaseOrder} onChange={(e) => setPurchaseOrder(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" placeholder="Supplier name" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={grnDate} onChange={(e) => setGrnDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalQty">Total Received Qty</Label>
              <Input id="totalQty" type="number" min="0" value={totalQty} onChange={(e) => setTotalQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptedQty">Accepted Qty</Label>
              <Input id="acceptedQty" type="number" min="0" value={acceptedQty} onChange={(e) => setAcceptedQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejectedQty">Rejected Qty</Label>
              <Input id="rejectedQty" type="number" min="0" value={rejectedQty} onChange={(e) => setRejectedQty(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Remarks</Label>
            <Textarea
              id="notes"
              placeholder="Notes about the receipt"
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
