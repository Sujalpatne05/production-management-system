import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface SupplierDueData {
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  paid: number;
  due: number;
  invoiceCount: number;
  dueStatus: "paid" | "partial" | "unpaid";
}

const SupplierDueReport = () => {
  const navigate = useNavigate();
  const { purchases, suppliers } = useStore();

  const reportData = useMemo(() => {
    const supplierMap: Record<string, { name: string; totalAmount: number; paid: number; due: number; count: number }> = {};

    suppliers.forEach((supplier) => {
      supplierMap[supplier.id] = { name: supplier.name, totalAmount: 0, paid: 0, due: 0, count: 0 };
    });

    purchases.forEach((purchase) => {
      if (supplierMap[purchase.supplierId]) {
        supplierMap[purchase.supplierId].totalAmount += purchase.total;
        supplierMap[purchase.supplierId].paid += purchase.paid;
        supplierMap[purchase.supplierId].due += purchase.due;
        supplierMap[purchase.supplierId].count += 1;
      }
    });

    const result: SupplierDueData[] = Object.entries(supplierMap)
      .map(([supplierId, data]) => {
        const status = data.due === 0 ? ("paid" as const) : data.paid === 0 ? ("unpaid" as const) : ("partial" as const);
        return {
          supplierId,
          supplierName: data.name,
          totalAmount: data.totalAmount,
          paid: data.paid,
          due: data.due,
          invoiceCount: data.count,
          dueStatus: status,
        };
      })
      .filter((s) => s.invoiceCount > 0)
      .sort((a, b) => b.due - a.due);

    return result;
  }, [purchases, suppliers]);

  const totals = useMemo(
    () => ({
      amount: reportData.reduce((sum, item) => sum + item.totalAmount, 0),
      paid: reportData.reduce((sum, item) => sum + item.paid, 0),
      due: reportData.reduce((sum, item) => sum + item.due, 0),
    }),
    [reportData]
  );

  const handleExport = () => {
    const csv = [
      ["Supplier Due Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Supplier Name", "Total Amount", "Paid", "Due", "Invoices", "Status"],
      ...reportData.map((item) => [
        item.supplierName,
        item.totalAmount.toFixed(2),
        item.paid.toFixed(2),
        item.due.toFixed(2),
        item.invoiceCount,
        item.dueStatus.toUpperCase(),
      ]),
      [],
      ["TOTAL", totals.amount.toFixed(2), totals.paid.toFixed(2), totals.due.toFixed(2), "", ""],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supplier-due-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Supplier Due Report</h1>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totals.amount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${totals.paid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">${totals.due.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Due Details</CardTitle>
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
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead className="text-right">Invoices</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.supplierId}>
                      <TableCell className="font-medium">{item.supplierName}</TableCell>
                      <TableCell className="text-right">${item.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600">${item.paid.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-red-600">${item.due.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.invoiceCount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.dueStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : item.dueStatus === "partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.dueStatus.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">${totals.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${totals.paid.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${totals.due.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
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

export default SupplierDueReport;
