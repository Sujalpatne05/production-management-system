import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, Download, TrendingDown, TrendingUp } from "lucide-react";

interface GINEntry {
  id: string;
  ginNo: string;
  poNo: string;
  invoiceNo: string;
  userName: string;
  material: string;
  inwardQty: number;
  shortQty: number;
  excessQty: number;
  discrepancyRate: number;
  creditNote: string;
  date: string;
  status: "pending" | "completed" | "rejected";
}

export default function GINGONEnhanced() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newEntry, setNewEntry] = useState({
    poNo: "",
    invoiceNo: "",
    material: "",
    inwardQty: 0,
    shortQty: 0,
    excessQty: 0,
    userName: "",
  });

  const [entries, setEntries] = useState<GINEntry[]>([
    {
      id: "1",
      ginNo: "GIN-001",
      poNo: "PO-2026-001",
      invoiceNo: "INV-001",
      userName: "John Doe",
      material: "MS ANGLE 50x50x5 MM",
      inwardQty: 100,
      shortQty: 5,
      excessQty: 0,
      discrepancyRate: 5,
      creditNote: "CN-001",
      date: "2026-01-27",
      status: "completed",
    },
    {
      id: "2",
      ginNo: "GIN-002",
      poNo: "PO-2026-002",
      invoiceNo: "INV-002",
      userName: "Jane Smith",
      material: "Steel Rod 12mm",
      inwardQty: 200,
      shortQty: 2,
      excessQty: 5,
      discrepancyRate: 3.5,
      creditNote: "CN-002",
      date: "2026-01-26",
      status: "completed",
    },
    {
      id: "3",
      ginNo: "GIN-003",
      poNo: "PO-2026-003",
      invoiceNo: "INV-003",
      userName: "Mike Johnson",
      material: "MS Plate 5mm",
      inwardQty: 150,
      shortQty: 10,
      excessQty: 2,
      discrepancyRate: 8,
      creditNote: "CN-003",
      date: "2026-01-25",
      status: "pending",
    },
  ]);

  const handleAddEntry = () => {
    if (!newEntry.poNo || !newEntry.invoiceNo || !newEntry.material) {
      toast({ title: "Please fill all required fields" });
      return;
    }

    const nextGinNo = `GIN-${String(entries.length + 1).padStart(3, "0")}`;
    const discrepancy =
      ((newEntry.shortQty + newEntry.excessQty) / newEntry.inwardQty) * 100;

    const entry: GINEntry = {
      id: Date.now().toString(),
      ginNo: nextGinNo,
      poNo: newEntry.poNo,
      invoiceNo: newEntry.invoiceNo,
      userName: newEntry.userName || "System",
      material: newEntry.material,
      inwardQty: newEntry.inwardQty,
      shortQty: newEntry.shortQty,
      excessQty: newEntry.excessQty,
      discrepancyRate: Math.round(discrepancy * 10) / 10,
      creditNote: `CN-${String(entries.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setEntries([...entries, entry]);
    setNewEntry({
      poNo: "",
      invoiceNo: "",
      material: "",
      inwardQty: 0,
      shortQty: 0,
      excessQty: 0,
      userName: "",
    });
    setShowAddDialog(false);
    toast({ title: "GIN/GON entry created successfully" });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    toast({ title: "GIN/GON entry deleted" });
  };

  const handleStatusChange = (id: string, status: GINEntry["status"]) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, status } : e))
    );
    toast({ title: `Status updated to ${status}` });
  };

  const handleExport = () => {
    const csv = [
      [
        "GIN No",
        "PO No",
        "Invoice No",
        "Material",
        "Inward Qty",
        "Short Qty",
        "Excess Qty",
        "Discrepancy %",
        "Status",
        "Date",
      ],
      ...filteredEntries.map((e) => [
        e.ginNo,
        e.poNo,
        e.invoiceNo,
        e.material,
        e.inwardQty,
        e.shortQty,
        e.excessQty,
        e.discrepancyRate,
        e.status,
        e.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gin-gon-report.csv";
    a.click();
    toast({ title: "GIN/GON report exported successfully" });
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.ginNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filter === "all" || e.status === filter;
    return matchesSearch && matchesStatus;
  });

  const totalGIN = entries.length;
  const completedGIN = entries.filter((e) => e.status === "completed").length;
  const totalShortages = entries.reduce((sum, e) => sum + e.shortQty, 0);
  const avgDiscrepancy = Math.round(
    (entries.reduce((sum, e) => sum + e.discrepancyRate, 0) / entries.length) *
      10
  ) / 10;

  return (
    <div className="space-y-6">
      <PageHeader title="GIN/GON (Good Inward & Outward Notes)" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total GIN/GON
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalGIN}</div>
            <p className="text-xs text-gray-500 mt-1">Entries recorded</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedGIN}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((completedGIN / totalGIN) * 100)}% completion
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Shortages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totalShortages}</div>
            <p className="text-xs text-gray-500 mt-1">Units short</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Avg Discrepancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {avgDiscrepancy}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Variance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Input
            placeholder="Search by GIN No, PO No, or Material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add GIN/GON
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New GIN/GON Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">PO Number *</label>
                <Input
                  placeholder="e.g., PO-2026-001"
                  value={newEntry.poNo}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, poNo: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Invoice Number *</label>
                <Input
                  placeholder="e.g., INV-001"
                  value={newEntry.invoiceNo}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, invoiceNo: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Material Name *</label>
                <Input
                  placeholder="e.g., MS ANGLE 50x50x5 MM"
                  value={newEntry.material}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, material: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-sm font-medium">Inward Qty *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newEntry.inwardQty}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        inwardQty: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Short</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newEntry.shortQty}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        shortQty: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Excess</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newEntry.excessQty}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        excessQty: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">User Name</label>
                <Input
                  placeholder="e.g., John Doe"
                  value={newEntry.userName}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, userName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAddEntry}
                >
                  Add Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold">GIN No</TableHead>
              <TableHead className="font-bold">PO No</TableHead>
              <TableHead className="font-bold">Material</TableHead>
              <TableHead className="font-bold">Inward</TableHead>
              <TableHead className="font-bold">Short</TableHead>
              <TableHead className="font-bold">Excess</TableHead>
              <TableHead className="font-bold">Discrepancy %</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell className="font-bold text-blue-600">
                    {entry.ginNo}
                  </TableCell>
                  <TableCell className="font-medium">{entry.poNo}</TableCell>
                  <TableCell className="text-sm">{entry.material}</TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.inwardQty}
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    {entry.shortQty}
                  </TableCell>
                  <TableCell className="text-right text-orange-600 font-medium">
                    {entry.excessQty}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      entry.discrepancyRate > 5
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {entry.discrepancyRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={entry.status}
                      onValueChange={(val) =>
                        handleStatusChange(entry.id, val as GINEntry["status"])
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">{entry.date}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No GIN/GON entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
