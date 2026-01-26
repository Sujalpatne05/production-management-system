import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface MaterialCode {
  id: string;
  code: string;
  name: string;
  specification: string;
  hsnCode: string;
  section: string;
  createdDate: string;
}

export default function MaterialCodeList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [materials, setMaterials] = useState<MaterialCode[]>([
    {
      id: "1",
      code: "YYYY",
      name: "MS ANGLE 50x50x5 MM",
      specification: "MS ANGLE 50x50x5 MM",
      hsnCode: "928414",
      section: "PRODUCTION/ADMIN/TRANSPORT/MAINTENANCE",
      createdDate: "2026-01-27",
    },
  ]);

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast({ title: "Material Code deleted successfully" });
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Material Codes" />

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Material Code
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Specification</TableHead>
              <TableHead>HSN Code</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.code}</TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.specification}</TableCell>
                <TableCell>{material.hsnCode}</TableCell>
                <TableCell className="text-sm">{material.section}</TableCell>
                <TableCell>{material.createdDate}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
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
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No material codes found
        </div>
      )}
    </div>
  );
}
