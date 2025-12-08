import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface RMPrice {
  rmId: string;
  rmName: string;
  prices: { date: string; price: number }[];
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

const RawMaterialPriceHistory = () => {
  const navigate = useNavigate();
  const { purchases, rawMaterials } = useStore();

  const priceHistory = useMemo(() => {
    const rmPrices: Record<string, { name: string; prices: { date: string; price: number }[] }> = {};

    rawMaterials.forEach((rm) => {
      rmPrices[rm.id] = { name: rm.name, prices: [] };
    });

    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (rmPrices[item.rawMaterialId]) {
          rmPrices[item.rawMaterialId].prices.push({
            date: purchase.date,
            price: item.price,
          });
        }
      });
    });

    const result: RMPrice[] = Object.entries(rmPrices)
      .map(([rmId, data]) => {
        const prices = data.prices.map((p) => p.price);
        return {
          rmId,
          rmName: data.name,
          prices: data.prices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          averagePrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
          minPrice: prices.length > 0 ? Math.min(...prices) : 0,
          maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        };
      })
      .filter((p) => p.prices.length > 0);

    return result;
  }, [purchases, rawMaterials]);

  const handleExport = () => {
    const csv = [
      ["Raw Material Price History Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Raw Material Name", "Date", "Price"],
      ...priceHistory.flatMap((item) =>
        item.prices.map((p) => [item.rmName, p.date, p.price.toFixed(2)])
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rm-price-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/reports/purchase")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Raw Material Price History</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Materials Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{priceHistory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Price Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{priceHistory.reduce((sum, p) => sum + p.prices.length, 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Summary by Raw Material</CardTitle>
        </CardHeader>
        <CardContent>
          {priceHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No price history data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raw Material Name</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead className="text-right">Average Price</TableHead>
                    <TableHead className="text-right">Min Price</TableHead>
                    <TableHead className="text-right">Max Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceHistory.map((item) => (
                    <TableRow key={item.rmId}>
                      <TableCell className="font-medium">{item.rmName}</TableCell>
                      <TableCell className="text-right">{item.prices.length}</TableCell>
                      <TableCell className="text-right">${item.averagePrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.minPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.maxPrice.toFixed(2)}</TableCell>
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

export default RawMaterialPriceHistory;
