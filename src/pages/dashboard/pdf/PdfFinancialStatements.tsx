import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PdfBase } from "./PdfBase";
import { PdfViewer } from "./PdfViewer";
import { useSearchParams } from "react-router-dom";

const API_BASE = "/api/pdf";

type StatementType = "trial-balance" | "balance-sheet" | "profit-loss";

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return await res.text();
}

export function PdfFinancialStatements() {
  const [params, setParams] = useSearchParams();
  const [type, setType] = useState<StatementType>((params.get("type") as StatementType) || "trial-balance");
  const [tenantId, setTenantId] = useState<string>(params.get("tenantId") || "default");
  const [from, setFrom] = useState<string>(params.get("from") || "");
  const [to, setTo] = useState<string>(params.get("to") || "");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const hasRange = useMemo(() => !!(from && to), [from, to]);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("type", type);
    if (tenantId) next.set("tenantId", tenantId);
    if (from) next.set("from", from);
    if (to) next.set("to", to);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, tenantId, from, to]);

  const preview = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/financial-statement`, window.location.origin);
      url.searchParams.set("type", type);
      url.searchParams.set("tenantId", tenantId || "default");
      if (from) url.searchParams.set("startDate", from);
      if (to) url.searchParams.set("endDate", to);
      const html = await fetchHtml(url.toString().replace(window.location.origin, ""));
      setHtml(html);
    } catch (e) {
      alert("Could not load financial statement");
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    const url = new URL(`${API_BASE}/financial-statement`, window.location.origin);
    url.searchParams.set("type", type);
    url.searchParams.set("tenantId", tenantId || "default");
    if (from) url.searchParams.set("startDate", from);
    if (to) url.searchParams.set("endDate", to);
    window.open(url.toString().replace(window.location.origin, ""), "_blank");
  };

  return (
    <PdfBase title="PDF Center: Financial Statements">
      <Card>
        <CardHeader>
          <CardTitle>Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Select value={type} onValueChange={(v) => setType(v as StatementType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statement Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial-balance">Trial Balance</SelectItem>
                  <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
                  <SelectItem value="profit-loss">Income Statement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <input className="hidden" />
            <div className="md:col-span-3 flex gap-2 justify-end">
              <Button disabled={loading} onClick={preview}>Preview</Button>
              <Button variant="outline" onClick={openNew}>Open</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {(hasRange || html) && (
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
