import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssetAccount {
  name: string;
  balance: number;
}

interface BalanceSheetData {
  assets: AssetAccount[];
  totalAssets: number;
  liabilities: AssetAccount[];
  totalLiabilities: number;
  equity: number;
}

const BalanceSheet = () => {
  const navigate = useNavigate();
  const { accounts, transactions } = useStore();

  // Calculate balance sheet data
  const balanceSheetData = useMemo<BalanceSheetData>(() => {
    // Calculate current balance for each account based on transactions
    const accountBalances: Record<string, { balance: number; type: string }> = {};

    accounts.forEach((account) => {
      accountBalances[account.id] = {
        balance: account.balance,
        type: account.type,
      };
    });

    // Apply transactions to recalculate balances
    transactions.forEach((transaction) => {
      if (accountBalances[transaction.accountId]) {
        if (transaction.type === "deposit") {
          accountBalances[transaction.accountId].balance += transaction.amount;
        } else {
          accountBalances[transaction.accountId].balance -= transaction.amount;
        }
      }
    });

    // Categorize accounts as assets or liabilities
    const assets: AssetAccount[] = [];
    const liabilities: AssetAccount[] = [];

    accounts.forEach((account) => {
      const balance = accountBalances[account.id]?.balance || 0;
      const accountData = { name: account.name, balance };

      // Bank and Cash accounts are typically assets
      if (account.type === "bank" || account.type === "cash" || account.type === "mobile") {
        assets.push(accountData);
      }
    });

    const totalAssets = assets.reduce((sum, asset) => sum + asset.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.balance, 0);
    const equity = totalAssets - totalLiabilities;

    return {
      assets: assets.sort((a, b) => b.balance - a.balance),
      totalAssets,
      liabilities: liabilities.sort((a, b) => b.balance - a.balance),
      totalLiabilities,
      equity,
    };
  }, [accounts, transactions]);

  const handleExport = () => {
    const csv = [
      ["BALANCE SHEET"],
      ["As of", new Date().toLocaleDateString()],
      [],
      ["ASSETS"],
      ...balanceSheetData.assets.map((asset) => [asset.name, asset.balance.toFixed(2)]),
      ["Total Assets", balanceSheetData.totalAssets.toFixed(2)],
      [],
      ["LIABILITIES"],
      ...balanceSheetData.liabilities.map((liability) => [liability.name, liability.balance.toFixed(2)]),
      ["Total Liabilities", balanceSheetData.totalLiabilities.toFixed(2)],
      [],
      ["EQUITY"],
      ["Total Equity", balanceSheetData.equity.toFixed(2)],
      [],
      ["TOTAL LIABILITIES & EQUITY", (balanceSheetData.totalLiabilities + balanceSheetData.equity).toFixed(2)],
    ]
      .map((row) => (Array.isArray(row) ? row.join(",") : row))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `balance-sheet-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Balance Sheet</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet as of {new Date().toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Assets and Liabilities */}
            <div className="space-y-8">
              {/* Assets Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 border-b-2 pb-2">ASSETS</h3>
                <div className="overflow-x-auto mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceSheetData.assets.map((asset, index) => (
                        <TableRow key={index}>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell className="text-right">
                            ${asset.balance.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-gray-100">
                        <TableCell>Total Assets</TableCell>
                        <TableCell className="text-right">
                          ${balanceSheetData.totalAssets.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Liabilities Section */}
                <h3 className="text-lg font-bold mb-4 border-b-2 pb-2">LIABILITIES</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceSheetData.liabilities.length > 0 ? (
                        <>
                          {balanceSheetData.liabilities.map((liability, index) => (
                            <TableRow key={index}>
                              <TableCell>{liability.name}</TableCell>
                              <TableCell className="text-right">
                                ${liability.balance.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-bold bg-gray-100">
                            <TableCell>Total Liabilities</TableCell>
                            <TableCell className="text-right">
                              ${balanceSheetData.totalLiabilities.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-gray-500">
                            No liabilities recorded
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Right Column - Equity and Totals */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4 border-b-2 pb-2">EQUITY</h3>
                <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Equity:</span>
                    <span className="font-bold text-blue-600">
                      ${balanceSheetData.equity.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-4 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-bold mb-4">SUMMARY</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span>Total Assets:</span>
                    <span className="font-semibold">
                      ${balanceSheetData.totalAssets.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Total Liabilities:</span>
                    <span className="font-semibold">
                      ${balanceSheetData.totalLiabilities.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>Total Equity:</span>
                    <span className="font-semibold">
                      ${balanceSheetData.equity.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t-2 pt-3 mt-3">
                    <span>Total Liabilities & Equity:</span>
                    <span className="text-green-600">
                      ${(balanceSheetData.totalLiabilities + balanceSheetData.equity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Balance Check */}
                <div className="mt-4 p-3 bg-white rounded border-l-4 border-green-500">
                  {Math.abs(
                    balanceSheetData.totalAssets -
                      (balanceSheetData.totalLiabilities + balanceSheetData.equity)
                  ) < 0.01 ? (
                    <p className="text-green-600 font-semibold">✓ Balance Sheet is Balanced</p>
                  ) : (
                    <p className="text-red-600 font-semibold">
                      ✗ Balance Sheet is not balanced. Difference: $
                      {Math.abs(
                        balanceSheetData.totalAssets -
                          (balanceSheetData.totalLiabilities + balanceSheetData.equity)
                      ).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheet;
