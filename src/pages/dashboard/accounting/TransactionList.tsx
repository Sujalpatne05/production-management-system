import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const TransactionList = () => {
  const navigate = useNavigate();
  const { transactions, accounts } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    accounts.find(a => a.id === t.accountId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || "Unknown";

  const totalDeposits = transactions.filter(t => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === "withdraw").reduce((sum, t) => sum + t.amount, 0);

  const handleExport = () => {
    const csv = [
      ["Account", "Type", "Amount", "Date", "Description"],
      ...filteredTransactions.map(t => [getAccountName(t.accountId), t.type, t.amount, t.date, t.description])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deposit/Withdraw List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/accounting/add-transaction")} className="gap-2">
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <ArrowUpCircle className="w-10 h-10 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600">${totalDeposits.toFixed(2)}</div>
              <p className="text-muted-foreground">Total Deposits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <ArrowDownCircle className="w-10 h-10 text-red-500" />
            <div>
              <div className="text-2xl font-bold text-red-600">${totalWithdrawals.toFixed(2)}</div>
              <p className="text-muted-foreground">Total Withdrawals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{getAccountName(t.accountId)}</TableCell>
                      <TableCell>
                        <Badge variant={t.type === "deposit" ? "default" : "destructive"}>
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={t.type === "deposit" ? "text-green-600" : "text-red-600"}>
                        {t.type === "deposit" ? "+" : "-"}${t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell className="max-w-xs truncate">{t.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No transactions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;
