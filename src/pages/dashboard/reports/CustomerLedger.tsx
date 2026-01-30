import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";

interface CustomerLedger {
  customerId: string;
  customerName: string;
  entries: { date: string; invoiceNo: string; amount: number; paid: number; balance: number }[];
}

const CustomerLedger = () => {
  const navigate = useNavigate();
  const { sales, customers } = useStore();

  const ledgerData = useMemo(() => {
    const ledgers: Record<string, { name: string; entries: { date: string; invoiceNo: string; amount: number; paid: number; balance: number }[] }> = {};

    customers.forEach((customer) => {
      ledgers[customer.id] = { name: customer.name, entries: [] };
    });

    const sortedSales = [...sales].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedSales.forEach((sale) => {
      if (ledgers[sale.customerId]) {
        ledgers[sale.customerId].entries.push({
          date: sale.date,
          invoiceNo: sale.invoiceNo,
          amount: sale.total,
          paid: sale.paid,
          balance: sale.due,
        });
      }
    });

    const result: CustomerLedger[] = Object.entries(ledgers)
      .map(([customerId, data]) => ({
        customerId,
        customerName: data.name,
        entries: data.entries,
      }))
      .filter((l) => l.entries.length > 0);

    return result;
  }, [sales, customers]);

  const handleExport = () => {
    const csv = [
      ["Customer Ledger Report"],
      [new Date().toLocaleDateString()],
      [],
      ...ledgerData.flatMap((ledger) => [
        [ledger.customerName],
        ["Date", "Invoice No", "Amount", "Paid", "Balance"],
        ...ledger.entries.map((entry) => [
          entry.date,
          entry.invoiceNo,
          entry.amount.toFixed(2),
          entry.paid.toFixed(2),
          entry.balance.toFixed(2),
        ]),
        [],
      ]),
    ]
      .map((row) => (Array.isArray(row) ? row.join(",") : row))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-ledger-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Customer Ledger</h1>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{ledgerData.length}</p>
        </CardContent>
      </Card>

      {ledgerData.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No ledger data available</p>
          </CardContent>
        </Card>
      ) : (
        ledgerData.map((ledger) => (
          <Card key={ledger.customerId}>
            <CardHeader>
              <CardTitle>{ledger.customerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice No</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledger.entries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell className="font-medium">{entry.invoiceNo}</TableCell>
                        <TableCell className="text-right">₹{entry.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-green-600">₹{entry.paid.toFixed(2)}</TableCell>
                        <TableCell className={`text-right font-medium ₹{entry.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                          ₹{entry.balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CustomerLedger;
