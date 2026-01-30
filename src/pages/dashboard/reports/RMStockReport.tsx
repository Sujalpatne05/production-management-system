import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface StockData {
  rmId: string;
  rmName: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: "adequate" | "low" | "critical";
}

const RMStockReport = () => {
  const navigate = useNavigate();
  const { rawMaterials } = useStore();

  const stockData = useMemo(() => {
    return rawMaterials
      .map((rm) => {
        let status: "adequate" | "low" | "critical" = "adequate";
        if (rm.stock < rm.minStock * 0.5) {
          status = "critical";
        } else if (rm.stock < rm.minStock) {
          status = "low";
        }
        return {
          rmId: rm.id,
          rmName: rm.name,
          currentStock: rm.stock,
          minStock: rm.minStock,
          unit: rm.unit,
          status,
        };
      })
      .sort((a, b) => {
        const statusOrder = { critical: 0, low: 1, adequate: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [rawMaterials]);

  const stats = useMemo(() => {
    return {
      total: stockData.length,
      adequate: stockData.filter((s) => s.status === "adequate").length,
      low: stockData.filter((s) => s.status === "low").length,
      critical: stockData.filter((s) => s.status === "critical").length,
    };
  }, [stockData]);

  const handleExport = () => {
    const csv = [
      ["Raw Material Stock Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Item Name", "Current Stock", "Min Stock", "Unit", "Status"],
      ...stockData.map((item) => [
        item.rmName,
        item.currentStock,
        item.minStock,
        item.unit,
        item.status.toUpperCase(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rm-stock-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Raw Material Stock Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Adequate Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.adequate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.low}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Status</CardTitle>
        </CardHeader>
        <CardContent>
          {stockData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No stock data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Min Stock</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item) => (
                    <TableRow key={item.rmId}>
                      <TableCell className="font-medium">{item.rmName}</TableCell>
                      <TableCell className="text-right">{item.currentStock}</TableCell>
                      <TableCell className="text-right">{item.minStock}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.status === "critical"
                              ? "bg-red-100 text-red-800"
                              : item.status === "low"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RMStockReport;
