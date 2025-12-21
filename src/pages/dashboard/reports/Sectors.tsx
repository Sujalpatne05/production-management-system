import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/useStore";
import { Factory, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Sectors() {
  const { sectors, deleteSector, updateSector } = useStore();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "created-new" | "created-old">("name-asc");

  const handleDelete = () => {
    if (deleteId) {
      deleteSector(deleteId);
      toast({
        title: "Sector Deleted",
        description: "The sector has been deleted successfully.",
      });
      setDeleteId(null);
    }
  };

  const handleToggleStatus = (id: string, current: "active" | "inactive") => {
    const next = current === "active" ? "inactive" : "active";
    updateSector(id, { status: next });
    toast({
      title: "Status updated",
      description: `Sector status changed to ${next}.`,
    });
  };

  const filteredSectors = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sectors
      .filter((s) => {
        const matchesTerm = !term || s.name.toLowerCase().includes(term) || s.description.toLowerCase().includes(term);
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesTerm && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "created-new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [sectors, search, statusFilter, sortBy]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sectors</h1>
          <p className="text-muted-foreground">Manage production sectors</p>
        </div>
        <Button onClick={() => navigate("/dashboard/reports/sectors/add")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Sector
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <Input
              placeholder="Search sectors by name or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A → Z</SelectItem>
                <SelectItem value="name-desc">Name Z → A</SelectItem>
                <SelectItem value="created-new">Newest first</SelectItem>
                <SelectItem value="created-old">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            Production Sectors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSectors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No sectors found. Adjust filters or add a new sector.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSectors.map((sector) => (
                    <TableRow key={sector.id}>
                      <TableCell className="font-medium">{sector.name}</TableCell>
                      <TableCell>{sector.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={sector.status === "active"}
                            onCheckedChange={() => handleToggleStatus(sector.id, sector.status)}
                            aria-label={`Toggle status for ${sector.name}`}
                          />
                          <Badge variant={sector.status === "active" ? "default" : "secondary"}>
                            {sector.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(sector.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/reports/sectors/edit/${sector.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(sector.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sector.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
