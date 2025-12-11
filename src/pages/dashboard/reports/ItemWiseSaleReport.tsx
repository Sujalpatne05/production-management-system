import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface ItemWiseSale {
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  unitPrice: number;
  saleCount: number;
}

const ItemWiseSaleReport = () => {
  const navigate = useNavigate();
  const { sales, products } = useStore();

  const reportData = useMemo(() => {
    const itemMap: Record<string, { name: string; quantity: number; amount: number; count: number; prices: number[] }> = {};

    products.forEach((product) => {
      itemMap[product.id] = { name: product.name, quantity: 0, amount: 0, count: 0, prices: [] };
    });

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (itemMap[item.productId]) {
          itemMap[item.productId].quantity += item.quantity;
          itemMap[item.productId].amount += item.quantity * item.price;
          itemMap[item.productId].count += 1;
          itemMap[item.productId].prices.push(item.price);
        }
      });
    });

    const result: ItemWiseSale[] = Object.entries(itemMap)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantity: data.quantity,
        amount: data.amount,
        unitPrice: data.prices.length > 0 ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length : 0,
        saleCount: data.count,
      }))
      .filter((p) => p.saleCount > 0)
      .sort((a, b) => b.amount - a.amount);

    return result;
  }, [sales, products]);

  const totals = useMemo(
    () => ({
      quantity: reportData.reduce((sum, item) => sum + item.quantity, 0),
      amount: reportData.reduce((sum, item) => sum + item.amount, 0),
    }),
    [reportData]
  );

  const handleExport = () => {
    const csv = [
      ["Item-Wise Sale Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Item Name", "Quantity", "Unit Price", "Total Amount", "No. of Sales"],
      ...reportData.map((item) => [
        item.productName,
        item.quantity.toFixed(2),
        item.unitPrice.toFixed(2),
        item.amount.toFixed(2),
        item.saleCount,
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
    a.download = `itemwise-sale-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Item-Wise Sale Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Sold</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sale Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totals.amount.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item-Wise Sale Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sale data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">No. of Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.saleCount}</TableCell>
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

export default ItemWiseSaleReport;
