import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { Plus, Search, Eye, Download, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const QuotationList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { quotations, customers, products, updateQuotation } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState<typeof quotations[0] | null>(null);

  const filteredQuotations = quotations.filter(quotation => {
    const customer = customers.find(c => c.id === quotation.customerId);
    return quotation.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || "Unknown";
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || "Unknown";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-blue-500/20 text-blue-700",
      accepted: "bg-green-500/20 text-green-700",
      rejected: "bg-destructive/20 text-destructive",
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const handleStatusChange = (id: string, status: string) => {
    updateQuotation(id, { status: status as "draft" | "sent" | "accepted" | "rejected" });
    toast({
      title: "Status Updated",
      description: `Quotation status changed to ${status}`,
    });
  };

  const exportToCSV = () => {
    const headers = ["Quotation No", "Customer", "Total", "Valid Until", "Status", "Created At"];
    const rows = quotations.map(q => [
      q.quotationNo,
      getCustomerName(q.customerId),
      q.total.toFixed(2),
      q.validUntil,
      q.status,
      q.createdAt
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotations.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quotations</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button onClick={() => navigate("/dashboard/quotations/add")}>
            <Plus className="h-4 w-4 mr-2" /> Add Quotation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.quotationNo}</TableCell>
                  <TableCell>{getCustomerName(quotation.customerId)}</TableCell>
                  <TableCell>₹{quotation.total.toFixed(2)}</TableCell>
                  <TableCell>{quotation.validUntil}</TableCell>
                  <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedQuotation(quotation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {quotation.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(quotation.id, "sent")}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Select
                        value={quotation.status}
                        onValueChange={(value) => handleStatusChange(quotation.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredQuotations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No quotations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuotation} onOpenChange={() => setSelectedQuotation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quotation Details - {selectedQuotation?.quotationNo}</DialogTitle>
          </DialogHeader>
          {selectedQuotation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{getCustomerName(selectedQuotation.customerId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className="font-medium">{selectedQuotation.validUntil}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedQuotation.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{selectedQuotation.createdAt}</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedQuotation.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{getProductName(item.productId)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right text-xl font-bold">
                Total: ₹{selectedQuotation.total.toFixed(2)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationList;