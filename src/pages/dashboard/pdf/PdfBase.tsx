import React, { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PdfBaseProps {
  title: string;
  children?: ReactNode;
  onGenerate?: (params: { tenantId: string; from?: string; to?: string }) => void;
}

export function PdfBase({ title, children, onGenerate }: PdfBaseProps) {
  const [tenantId, setTenantId] = useState("default");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const handleGenerate = () => {
    onGenerate?.({ tenantId, from: from || undefined, to: to || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-gray-600">Choose filters and generate PDF outputs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input id="tenantId" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="from">From Date</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="to">To Date</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleGenerate}>Generate PDF</Button>
          </div>
        </CardContent>
      </Card>

      {children}
    </div>
  );
}
