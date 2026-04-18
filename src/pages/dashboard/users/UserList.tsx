import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { Plus, Search, Pencil, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const UserList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultTenantId, setDefaultTenantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", email: "", roleId: "", status: "active" as "active" | "inactive" });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", roleId: "", status: "active" as "active" | "inactive" });

  const unwrapData = <T,>(payload: any): T => {
    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data as T;
    }
    return payload as T;
  };

  const normalizeUser = (user: any) => {
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    const roleIds = userRoles
      .map((r: any) => String(r?.roleId ?? r?.role?.id ?? ""))
      .filter(Boolean);
    const roleNames = userRoles.map((r: any) => r?.role?.name).filter(Boolean);
    const tenantId = userRoles.find((r: any) => r?.tenant?.id)?.tenant?.id;

    return {
      id: user.id,
      name: user.fullName || user.email || "Unknown",
      email: user.email,
      status: user.status || "active",
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-",
      roleIds,
      roleNames,
      tenantId,
    };
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        apiClient.get(API_ENDPOINTS.USERS.LIST),
        apiClient.get(API_ENDPOINTS.ROLES.LIST),
      ]);
      const usersData = unwrapData<any[]>(usersResponse);
      const rolesData = unwrapData<any[]>(rolesResponse);
      const normalizedUsers = Array.isArray(usersData) ? usersData.map(normalizeUser) : [];

      setUsers(normalizedUsers);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDefaultTenantId(normalizedUsers.find((u) => u.tenantId)?.tenantId || null);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load users", description: "Please check your backend connection.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resolveTenantId = (tenantId?: string | null) => {
    if (tenantId) return tenantId;
    if (defaultTenantId) return defaultTenantId;
    if (typeof window !== "undefined") {
      const storedTenant = localStorage.getItem("tenant");
      if (storedTenant) {
        try {
          const parsed = JSON.parse(storedTenant);
          if (parsed?.id) return parsed.id as string;
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const assignUserRole = async (userId: string, roleId: string, tenantId?: string | null) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (!resolvedTenantId) {
      return;
    }
    await apiClient.post(API_ENDPOINTS.USERS.ASSIGN_ROLES, {
      userId,
      tenantId: resolvedTenantId,
      roleIds: [Number(roleId)],
    });
  };

  const addUser = async (payload: { name: string; email: string; roleId: string; status: "active" | "inactive" }) => {
    const created = await apiClient.post(API_ENDPOINTS.USERS.CREATE, {
      email: payload.email,
      fullName: payload.name,
      status: payload.status,
    });
    const createdUser = unwrapData<any>(created);
    if (payload.roleId) {
      await assignUserRole(createdUser.id, payload.roleId, defaultTenantId);
    }
    await loadUsers();
  };

  const updateUser = async (
    userId: string,
    payload: { name: string; email: string; roleId: string; status: "active" | "inactive" },
    tenantId?: string | null
  ) => {
    await apiClient.put(API_ENDPOINTS.USERS.UPDATE.replace(":id", userId), {
      email: payload.email,
      fullName: payload.name,
      status: payload.status,
    });
    if (payload.roleId) {
      await assignUserRole(userId, payload.roleId, tenantId ?? defaultTenantId);
    }
    await loadUsers();
  };

  const deleteUser = async (userId: string) => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE.replace(":id", userId));
    await loadUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole =
      roleFilter === "all" || (Array.isArray(user.roleIds) && user.roleIds.includes(roleFilter));
    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  const totalRoles = roles.length;

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => String(r.id) === roleId);
    return role?.name || "Unknown";
  };

  const getUserRoleLabel = (user: any) => {
    if (Array.isArray(user.roleNames) && user.roleNames.length > 0) {
      return user.roleNames.join(", ");
    }
    if (Array.isArray(user.roleIds) && user.roleIds.length > 0) {
      return getRoleName(user.roleIds[0]);
    }
    return "Unassigned";
  };

  const handleEdit = (user: typeof users[0]) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      roleId: Array.isArray(user.roleIds) && user.roleIds.length > 0 ? user.roleIds[0] : "",
      status: user.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, editData, editingUser.tenantId);
      toast({
        title: "User Updated",
        description: "User details have been updated.",
      });
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        description: "Unable to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast({
        title: "User Deleted",
        description: "The user has been deleted.",
      });
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: "Unable to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.roleId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      await addUser(newUser);
      toast({ title: "User Created", description: `User "${newUser.name}" has been added.` });
      setNewUser({ name: "", email: "", roleId: "", status: "active" });
      setShowAddDialog(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Create failed", description: "Unable to add user.", variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Status", "Created At"];
    const rows = users.map((u) => [u.name, u.email, getUserRoleLabel(u), u.status, u.createdAt]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Access & People</p>
          <h1 className="text-3xl font-bold">User Directory</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-600">{totalUsers}</div></CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Active</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">{activeUsers}</div></CardContent>
        </Card>
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Inactive</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-orange-600">{inactiveUsers}</div></CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-700">Roles</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-600">{totalRoles}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getUserRoleLabel(user)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.status === "active" ? "bg-green-500/20 text-green-700" : "bg-muted text-muted-foreground"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(user.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editData.roleId} onValueChange={(value) => setEditData({ ...editData, roleId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editData.status} onValueChange={(value: "active" | "inactive") => setEditData({ ...editData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user.
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

export default UserList;