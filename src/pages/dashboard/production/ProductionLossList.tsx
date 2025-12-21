import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Download } from "lucide-react";

const ProductionLossList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productionLosses, deleteProductionLoss } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredLosses = productionLosses.filter((loss) => {
    const matchesSearch =
      loss.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loss.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || loss.lossType === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this production loss record?")) {
      try {
        deleteProductionLoss(id);
        toast({
          title: "Success",
          description: "Production loss deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete production loss",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = () => {
    const csv = [
      ["Product", "Quantity Lost", "Loss Type", "Date", "Reason"].join(","),
      ...filteredLosses.map((loss) =>
        [
          loss.productName,
          loss.quantity,
          loss.lossType,
          loss.date,
          loss.reason,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "production-losses.csv";
    a.click();
  };

  const totalQuantityLost = filteredLosses.reduce((sum, loss) => sum + loss.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Production Loss List</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/dashboard/production/add-loss")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Loss
          </Button>
          {filteredLosses.length > 0 && (
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredLosses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Quantity Lost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalQuantityLost}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Common Loss Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {filteredLosses.length > 0
                ? Object.entries(
                    filteredLosses.reduce(
                      (acc, loss) => {
                        acc[loss.lossType] = (acc[loss.lossType] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>
                    )
                  ).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"
                : "N/A"}
            </p>
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
              <label className="text-sm font-medium">Search Product / Reason</label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Loss Type</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="damage">Damage</option>
                <option value="defect">Defect</option>
                <option value="expiry">Expiry</option>
                <option value="spillage">Spillage</option>
                <option value="theft">Theft</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Loss Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLosses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No production losses recorded.</p>
              <Button
                onClick={() => navigate("/dashboard/production/add-loss")}
                className="mt-4"
              >
                Add First Loss
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity Lost</TableHead>
                    <TableHead>Loss Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLosses.map((loss) => (
                    <TableRow key={loss.id}>
                      <TableCell className="font-medium">
                        {loss.productName}
                      </TableCell>
                      <TableCell>{loss.quantity}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {loss.lossType}
                        </span>
                      </TableCell>
                      <TableCell>{loss.date}</TableCell>
                      <TableCell>{loss.reason}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {loss.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(loss.id)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionLossList;
