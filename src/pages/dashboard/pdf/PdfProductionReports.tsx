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

export function PdfProductionReports() {
  const [params, setParams] = useSearchParams();
  const [productionId, setProductionId] = useState<string>(params.get("productionId") || "");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const hasQuery = useMemo(() => !!productionId, [productionId]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (productionId) next.set("productionId", productionId);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productionId]);

  const preview = async () => {
    if (!productionId) return;
    setLoading(true);
    try {
      const html = await fetchHtml(`${API_BASE}/production-report/${encodeURIComponent(productionId)}`);
      setHtml(html);
    } catch (e) {
      alert("Could not load production report");
    } finally {
      setLoading(false);
    }
  };

  const openNew = (url: string) => window.open(url, "_blank");

  return (
    <PdfBase title="PDF Center: Production Reports">
      <Card>
        <CardHeader>
          <CardTitle>Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="productionId">Production ID</Label>
            <div className="flex gap-2">
              <Input id="productionId" placeholder="PRODUCTION_ID" value={productionId} onChange={(e) => setProductionId(e.target.value)} />
              <Button disabled={!productionId || loading} onClick={preview}>Preview</Button>
              <Button variant="outline" disabled={!productionId} onClick={() => openNew(`${API_BASE}/production-report/${encodeURIComponent(productionId)}`)}>Open</Button>
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
