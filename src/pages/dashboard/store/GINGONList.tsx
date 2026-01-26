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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

interface GINEntry {
  id: string;
  ginNo: string;
  poNo: string;
  invoiceNo: string;
  userName: string;
  pickRate: string;
  inwardQty: number;
  shortQty: number;
  excessQty: number;
  creditNote: string;
  date: string;
  status: "pending" | "completed" | "rejected";
}

export default function GINGONList() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [entries, setEntries] = useState<GINEntry[]>([
    {
      id: "1",
      ginNo: "GIN-001",
      poNo: "PO-2026-001",
      invoiceNo: "INV-001",
      userName: "John Doe",
      pickRate: "As per Bill",
      inwardQty: 100,
      shortQty: 5,
      excessQty: 0,
      creditNote: "CN-001",
      date: "2026-01-27",
      status: "completed",
    },
  ]);

  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    toast({ title: "GIN/GON entry deleted" });
  };

  const filteredEntries = entries.filter(
    (e) => filter === "all" || e.status === filter
  );

  return (
    <div className="space-y-6">
      <PageHeader title="GIN/GON (Good Inward & Outward Notes)" />

      <div className="flex gap-4 items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add GIN/GON
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>GIN No</TableHead>
              <TableHead>PO No</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Inward Qty</TableHead>
              <TableHead>Short Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.ginNo}</TableCell>
                <TableCell>{entry.poNo}</TableCell>
                <TableCell>{entry.invoiceNo}</TableCell>
                <TableCell>{entry.userName}</TableCell>
                <TableCell>{entry.inwardQty}</TableCell>
                <TableCell className="text-orange-600">{entry.shortQty}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      entry.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : entry.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.status}
                  </span>
                </TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
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
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No GIN/GON entries found
        </div>
      )}
    </div>
  );
}
