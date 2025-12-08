import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const permissions = [
  { id: "dashboard", label: "Dashboard", group: "General" },
  { id: "production", label: "Production Management", group: "Operations" },
  { id: "sales", label: "Sales Management", group: "Operations" },
  { id: "purchases", label: "Purchase Management", group: "Operations" },
  { id: "inventory", label: "Inventory Management", group: "Operations" },
  { id: "customers", label: "Customer Management", group: "Parties" },
  { id: "suppliers", label: "Supplier Management", group: "Parties" },
  { id: "expenses", label: "Expense Management", group: "Finance" },
  { id: "accounting", label: "Accounting", group: "Finance" },
  { id: "payroll", label: "Payroll Management", group: "Finance" },
  { id: "reports", label: "View Reports", group: "Reports" },
  { id: "users", label: "User Management", group: "Admin" },
  { id: "settings", label: "System Settings", group: "Admin" },
];

const RoleList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roles, updateRole, deleteRole, users } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<typeof roles[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (role: typeof roles[0]) => {
    setEditingRole(role);
    setEditName(role.name);
    setEditPermissions([...role.permissions]);
  };

  const handleSaveEdit = () => {
    if (!editingRole || !editName.trim()) return;
    
    updateRole(editingRole.id, { name: editName, permissions: editPermissions });
    toast({
      title: "Role Updated",
      description: `Role "${editName}" has been updated.`,
    });
    setEditingRole(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    
    const usersWithRole = users.filter(u => u.roleId === deleteId);
    if (usersWithRole.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "This role is assigned to users. Please reassign users first.",
        variant: "destructive",
      });
      setDeleteId(null);
      return;
    }
    
    deleteRole(deleteId);
    toast({
      title: "Role Deleted",
      description: "The role has been deleted.",
    });
    setDeleteId(null);
  };

  const toggleEditPermission = (permissionId: string) => {
    setEditPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Button onClick={() => navigate("/dashboard/users/add-role")}>
          <Plus className="h-4 w-4 mr-2" /> Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {permissions.find(p => p.id === perm)?.label || perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{users.filter(u => u.roleId === role.id).length}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(role)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(role.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                {permissions.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${perm.id}`}
                      checked={editPermissions.includes(perm.id)}
                      onCheckedChange={() => toggleEditPermission(perm.id)}
                    />
                    <Label htmlFor={`edit-${perm.id}`} className="text-sm cursor-pointer">
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleList;