import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, DollarSign, Clock, AlertCircle } from "lucide-react";

interface Payment {
  id: string;
  partyName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  type: string;
  reference?: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
}

export default function SupplierPaymentsSimple() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    supplier: "",
    amount: "",
    method: "bank-transfer",
    dueDate: ""
  });

  useEffect(() => {
    fetchPayments();
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/parties?type=supplier", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      const supplierList = data.data || data || [];
      setSuppliers(Array.isArray(supplierList) ? supplierList : []);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPayments(data.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!newPayment.supplier || !newPayment.amount) {
      toast({ title: "Error", description: "Fill all fields", variant: "destructive" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          partyName: newPayment.supplier,
          amount: parseFloat(newPayment.amount),
          paymentMethod: newPayment.method,
          date: new Date(newPayment.dueDate),
          type: "supplier_payment",
          reference: `Payment to ${newPayment.supplier}`
        })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Payment recorded" });
        setShowDialog(false);
        setNewPayment({ supplier: "", amount: "", method: "bank-transfer", dueDate: "" });
        fetchPayments();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to record payment");
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to record payment", variant: "destructive" });
    }
  };

  const filteredPayments = payments.filter(p =>
    p.partyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayable = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.type === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.type === "pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Supplier Payments" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Payable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalPayable / 100000).toFixed(1)}L</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(paidAmount / 100000).toFixed(1)}L</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(pendingAmount / 100000).toFixed(1)}L</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Records</CardTitle>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : filteredPayments.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No payments found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.partyName}</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>{payment.reference || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Payment Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Add a new supplier payment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Supplier *</Label>
              <Select value={newPayment.supplier} onValueChange={(value) => setNewPayment({ ...newPayment, supplier: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={suppliers.length === 0 ? "No suppliers available" : "Select supplier"} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">No suppliers found</div>
                  ) : (
                    suppliers.map(sup => (
                      <SelectItem key={sup.id} value={sup.name}>
                        {sup.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select value={newPayment.method} onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddPayment} className="flex-1">
                Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
