import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PdfBase } from "./PdfBase";
import { PdfViewer } from "./PdfViewer";
import { useSearchParams } from "react-router-dom";

const API_BASE = "/api/pdf";

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return await res.text();
}

export function PdfDeliveryChallan() {
  const [params, setParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string>(params.get("orderId") || "");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const hasQuery = useMemo(() => !!orderId, [orderId]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (orderId) next.set("orderId", orderId);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const preview = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const html = await fetchHtml(`${API_BASE}/delivery-challan/${encodeURIComponent(orderId)}`);
      setHtml(html);
    } catch (e) {
      alert("Could not load delivery challan");
    } finally {
      setLoading(false);
    }
  };

  const openNew = (url: string) => window.open(url, "_blank");

  return (
    <PdfBase title="PDF Center: Delivery & Challan">
      <Card>
        <CardHeader>
          <CardTitle>Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <div className="flex gap-2">
              <Input id="orderId" placeholder="ORDER_ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              <Button disabled={!orderId || loading} onClick={preview}>Preview</Button>
              <Button variant="outline" disabled={!orderId} onClick={() => openNew(`${API_BASE}/delivery-challan/${encodeURIComponent(orderId)}`)}>Open</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasQuery && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <div>Loading...</div> : <PdfViewer html={html} />}
          </CardContent>
        </Card>
      )}
    </PdfBase>
  );
}
