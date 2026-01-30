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

export function PdfInvoicesPOs() {
  const [params, setParams] = useSearchParams();
  const [saleId, setSaleId] = useState<string>(params.get("saleId") || "");
  const [purchaseId, setPurchaseId] = useState<string>(params.get("purchaseId") || "");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const hasQuery = useMemo(() => !!(saleId || purchaseId), [saleId, purchaseId]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (saleId) next.set("saleId", saleId);
    if (purchaseId) next.set("purchaseId", purchaseId);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleId, purchaseId]);

  const previewInvoice = async () => {
    if (!saleId) return;
    setLoading(true);
    try {
      const html = await fetchHtml(`${API_BASE}/invoice/${encodeURIComponent(saleId)}`);
      setHtml(html);
    } catch (e) {
      alert("Could not load invoice");
    } finally {
      setLoading(false);
    }
  };

  const previewPO = async () => {
    if (!purchaseId) return;
    setLoading(true);
    try {
      const html = await fetchHtml(`${API_BASE}/purchase-order/${encodeURIComponent(purchaseId)}`);
      setHtml(html);
    } catch (e) {
      alert("Could not load purchase order");
    } finally {
      setLoading(false);
    }
  };

  const openNew = (url: string) => window.open(url, "_blank");

  return (
    <PdfBase title="PDF Center: Invoices & POs">
      <Card>
        <CardHeader>
          <CardTitle>Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="saleId">Sales Invoice ID</Label>
              <div className="flex gap-2">
                <Input id="saleId" placeholder="SALE_ID" value={saleId} onChange={(e) => setSaleId(e.target.value)} />
                <Button disabled={!saleId || loading} onClick={previewInvoice}>Preview</Button>
                <Button variant="outline" disabled={!saleId} onClick={() => openNew(`${API_BASE}/invoice/${encodeURIComponent(saleId)}`)}>Open</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseId">Purchase Order ID</Label>
              <div className="flex gap-2">
                <Input id="purchaseId" placeholder="PURCHASE_ID" value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)} />
                <Button disabled={!purchaseId || loading} onClick={previewPO}>Preview</Button>
                <Button variant="outline" disabled={!purchaseId} onClick={() => openNew(`${API_BASE}/purchase-order/${encodeURIComponent(purchaseId)}`)}>Open</Button>
              </div>
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
