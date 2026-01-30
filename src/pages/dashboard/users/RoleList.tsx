import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { Plus, Search, Pencil, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const { roles, updateRole, deleteRole, users, addRole } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [editingRole, setEditingRole] = useState<typeof roles[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] as string[] });

  const filteredRoles = roles.filter(role => {
    const matchesName = role.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup =
      filterGroup === "all" || role.permissions.some((p) => permissions.find((x) => x.id === p)?.group === filterGroup);
    return matchesName && matchesGroup;
  });

  const totalRoles = roles.length;
  const totalUsers = users.length;
  const assignedRoles = roles.filter((role) => users.some((u) => u.roleId === role.id)).length;

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

  const handleAddRole = () => {
    if (!newRole.name.trim()) {
      toast({ title: "Error", description: "Please enter a role name", variant: "destructive" });
      return;
    }
    addRole({ name: newRole.name, permissions: newRole.permissions });
    toast({ title: "Role Created", description: `Role "${newRole.name}" has been created.` });
    setNewRole({ name: "", permissions: [] });
    setShowAddDialog(false);
  };

  const toggleNewPermission = (permissionId: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const exportToCSV = () => {
    const headers = ["Role", "Permissions", "User Count"];
    const rows = roles.map((role) => [
      role.name,
      role.permissions.join(";"),
      users.filter((u) => u.roleId === role.id).length,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roles.csv";
    a.click();
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
        <div>
          <p className="text-sm text-muted-foreground">Access Control</p>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Role Name *</Label>
                  <Input value={newRole.name} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((perm) => (
                      <div key={perm.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`new-${perm.id}`}
                          checked={newRole.permissions.includes(perm.id)}
                          onCheckedChange={() => toggleNewPermission(perm.id)}
                        />
                        <Label htmlFor={`new-${perm.id}`} className="text-sm cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Total Roles</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-600">{totalRoles}</div></CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Users Assigned</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">{assignedRoles}</div></CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-600">{totalUsers}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by permission group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {[...new Set(permissions.map((p) => p.group))].map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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