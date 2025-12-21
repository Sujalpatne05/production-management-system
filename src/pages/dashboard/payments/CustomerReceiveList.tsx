import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const CustomerReceiveList = () => {
  const navigate = useNavigate();
  const { customerReceives, customers } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReceives = customerReceives.filter((r) =>
    customers.find(c => c.id === r.customerId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || "Unknown";
  const totalReceived = customerReceives.reduce((sum, r) => sum + r.amount, 0);

  const handleExport = () => {
    const csv = [
      ["Reference", "Customer", "Amount", "Date", "Payment Method"],
      ...filteredReceives.map(r => [r.reference, getCustomerName(r.customerId), r.amount, r.date, r.paymentMethod])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer-receives.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Receives</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/customer-receives/add")} className="gap-2">
            <Plus className="w-4 h-4" /> Add Receive
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">₹{totalReceived.toFixed(2)}</div>
          <p className="text-muted-foreground">Total Received</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Receives ({filteredReceives.length})</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search receives..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceives.length > 0 ? (
                  filteredReceives.map((receive) => (
                    <TableRow key={receive.id}>
                      <TableCell className="font-medium">{receive.reference}</TableCell>
                      <TableCell>{getCustomerName(receive.customerId)}</TableCell>
                      <TableCell>₹{receive.amount.toFixed(2)}</TableCell>
                      <TableCell>{receive.date}</TableCell>
                      <TableCell>{receive.paymentMethod}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No receives found</TableCell>
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

export default CustomerReceiveList;
