import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface ProductProductionData {
  productId: string;
  productName: string;
  totalQuantity: number;
  completedQuantity: number;
  runningQuantity: number;
  completionRate: number;
}

const ProductProductionReport = () => {
  const navigate = useNavigate();
  const { productions, products } = useStore();

  const reportData = useMemo(() => {
    const productMap: Record<string, { name: string; total: number; completed: number; running: number }> = {};

    products.forEach((product) => {
      productMap[product.id] = { name: product.name, total: 0, completed: 0, running: 0 };
    });

    productions.forEach((production) => {
      if (productMap[production.productId]) {
        productMap[production.productId].total += production.quantity;
        if (production.status === "completed") {
          productMap[production.productId].completed += production.quantity;
        } else if (production.status === "running") {
          productMap[production.productId].running += production.quantity;
        }
      }
    });

    const result: ProductProductionData[] = Object.entries(productMap)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        totalQuantity: data.total,
        completedQuantity: data.completed,
        runningQuantity: data.running,
        completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      }))
      .filter((p) => p.totalQuantity > 0)
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    return result;
  }, [productions, products]);

  const totals = useMemo(
    () => ({
      total: reportData.reduce((sum, item) => sum + item.totalQuantity, 0),
      completed: reportData.reduce((sum, item) => sum + item.completedQuantity, 0),
      running: reportData.reduce((sum, item) => sum + item.runningQuantity, 0),
    }),
    [reportData]
  );

  const handleExport = () => {
    const csv = [
      ["Product Production Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Product Name", "Total Quantity", "Completed", "Running", "Completion Rate"],
      ...reportData.map((item) => [
        item.productName,
        item.totalQuantity,
        item.completedQuantity,
        item.runningQuantity,
        item.completionRate.toFixed(2),
      ]),
      [],
      ["TOTAL", totals.total, totals.completed, totals.running, ""],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-production-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Product Production Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
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
            <p className="text-3xl font-bold">{totals.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{totals.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totals.running}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production by Product</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No production data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Total Quantity</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Running</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-right">{item.totalQuantity}</TableCell>
                      <TableCell className="text-right text-green-600">{item.completedQuantity}</TableCell>
                      <TableCell className="text-right text-blue-600">{item.runningQuantity}</TableCell>
                      <TableCell className="text-right">{item.completionRate.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{totals.total}</TableCell>
                    <TableCell className="text-right">{totals.completed}</TableCell>
                    <TableCell className="text-right">{totals.running}</TableCell>
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

export default ProductProductionReport;
