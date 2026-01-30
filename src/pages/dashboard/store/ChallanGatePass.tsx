import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Printer } from "lucide-react";

interface Challan {
  id: string;
  challanNo: string;
  challanType: string;
  code: string;
  date: string;
  material: string;
  quantity: number;
  location: string;
  status: "active" | "inactive" | "expired";
}

export default function ChallanGatePass() {
  const { toast } = useToast();
  const [challanType, setChallanType] = useState("outward");
  const [challans, setChallans] = useState<Challan[]>([
    {
      id: "1",
      challanNo: "CHLN-OUT-001",
      challanType: "Outward Gate Challan",
      code: "CODE-0001",
      date: "2026-01-27",
      material: "MS ANGLE 50x50x5 MM",
      quantity: 50,
      location: "GATE-1",
      status: "active",
    },
    {
      id: "2",
      challanNo: "CHLN-IN-001",
      challanType: "Inward Gate Challan",
      code: "CODE-0002",
      date: "2026-01-27",
      material: "Steel Rod",
      quantity: 100,
      location: "GATE-2",
      status: "active",
    },
    {
      id: "3",
      challanNo: "CHLN-RET-001",
      challanType: "Returnable Gate Pass",
      code: "CODE-0003",
      date: "2026-01-27",
      material: "Pallet",
      quantity: 10,
      location: "GATE-1",
      status: "active",
    },
  ]);

  const handleDelete = (id: string) => {
    setChallans(challans.filter((c) => c.id !== id));
    toast({ title: "Challan deleted successfully" });
  };

  const handlePrint = (id: string) => {
    toast({ title: "Printing challan..." });
  };

  const filteredChallans = challans.filter((c) => {
    if (challanType === "all") return true;
    if (challanType === "outward")
      return c.challanType.includes("Outward");
    if (challanType === "inward") return c.challanType.includes("Inward");
    if (challanType === "returnable")
      return c.challanType.includes("Returnable");
    if (challanType === "non-returnable")
      return c.challanType.includes("Non Returnable");
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Challan & Gate Pass Management" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Challans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challans.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outward</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                challans.filter((c) =>
                  c.challanType.includes("Outward")
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inward</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                challans.filter((c) =>
                  c.challanType.includes("Inward")
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gate Passes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {challans.filter((c) => c.challanType.includes("Pass")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={challanType} onValueChange={setChallanType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Challans</SelectItem>
            <SelectItem value="outward">Outward Gate Challan</SelectItem>
            <SelectItem value="inward">Inward Gate Challan</SelectItem>
            <SelectItem value="returnable">Returnable Gate Pass</SelectItem>
            <SelectItem value="non-returnable">Non-Returnable Gate Pass</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Challan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challan No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Gate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallans.map((challan) => (
                <TableRow key={challan.id}>
                  <TableCell className="font-medium">
                    {challan.challanNo}
                  </TableCell>
                  <TableCell className="text-sm">{challan.challanType}</TableCell>
                  <TableCell>{challan.code}</TableCell>
                  <TableCell>{challan.material}</TableCell>
                  <TableCell>{challan.quantity}</TableCell>
                  <TableCell>{challan.location}</TableCell>
                  <TableCell>{challan.date}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                      {challan.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(challan.id)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredChallans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No challans found
        </div>
      )}
    </div>
  );
}
