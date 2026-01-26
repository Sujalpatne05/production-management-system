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
import { Plus, Edit2, Trash2, Search, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface MaterialCode {
  id: string;
  code: string;
  name: string;
  specification: string;
  hsnCode: string;
  section: string;
  unit: string;
  createdDate: string;
}

const SECTIONS = [
  "PRODUCTION",
  "ADMIN",
  "TRANSPORT",
  "MAINTENANCE",
  "STORAGE",
  "PACKING",
];

const UNITS = ["PCS", "KG", "METER", "LITER", "BOX", "PACK", "ROLL"];

export default function MaterialCodesEnhanced() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    specification: "",
    hsnCode: "",
    section: "",
    unit: "PCS",
  });

  const [materials, setMaterials] = useState<MaterialCode[]>([
    {
      id: "1",
      code: "MAT-001",
      name: "MS ANGLE 50x50x5 MM",
      specification: "MS ANGLE 50x50x5 MM, Grade IS 1730",
      hsnCode: "928414",
      section: "PRODUCTION",
      unit: "METER",
      createdDate: "2026-01-25",
    },
    {
      id: "2",
      code: "MAT-002",
      name: "Steel Rod 12mm",
      specification: "Steel Rod 12mm, Grade 500",
      hsnCode: "928430",
      section: "PRODUCTION",
      unit: "KG",
      createdDate: "2026-01-24",
    },
    {
      id: "3",
      code: "MAT-003",
      name: "MS Plate 5mm",
      specification: "MS Plate 5mm, Hot Rolled",
      hsnCode: "927290",
      section: "PRODUCTION",
      unit: "KG",
      createdDate: "2026-01-23",
    },
    {
      id: "4",
      code: "MAT-004",
      name: "Stainless Sheet 316L",
      specification: "SS 316L, 2B Finish, 1.5mm",
      hsnCode: "930790",
      section: "MAINTENANCE",
      unit: "METER",
      createdDate: "2026-01-22",
    },
  ]);

  const handleAddMaterial = () => {
    if (
      !newMaterial.name ||
      !newMaterial.hsnCode ||
      !newMaterial.section
    ) {
      toast({ title: "Please fill all required fields" });
      return;
    }

    const nextCode = `MAT-${String(materials.length + 1).padStart(3, "0")}`;
    const material: MaterialCode = {
      id: Date.now().toString(),
      code: nextCode,
      name: newMaterial.name,
      specification: newMaterial.specification,
      hsnCode: newMaterial.hsnCode,
      section: newMaterial.section,
      unit: newMaterial.unit,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setMaterials([...materials, material]);
    setNewMaterial({
      name: "",
      specification: "",
      hsnCode: "",
      section: "",
      unit: "PCS",
    });
    setShowAddDialog(false);
    toast({ title: "Material Code added successfully" });
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast({ title: "Material Code deleted successfully" });
  };

  const handleExport = () => {
    const csv = [
      ["Code", "Name", "Specification", "HSN Code", "Section", "Unit", "Date"],
      ...filteredMaterials.map((m) => [
        m.code,
        m.name,
        m.specification,
        m.hsnCode,
        m.section,
        m.unit,
        m.createdDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "material-codes.csv";
    a.click();
    toast({ title: "Material Codes exported successfully" });
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.hsnCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection =
      filterSection === "all" || m.section === filterSection;
    return matchesSearch && matchesSection;
  });

  const totalMaterials = materials.length;
  const uniqueSection = new Set(materials.map((m) => m.section)).size;
  const productionItems = materials.filter((m) => m.section === "PRODUCTION")
    .length;

  return (
    <div className="space-y-6">
      <PageHeader title="Material Codes" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totalMaterials}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active codes</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {uniqueSection}
            </div>
            <p className="text-xs text-gray-500 mt-1">Categories used</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Production Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {productionItems}
            </div>
            <p className="text-xs text-gray-500 mt-1">In production</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Filtered Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {filteredMaterials.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Matching search</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by code, name, or HSN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {SECTIONS.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
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
              Add Material Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Material Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Material Name *</label>
                <Input
                  placeholder="e.g., MS ANGLE 50x50x5 MM"
                  value={newMaterial.name}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Specification</label>
                <Textarea
                  placeholder="e.g., Grade IS 1730, Hot Rolled"
                  value={newMaterial.specification}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      specification: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">HSN Code *</label>
                <Input
                  placeholder="e.g., 928414"
                  value={newMaterial.hsnCode}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      hsnCode: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Section *</label>
                  <Select
                    value={newMaterial.section}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, section: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Unit *</label>
                  <Select
                    value={newMaterial.unit}
                    onValueChange={(value) =>
                      setNewMaterial({ ...newMaterial, unit: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  onClick={handleAddMaterial}
                >
                  Add Material
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold">Code</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Specification</TableHead>
              <TableHead className="font-bold">HSN Code</TableHead>
              <TableHead className="font-bold">Section</TableHead>
              <TableHead className="font-bold">Unit</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <TableRow key={material.id} className="hover:bg-gray-50">
                  <TableCell className="font-bold text-blue-600">
                    {material.code}
                  </TableCell>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {material.specification}
                  </TableCell>
                  <TableCell>{material.hsnCode}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {material.section}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{material.unit}</TableCell>
                  <TableCell className="text-sm">{material.createdDate}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(material.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No material codes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
