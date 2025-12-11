import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface ItemWisePurchase {
  rmId: string;
  rmName: string;
  quantity: number;
  amount: number;
  unitPrice: number;
  purchaseCount: number;
}

const RMItemWisePurchaseReport = () => {
  const navigate = useNavigate();
  const { purchases, rawMaterials } = useStore();

  const reportData = useMemo(() => {
    const itemMap: Record<string, { name: string; quantity: number; amount: number; count: number; prices: number[] }> = {};

    rawMaterials.forEach((rm) => {
      itemMap[rm.id] = { name: rm.name, quantity: 0, amount: 0, count: 0, prices: [] };
    });

    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (itemMap[item.rawMaterialId]) {
          itemMap[item.rawMaterialId].quantity += item.quantity;
          itemMap[item.rawMaterialId].amount += item.quantity * item.price;
          itemMap[item.rawMaterialId].count += 1;
          itemMap[item.rawMaterialId].prices.push(item.price);
        }
      });
    });

    const result: ItemWisePurchase[] = Object.entries(itemMap)
      .map(([rmId, data]) => ({
        rmId,
        rmName: data.name,
        quantity: data.quantity,
        amount: data.amount,
        unitPrice: data.prices.length > 0 ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length : 0,
        purchaseCount: data.count,
      }))
      .filter((p) => p.purchaseCount > 0)
      .sort((a, b) => b.amount - a.amount);

    return result;
  }, [purchases, rawMaterials]);

  const totals = useMemo(
    () => ({
      quantity: reportData.reduce((sum, item) => sum + item.quantity, 0),
      amount: reportData.reduce((sum, item) => sum + item.amount, 0),
    }),
    [reportData]
  );

  const handleExport = () => {
    const csv = [
      ["Raw Material Item-Wise Purchase Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Item Name", "Quantity", "Unit Price", "Total Amount", "No. of Purchases"],
      ...reportData.map((item) => [
        item.rmName,
        item.quantity.toFixed(2),
        item.unitPrice.toFixed(2),
        item.amount.toFixed(2),
        item.purchaseCount,
      ]),
      [],
      ["TOTAL", totals.quantity.toFixed(2), "", totals.amount.toFixed(2), ""],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rm-itemwise-purchase-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">RM Item-Wise Purchase Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Purchased</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Purchase Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totals.amount.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item-Wise Purchase Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No purchase data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">No. of Purchases</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.rmId}>
                      <TableCell className="font-medium">{item.rmName}</TableCell>
                      <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.purchaseCount}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{totals.quantity.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">₹{totals.amount.toFixed(2)}</TableCell>
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

export default RMItemWisePurchaseReport;
