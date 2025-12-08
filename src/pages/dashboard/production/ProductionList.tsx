import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, CheckCircle, Clock, XCircle, Download } from "lucide-react";

const ProductionList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productions, products, updateProduction, deleteProduction } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "running" | "completed" | "cancelled">("all");

  const filteredProductions = productions.filter((prod) => {
    const product = products.find((p) => p.id === prod.productId);
    const productName = product?.name || "Unknown";
    const matchesSearch =
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || prod.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCompleteProduction = (id: string) => {
    try {
      updateProduction(id, {
        status: "completed",
        endDate: new Date().toISOString().split("T")[0],
      });
      toast({
        title: "Success",
        description: "Production marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update production",
        variant: "destructive",
      });
    }
  };

  const handleCancelProduction = (id: string) => {
    try {
      updateProduction(id, { status: "cancelled" });
      toast({
        title: "Success",
        description: "Production cancelled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel production",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this production record?")) {
      try {
        deleteProduction(id);
        toast({
          title: "Success",
          description: "Production deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete production",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = () => {
    const csv = [
      ["Reference No", "Product", "Quantity", "Start Date", "End Date", "Status", "Stage"].join(","),
      ...filteredProductions.map((prod) => {
        const product = products.find((p) => p.id === prod.productId);
        return [
          prod.referenceNo,
          product?.name || "Unknown",
          prod.quantity,
          prod.startDate,
          prod.endDate || "-",
          prod.status,
          prod.stage,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productions.csv";
    a.click();
  };

  const stats = {
    total: filteredProductions.length,
    running: filteredProductions.filter((p) => p.status === "running").length,
    completed: filteredProductions.filter((p) => p.status === "completed").length,
    cancelled: filteredProductions.filter((p) => p.status === "cancelled").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Production List</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/dashboard/production/add")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Production
          </Button>
          {filteredProductions.length > 0 && (
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Productions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Search Reference / Product</label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Status</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProductions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No productions found.</p>
              <Button
                onClick={() => navigate("/dashboard/production/add")}
                className="mt-4"
              >
                Start Production
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductions.map((production) => {
                    const product = products.find(
                      (p) => p.id === production.productId
                    );
                    return (
                      <TableRow key={production.id}>
                        <TableCell className="font-medium">
                          {production.referenceNo}
                        </TableCell>
                        <TableCell>{product?.name || "Unknown"}</TableCell>
                        <TableCell>{production.quantity} {product?.unit || "pcs"}</TableCell>
                        <TableCell>{production.startDate}</TableCell>
                        <TableCell>{production.endDate || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(production.status)}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {production.status.charAt(0).toUpperCase() +
                                production.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{production.stage}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {production.status === "running" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCompleteProduction(production.id)
                                  }
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCancelProduction(production.id)
                                  }
                                  title="Cancel production"
                                >
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(production.id)}
                              title="Delete production"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionList;
