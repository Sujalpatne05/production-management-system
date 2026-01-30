import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrialBalanceAccount {
  id: string;
  name: string;
  type: string;
  debit: number;
  credit: number;
}

interface TrialBalanceData {
  accounts: TrialBalanceAccount[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

const TrialBalance = () => {
  const navigate = useNavigate();
  const { accounts, transactions } = useStore();

  // Calculate trial balance data
  const trialBalanceData = useMemo<TrialBalanceData>(() => {
    const accountBalances: Record<
      string,
      { name: string; type: string; debit: number; credit: number }
    > = {};

    // Initialize accounts
    accounts.forEach((account) => {
      accountBalances[account.id] = {
        name: account.name,
        type: account.type,
        debit: 0,
        credit: 0,
      };
    });

    // Process transactions to calculate debits and credits
    transactions.forEach((transaction) => {
      if (accountBalances[transaction.accountId]) {
        if (transaction.type === "deposit") {
          // Deposits increase account balance (credit for liability, debit for asset)
          accountBalances[transaction.accountId].debit += transaction.amount;
        } else {
          // Withdrawals decrease account balance (debit for asset, credit for liability)
          accountBalances[transaction.accountId].credit += transaction.amount;
        }
      }
    });

    // Apply initial balances as either debit or credit
    accounts.forEach((account) => {
      if (accountBalances[account.id] && account.balance !== 0) {
        // Assets typically have debit balances
        if (account.type === "bank" || account.type === "cash" || account.type === "mobile") {
          accountBalances[account.id].debit += account.balance;
        }
      }
    });

    // Convert to array and calculate totals
    const accountsList: TrialBalanceAccount[] = Object.entries(accountBalances)
      .map(([id, data]) => ({
        id,
        name: data.name,
        type: data.type,
        debit: data.debit,
        credit: data.credit,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const totalDebit = accountsList.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = accountsList.reduce((sum, acc) => sum + acc.credit, 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    return {
      accounts: accountsList,
      totalDebit,
      totalCredit,
      isBalanced,
    };
  }, [accounts, transactions]);

  const handleExport = () => {
    const csv = [
      ["TRIAL BALANCE"],
      ["As of", new Date().toLocaleDateString()],
      [],
      ["Account Name", "Type", "Debit", "Credit"],
      ...trialBalanceData.accounts.map((acc) => [
        acc.name,
        acc.type,
        acc.debit.toFixed(2),
        acc.credit.toFixed(2),
      ]),
      ["TOTAL", "", trialBalanceData.totalDebit.toFixed(2), trialBalanceData.totalCredit.toFixed(2)],
    ]
      .map((row) => (Array.isArray(row) ? row.join(",") : row))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-₹{new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trial Balance</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/accounting/accounts")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            Print
          </Button>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              ₹{trialBalanceData.totalDebit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ₹{trialBalanceData.totalCredit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ₹{
                trialBalanceData.isBalanced ? "text-green-600" : "text-red-600"
              }`}
            >
              {trialBalanceData.isBalanced ? "✓ Balanced" : "✗ Not Balanced"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trial Balance as of {new Date().toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          {trialBalanceData.accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No accounts found. Please add accounts first.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead className="text-right">Debit (₹)</TableHead>
                    <TableHead className="text-right">Credit (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialBalanceData.accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {account.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {account.debit > 0 ? `₹₹{account.debit.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.credit > 0 ? `₹₹{account.credit.toFixed(2)}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100 border-t-2">
                    <TableCell colSpan={2}>TOTAL</TableCell>
                    <TableCell className="text-right">
                      ₹{trialBalanceData.totalDebit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{trialBalanceData.totalCredit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Balance Check */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="font-medium">Total Debits:</span>
              <span className="text-xl font-bold text-blue-600">
                ₹{trialBalanceData.totalDebit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
              <span className="font-medium">Total Credits:</span>
              <span className="text-xl font-bold text-green-600">
                ₹{trialBalanceData.totalCredit.toFixed(2)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-4 rounded-lg border-2 ₹{
                trialBalanceData.isBalanced
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              <span className="font-bold">Difference:</span>
              <span
                className={`text-xl font-bold ₹{
                  trialBalanceData.isBalanced ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{Math.abs(trialBalanceData.totalDebit - trialBalanceData.totalCredit).toFixed(2)}
              </span>
            </div>

            {trialBalanceData.isBalanced ? (
              <div className="p-4 bg-green-100 border border-green-500 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✓ Trial Balance is balanced. Debits equal Credits.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-100 border border-red-500 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ✗ Trial Balance is not balanced. Please review your transactions.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialBalance;
