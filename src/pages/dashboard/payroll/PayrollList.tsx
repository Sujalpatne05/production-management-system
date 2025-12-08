import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const PayrollList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { payrolls, updatePayroll } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayrolls = payrolls.filter((p) =>
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.month.includes(searchQuery)
  );

  const totalPaid = payrolls.filter(p => p.status === "paid").reduce((sum, p) => sum + p.netSalary, 0);
  const totalPending = payrolls.filter(p => p.status === "pending").reduce((sum, p) => sum + p.netSalary, 0);

  const handleMarkPaid = (id: string) => {
    updatePayroll(id, { status: "paid" });
    toast({ title: "Success", description: "Payroll marked as paid" });
  };

  const handleExport = () => {
    const csv = [
      ["Employee", "Month", "Basic Salary", "Bonus", "Deductions", "Net Salary", "Status"],
      ...filteredPayrolls.map(p => [p.employeeName, p.month, p.basicSalary, p.bonus, p.deductions, p.netSalary, p.status])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payroll List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/payroll/add")} className="gap-2">
            <Plus className="w-4 h-4" /> Add Payroll
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
            <p className="text-muted-foreground">Total Paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</div>
            <p className="text-muted-foreground">Pending Payment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Payrolls ({filteredPayrolls.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search payrolls..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls.length > 0 ? (
                  filteredPayrolls.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                      <TableCell>{payroll.month}</TableCell>
                      <TableCell>${payroll.basicSalary.toFixed(2)}</TableCell>
                      <TableCell>${payroll.bonus.toFixed(2)}</TableCell>
                      <TableCell>${payroll.deductions.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">${payroll.netSalary.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={payroll.status === "paid" ? "default" : "secondary"}>
                          {payroll.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payroll.status === "pending" && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(payroll.id)} className="gap-1">
                            <CheckCircle className="w-4 h-4" /> Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No payrolls found</TableCell>
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

export default PayrollList;
