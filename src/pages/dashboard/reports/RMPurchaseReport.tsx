import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface RMPurchaseData {
  rmId: string;
  rmName: string;
  totalQuantity: number;
  totalAmount: number;
  averagePrice: number;
  purchaseCount: number;
}

const RMPurchaseReport = () => {
  const navigate = useNavigate();
  const { purchases, rawMaterials } = useStore();

  const reportData = useMemo(() => {
    const purchaseMap: Record<string, { name: string; quantity: number; amount: number; count: number; prices: number[] }> = {};

    rawMaterials.forEach((rm) => {
      purchaseMap[rm.id] = { name: rm.name, quantity: 0, amount: 0, count: 0, prices: [] };
    });

    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (purchaseMap[item.rawMaterialId]) {
          purchaseMap[item.rawMaterialId].quantity += item.quantity;
          purchaseMap[item.rawMaterialId].amount += item.quantity * item.price;
          purchaseMap[item.rawMaterialId].count += 1;
          purchaseMap[item.rawMaterialId].prices.push(item.price);
        }
      });
    });

    const result: RMPurchaseData[] = Object.entries(purchaseMap)
      .map(([rmId, data]) => ({
        rmId,
        rmName: data.name,
        totalQuantity: data.quantity,
        totalAmount: data.amount,
        averagePrice: data.prices.length > 0 ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length : 0,
        purchaseCount: data.count,
      }))
      .filter((p) => p.purchaseCount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return result;
  }, [purchases, rawMaterials]);

  const totals = useMemo(
    () => ({
      quantity: reportData.reduce((sum, item) => sum + item.totalQuantity, 0),
      amount: reportData.reduce((sum, item) => sum + item.totalAmount, 0),
      count: reportData.reduce((sum, item) => sum + item.purchaseCount, 0),
    }),
    [reportData]
  );

  const handleExport = () => {
    const csv = [
      ["Raw Material Purchase Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Raw Material Name", "Total Quantity", "Total Amount", "Purchase Count", "Average Price"],
      ...reportData.map((item) => [
        item.rmName,
        item.totalQuantity.toFixed(2),
        item.totalAmount.toFixed(2),
        item.purchaseCount,
        item.averagePrice.toFixed(2),
      ]),
      [],
      ["TOTAL", totals.quantity.toFixed(2), totals.amount.toFixed(2), totals.count, ""],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rm-purchase-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Raw Material Purchase Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Materials Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reportData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totals.quantity.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totals.amount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totals.count}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Details by Material</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No purchase data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raw Material Name</TableHead>
                    <TableHead className="text-right">Total Quantity</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Purchase Count</TableHead>
                    <TableHead className="text-right">Average Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.rmId}>
                      <TableCell className="font-medium">{item.rmName}</TableCell>
                      <TableCell className="text-right">{item.totalQuantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.purchaseCount}</TableCell>
                      <TableCell className="text-right">${item.averagePrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{totals.quantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${totals.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{totals.count}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RMPurchaseReport;
