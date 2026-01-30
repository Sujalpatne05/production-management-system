import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ProductionStageList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productionStages, updateProductionStage, deleteProductionStage } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStage, setEditingStage] = useState<typeof productionStages[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", order: 0 });

  const sortedStages = [...productionStages].sort((a, b) => a.order - b.order);
  const filteredStages = sortedStages.filter(stage => stage.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleEdit = (stage: typeof productionStages[0]) => {
    setEditingStage(stage);
    setEditData({ name: stage.name, order: stage.order });
  };

  const handleSaveEdit = () => {
    if (!editingStage) return;
    updateProductionStage(editingStage.id, editData);
    toast({ title: "Stage Updated", description: "Production stage has been updated." });
    setEditingStage(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProductionStage(deleteId);
    toast({ title: "Stage Deleted", description: "Production stage has been deleted." });
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Production Stages</h1>
        <Button onClick={() => navigate("/dashboard/settings/add-stage")}>
          <Plus className="h-4 w-4 mr-2" /> Add Stage
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search stages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStages.map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell>{stage.order}</TableCell>
                  <TableCell className="font-medium">{stage.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(stage)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(stage.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStages.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No stages found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingStage} onOpenChange={() => setEditingStage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Production Stage</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Order</Label><Input type="number" value={editData.order} onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStage(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Stage?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductionStageList;