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
import {
  Plus,
  Edit2,
  Trash2,
  Printer,
  Download,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Challan {
  id: string;
  challanNo: string;
  challanType: "outward" | "inward" | "returnable" | "non-returnable";
  code: string;
  date: string;
  material: string;
  quantity: number;
  location: string;
  vehicleNo?: string;
  driver?: string;
  status: "active" | "completed" | "expired";
  remarks?: string;
}

export default function ChallanGatePassEnhanced() {
  const { toast } = useToast();
  const [challanFilter, setChallanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newChallan, setNewChallan] = useState({
     challanType: "outward" as "outward" | "inward" | "returnable" | "non-returnable",
    material: "",
    quantity: 0,
    location: "GATE-1",
    vehicleNo: "",
    driver: "",
    remarks: "",
  });

  const [challans, setChallans] = useState<Challan[]>([
    {
      id: "1",
      challanNo: "CHLN-OUT-001",
      challanType: "outward",
      code: "CODE-0001",
      date: "2026-01-27",
      material: "MS ANGLE 50x50x5 MM",
      quantity: 50,
      location: "GATE-1",
      vehicleNo: "DL-01-AB-1234",
      driver: "Rajesh Kumar",
      status: "completed",
      remarks: "Delivered to Site A",
    },
    {
      id: "2",
      challanNo: "CHLN-IN-001",
      challanType: "inward",
      code: "CODE-0002",
      date: "2026-01-27",
      material: "Steel Rod",
      quantity: 100,
      location: "GATE-2",
      vehicleNo: "HR-26-XY-5678",
      driver: "Pradeep Singh",
      status: "active",
      remarks: "Received from supplier",
    },
    {
      id: "3",
      challanNo: "CHLN-RET-001",
      challanType: "returnable",
      code: "CODE-0003",
      date: "2026-01-26",
      material: "Pallet",
      quantity: 10,
      location: "GATE-1",
      vehicleNo: "UP-14-CD-9012",
      driver: "Mohan Lal",
      status: "completed",
      remarks: "Returnable pallets",
    },
    {
      id: "4",
      challanNo: "CHLN-NR-001",
      challanType: "non-returnable",
      code: "CODE-0004",
      date: "2026-01-25",
      material: "Packaging Material",
      quantity: 250,
      location: "GATE-3",
      vehicleNo: "PB-01-MN-3456",
      driver: "Deepak Sharma",
      status: "expired",
      remarks: "Non-returnable packaging",
    },
  ]);

  const handleAddChallan = () => {
    if (!newChallan.material || newChallan.quantity === 0) {
      toast({ title: "Please fill all required fields" });
      return;
    }

    const typePrefix = {
      outward: "OUT",
      inward: "IN",
      returnable: "RET",
      "non-returnable": "NR",
    };

    const nextNum = challans.filter(
      (c) => c.challanType === newChallan.challanType
    ).length + 1;
    const challanNo = `CHLN-${typePrefix[newChallan.challanType]}-${String(nextNum).padStart(3, "0")}`;
    const code = `CODE-${String(challans.length + 1).padStart(4, "0")}`;

    const challan: Challan = {
      id: Date.now().toString(),
      challanNo,
      challanType: newChallan.challanType,
      code,
      date: new Date().toISOString().split("T")[0],
      material: newChallan.material,
      quantity: newChallan.quantity,
      location: newChallan.location,
      vehicleNo: newChallan.vehicleNo,
      driver: newChallan.driver,
      status: "active",
      remarks: newChallan.remarks,
    };

    setChallans([...challans, challan]);
    setNewChallan({
      challanType: "outward",
      material: "",
      quantity: 0,
      location: "GATE-1",
      vehicleNo: "",
      driver: "",
      remarks: "",
    });
    setShowAddDialog(false);
    toast({ title: "Challan created successfully" });
  };

  const handleDelete = (id: string) => {
    setChallans(challans.filter((c) => c.id !== id));
    toast({ title: "Challan deleted successfully" });
  };

  const handleStatusChange = (id: string, status: Challan["status"]) => {
    setChallans(
      challans.map((c) => (c.id === id ? { ...c, status } : c))
    );
    toast({ title: `Status updated to ${status}` });
  };

  const handlePrint = (challanNo: string) => {
    toast({ title: `Printing challan ${challanNo}...` });
  };

  const handleExport = () => {
    const csv = [
      [
        "Challan No",
        "Type",
        "Material",
        "Quantity",
        "Location",
        "Vehicle No",
        "Driver",
        "Status",
        "Date",
      ],
      ...filteredChallans.map((c) => [
        c.challanNo,
        c.challanType,
        c.material,
        c.quantity,
        c.location,
        c.vehicleNo || "-",
        c.driver || "-",
        c.status,
        c.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "challan-report.csv";
    a.click();
    toast({ title: "Challan report exported successfully" });
  };

  const filteredChallans = challans.filter((c) => {
    const matchesSearch =
      c.challanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = challanFilter === "all" || c.challanType === challanFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeChallan = challans.filter((c) => c.status === "active").length;
  const outwardCount = challans.filter((c) => c.challanType === "outward").length;
  const inwardCount = challans.filter((c) => c.challanType === "inward").length;
  const totalQuantity = filteredChallans.reduce((sum, c) => sum + c.quantity, 0);

  const typeLabels = {
    outward: "Outward",
    inward: "Inward",
    returnable: "Returnable",
    "non-returnable": "Non-Returnable",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Challan & Gate Pass Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Active Challans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeChallan}</div>
            <p className="text-xs text-gray-500 mt-1">In transit</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Outward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{outwardCount}</div>
            <p className="text-xs text-gray-500 mt-1">Outgoing</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Inward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{inwardCount}</div>
            <p className="text-xs text-gray-500 mt-1">Incoming</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Qty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {totalQuantity}
            </div>
            <p className="text-xs text-gray-500 mt-1">In filtered results</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Input
            placeholder="Search by Challan No, Material, or Vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>

        <Select value={challanFilter} onValueChange={setChallanFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="outward">Outward</SelectItem>
            <SelectItem value="inward">Inward</SelectItem>
            <SelectItem value="returnable">Returnable</SelectItem>
            <SelectItem value="non-returnable">Non-Returnable</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
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
              Add Challan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Challan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Challan Type *</label>
                <Select
                  value={newChallan.challanType}
                  onValueChange={(value) =>
                      setNewChallan({
                        ...newChallan,
                        challanType: value as "outward" | "inward" | "returnable" | "non-returnable",
                      })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outward">Outward Gate Challan</SelectItem>
                    <SelectItem value="inward">Inward Gate Challan</SelectItem>
                    <SelectItem value="returnable">Returnable Gate Pass</SelectItem>
                    <SelectItem value="non-returnable">Non-Returnable Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Material Name *</label>
                <Input
                  placeholder="e.g., MS ANGLE 50x50x5 MM"
                  value={newChallan.material}
                  onChange={(e) =>
                    setNewChallan({ ...newChallan, material: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Quantity *</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newChallan.quantity}
                  onChange={(e) =>
                    setNewChallan({
                      ...newChallan,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Gate/Location</label>
                  <Select
                    value={newChallan.location}
                    onValueChange={(value) =>
                      setNewChallan({ ...newChallan, location: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GATE-1">GATE-1</SelectItem>
                      <SelectItem value="GATE-2">GATE-2</SelectItem>
                      <SelectItem value="GATE-3">GATE-3</SelectItem>
                      <SelectItem value="STORE-A">STORE-A</SelectItem>
                      <SelectItem value="STORE-B">STORE-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Vehicle No</label>
                  <Input
                    placeholder="DL-01-AB-1234"
                    value={newChallan.vehicleNo}
                    onChange={(e) =>
                      setNewChallan({ ...newChallan, vehicleNo: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Driver Name</label>
                <Input
                  placeholder="e.g., Rajesh Kumar"
                  value={newChallan.driver}
                  onChange={(e) =>
                    setNewChallan({ ...newChallan, driver: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Remarks</label>
                <Textarea
                  placeholder="Any additional notes..."
                  value={newChallan.remarks}
                  onChange={(e) =>
                    setNewChallan({ ...newChallan, remarks: e.target.value })
                  }
                  className="mt-1"
                  rows={3}
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
                  onClick={handleAddChallan}
                >
                  Create Challan
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
              <TableHead className="font-bold">Challan No</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Material</TableHead>
              <TableHead className="font-bold">Qty</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Vehicle</TableHead>
              <TableHead className="font-bold">Driver</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChallans.length > 0 ? (
              filteredChallans.map((challan) => (
                <TableRow key={challan.id} className="hover:bg-gray-50">
                  <TableCell className="font-bold text-blue-600">
                    {challan.challanNo}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {typeLabels[challan.challanType]}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{challan.material}</TableCell>
                  <TableCell className="text-right font-bold">
                    {challan.quantity}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {challan.location}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{challan.vehicleNo || "-"}</TableCell>
                  <TableCell className="text-sm">{challan.driver || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={challan.status}
                      onValueChange={(val) =>
                        handleStatusChange(challan.id, val as Challan["status"])
                      }
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">{challan.date}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(challan.challanNo)}
                    >
                      <Printer className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(challan.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No challans found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
