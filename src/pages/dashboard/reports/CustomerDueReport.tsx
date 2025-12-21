import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface CustomerDueData {
  customerId: string;
  customerName: string;
  totalAmount: number;
  paid: number;
  due: number;
  invoiceCount: number;
  dueStatus: "paid" | "partial" | "unpaid";
}

const CustomerDueReport = () => {
  const navigate = useNavigate();
  const { sales, customers } = useStore();

  const reportData = useMemo(() => {
    const customerMap: Record<string, { name: string; totalAmount: number; paid: number; due: number; count: number }> = {};

    customers.forEach((customer) => {
      customerMap[customer.id] = { name: customer.name, totalAmount: 0, paid: 0, due: 0, count: 0 };
    });

    sales.forEach((sale) => {
      if (customerMap[sale.customerId]) {
        customerMap[sale.customerId].totalAmount += sale.total;
        customerMap[sale.customerId].paid += sale.paid;
        customerMap[sale.customerId].due += sale.due;
        customerMap[sale.customerId].count += 1;
      }
    });

    const result: CustomerDueData[] = Object.entries(customerMap)
      .map(([customerId, data]) => {
        const status = data.due === 0 ? ("paid" as const) : data.paid === 0 ? ("unpaid" as const) : ("partial" as const);
        return {
          customerId,
          customerName: data.name,
          totalAmount: data.totalAmount,
          paid: data.paid,
          due: data.due,
          invoiceCount: data.count,
          dueStatus: status,
        };
      })
      .filter((c) => c.invoiceCount > 0)
      .sort((a, b) => b.due - a.due);

    return result;
  }, [sales, customers]);

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
      ["Customer Due Report"],
      [new Date().toLocaleDateString()],
      [],
      ["Customer Name", "Total Amount", "Paid", "Due", "Invoices", "Status"],
      ...reportData.map((item) => [
        item.customerName,
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
    a.download = `customer-due-report-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Customer Due Report</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
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
            <p className="text-3xl font-bold">₹{totals.amount.toFixed(2)}</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">₹{totals.due.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Due Details</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No customer data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead className="text-right">Invoices</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.customerId}>
                      <TableCell className="font-medium">{item.customerName}</TableCell>
                      <TableCell className="text-right">₹{item.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600">₹{item.paid.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-red-600">₹{item.due.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.invoiceCount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ₹{
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
                    <TableCell className="text-right">₹{totals.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totals.paid.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totals.due.toFixed(2)}</TableCell>
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

export default CustomerDueReport;
