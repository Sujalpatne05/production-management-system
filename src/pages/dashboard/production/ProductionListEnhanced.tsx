import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import {
  Plus,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const ProductionListEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productions, updateProduction, deleteProduction } = useStore();

  // Mock products for demo
  const [products] = useState([
    {
      id: "1",
      name: "MS ANGLE 50x50x5 MM",
      sku: "MSA-50-50-5",
      price: 45,
    },
    {
      id: "2",
      name: "Steel Rod 12mm",
      sku: "SR-12",
      price: 38,
    },
    {
      id: "3",
      name: "Mild Steel Plate",
      sku: "MSP-10",
      price: 50,
    },
    {
      id: "4",
      name: "Stainless Steel Sheet",
      sku: "SSS-2",
      price: 120,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  // Filter Productions
  const filteredProductions = productions.filter((prod) => {
    const product = products.find((p) => p.id === prod.productId);
    const productName = product?.name || "Unknown";
    const matchesSearch =
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prod.status === statusFilter;
    const matchesStage = stageFilter === "all" || prod.stage === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  // KPI Calculations
  const totalProductions = filteredProductions.length;
  const runningProductions = filteredProductions.filter(
    (p) => p.status === "running"
  ).length;
  const completedProductions = filteredProductions.filter(
    (p) => p.status === "completed"
  ).length;
  const totalQuantityProduced = filteredProductions.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  // Status Management
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
      ["Ref No", "Product", "Quantity", "Start Date", "End Date", "Status", "Stage"].join(","),
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
    a.download = "production-list.csv";
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Production Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Total Productions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{totalProductions}</div>
            <p className="text-xs text-blue-600">{runningProductions} running</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{completedProductions}</div>
            <p className="text-xs text-green-600">
              {totalProductions > 0 ? ((completedProductions / totalProductions) * 100).toFixed(0) : 0}% completion
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{runningProductions}</div>
            <p className="text-xs text-orange-600">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Total Quantity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{totalQuantityProduced}</div>
            <p className="text-xs text-purple-600">Units produced</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by reference no or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="raw-material">Raw Material</SelectItem>
            <SelectItem value="cutting">Cutting</SelectItem>
            <SelectItem value="bending">Bending</SelectItem>
            <SelectItem value="welding">Welding</SelectItem>
            <SelectItem value="grinding">Grinding</SelectItem>
            <SelectItem value="painting">Painting</SelectItem>
            <SelectItem value="assembly">Assembly</SelectItem>
            <SelectItem value="quality-check">Quality Check</SelectItem>
            <SelectItem value="packaging">Packaging</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          onClick={() => navigate("/dashboard/production/add-enhanced")}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Production
        </Button>
      </div>

      {/* Productions Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Reference No</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductions.length > 0 ? (
                  filteredProductions.map((prod) => {
                    const product = products.find((p) => p.id === prod.productId);
                    return (
                      <TableRow key={prod.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-semibold text-blue-600">
                          {prod.referenceNo}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{product?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{product?.sku || "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {prod.quantity}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {prod.stage.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(prod.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {prod.endDate ? new Date(prod.endDate).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={`gap-1 ${getStatusColor(prod.status)}`}>
                            {getStatusIcon(prod.status)}
                            {prod.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {prod.status === "running" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompleteProduction(prod.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            {prod.status === "running" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelProduction(prod.id)}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(prod.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="space-y-2">
                        <p className="text-gray-500">No productions found</p>
                        <Button
                          onClick={() => navigate("/dashboard/production/add-enhanced")}
                          variant="outline"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create First Production
                        </Button>
                      </div>
                    </TableCell>
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

export default ProductionListEnhanced;
