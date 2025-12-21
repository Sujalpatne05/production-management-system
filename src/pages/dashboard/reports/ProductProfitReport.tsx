import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface ProductProfitData {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
}

const ProductProfitReport = () => {
  const navigate = useNavigate();
  const { sales, products } = useStore();

  const reportData = useMemo(() => {
    const productMap: Record<string, { name: string; quantity: number; revenue: number; cost: number }> = {};

    products.forEach((product) => {
      productMap[product.id] = { name: product.name, quantity: 0, revenue: 0, cost: 0 };
    });

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (productMap[item.productId]) {
          const product = products.find((p) => p.id === item.productId);
          productMap[item.productId].quantity += item.quantity;
          productMap[item.productId].revenue += item.quantity * item.price;
          if (product) {
            productMap[item.productId].cost += item.quantity * product.cost;
          }
        }
      });
    });

    const result: ProductProfitData[] = Object.entries(productMap)
      .map(([productId, data]) => {
        const profit = data.revenue - data.cost;
        const profitMargin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;
        return {
          productId,
          productName: data.name,
          quantity: data.quantity,
          revenue: data.revenue,
          cost: data.cost,
          profit,
          profitMargin,
        };
      })
      .filter((p) => p.quantity > 0)
      .sort((a, b) => b.profit - a.profit);

    return result;
  }, [sales, products]);

  const totals = useMemo(() => {
    return {
      quantity: reportData.reduce((sum, item) => sum + item.quantity, 0),
      revenue: reportData.reduce((sum, item) => sum + item.revenue, 0),
      cost: reportData.reduce((sum, item) => sum + item.cost, 0),
      profit: reportData.reduce((sum, item) => sum + item.profit, 0),
    };
  }, [reportData]);

  const avgMargin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0;

  const handleExport = () => {
    const csv = [
      ["Product Profit Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Product Name", "Quantity", "Revenue", "Cost", "Profit", "Margin %"],
      ...reportData.map((item) => [
        item.productName,
        item.quantity,
        item.revenue.toFixed(2),
        item.cost.toFixed(2),
        item.profit.toFixed(2),
        item.profitMargin.toFixed(2),
      ]),
      [],
      ["TOTAL", totals.quantity, totals.revenue.toFixed(2), totals.cost.toFixed(2), totals.profit.toFixed(2), avgMargin.toFixed(2)],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-profit-report-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Product Profit Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totals.revenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totals.cost.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ₹{totals.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{totals.profit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ₹{avgMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
              {avgMargin.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Profitability Details</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No profit data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.cost.toFixed(2)}</TableCell>
                      <TableCell className={`text-right font-medium ₹{item.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ₹{item.profit.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right ₹{item.profitMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.profitMargin.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{totals.quantity}</TableCell>
                    <TableCell className="text-right">₹{totals.revenue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totals.cost.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ₹{totals.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ₹{totals.profit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">{avgMargin.toFixed(2)}%</TableCell>
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

export default ProductProfitReport;
