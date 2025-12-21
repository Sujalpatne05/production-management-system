import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface SupplierBalance {
  supplierId: string;
  supplierName: string;
  totalPurchases: number;
  totalPaid: number;
  balance: number;
}

const SupplierBalanceReport = () => {
  const navigate = useNavigate();
  const { purchases, suppliers } = useStore();

  const reportData = useMemo(() => {
    const balanceMap: Record<string, { name: string; total: number; paid: number }> = {};

    suppliers.forEach((supplier) => {
      balanceMap[supplier.id] = { name: supplier.name, total: 0, paid: 0 };
    });

    purchases.forEach((purchase) => {
      if (balanceMap[purchase.supplierId]) {
        balanceMap[purchase.supplierId].total += purchase.total;
        balanceMap[purchase.supplierId].paid += purchase.paid;
      }
    });

    const result: SupplierBalance[] = Object.entries(balanceMap)
      .map(([supplierId, data]) => ({
        supplierId,
        supplierName: data.name,
        totalPurchases: data.total,
        totalPaid: data.paid,
        balance: data.total - data.paid,
      }))
      .filter((s) => s.totalPurchases > 0)
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

    return result;
  }, [purchases, suppliers]);

  const totals = useMemo(
    () => ({
      purchases: reportData.reduce((sum, item) => sum + item.totalPurchases, 0),
      paid: reportData.reduce((sum, item) => sum + item.totalPaid, 0),
      balance: reportData.reduce((sum, item) => sum + item.balance, 0),
    }),
    [reportData]
  );

  const handleExport = () => {
    const csv = [
      ["Supplier Balance Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Supplier Name", "Total Purchases", "Total Paid", "Balance"],
      ...reportData.map((item) => [
        item.supplierName,
        item.totalPurchases.toFixed(2),
        item.totalPaid.toFixed(2),
        item.balance.toFixed(2),
      ]),
      [],
      ["TOTAL", totals.purchases.toFixed(2), totals.paid.toFixed(2), totals.balance.toFixed(2)],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supplier-balance-report-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Supplier Balance Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reportData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totals.purchases.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">₹{totals.paid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${totals.balance > 0 ? "text-red-600" : "text-green-600"}`}>
              ₹{Math.abs(totals.balance).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Balance Details</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No supplier data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead className="text-right">Total Purchases</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.supplierId}>
                      <TableCell className="font-medium">{item.supplierName}</TableCell>
                      <TableCell className="text-right">₹{item.totalPurchases.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600">₹{item.totalPaid.toFixed(2)}</TableCell>
                      <TableCell className={`text-right font-medium ₹{item.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                        ₹{item.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">₹{totals.purchases.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totals.paid.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${totals.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                      ₹{Math.abs(totals.balance).toFixed(2)}
                    </TableCell>
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

export default SupplierBalanceReport;
