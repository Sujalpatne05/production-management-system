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

const CurrencyList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currencies, updateCurrency, deleteCurrency } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCurrency, setEditingCurrency] = useState<typeof currencies[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", code: "", symbol: "", rate: 1 });

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (currency: typeof currencies[0]) => {
    setEditingCurrency(currency);
    setEditData({ name: currency.name, code: currency.code, symbol: currency.symbol, rate: currency.rate });
  };

  const handleSaveEdit = () => {
    if (!editingCurrency) return;
    updateCurrency(editingCurrency.id, editData);
    toast({ title: "Currency Updated", description: "Currency has been updated." });
    setEditingCurrency(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCurrency(deleteId);
    toast({ title: "Currency Deleted", description: "Currency has been deleted." });
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Currencies</h1>
        <Button onClick={() => navigate("/dashboard/settings/add-currency")}>
          <Plus className="h-4 w-4 mr-2" /> Add Currency
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search currencies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCurrencies.map((currency) => (
                <TableRow key={currency.id}>
                  <TableCell className="font-medium">{currency.name}</TableCell>
                  <TableCell>{currency.code}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>{currency.rate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(currency)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(currency.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCurrencies.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No currencies found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingCurrency} onOpenChange={() => setEditingCurrency(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Currency</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Code</Label><Input value={editData.code} onChange={(e) => setEditData({ ...editData, code: e.target.value })} /></div>
            <div className="space-y-2"><Label>Symbol</Label><Input value={editData.symbol} onChange={(e) => setEditData({ ...editData, symbol: e.target.value })} /></div>
            <div className="space-y-2"><Label>Exchange Rate</Label><Input type="number" step="0.0001" value={editData.rate} onChange={(e) => setEditData({ ...editData, rate: parseFloat(e.target.value) || 1 })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCurrency(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Currency?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CurrencyList;