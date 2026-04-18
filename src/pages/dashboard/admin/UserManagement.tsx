import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { CompanyAdminUserService, CompanyUser } from '@/services/companyAdminUserService';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

const BUSINESS_ROLES = [
  'CEO',
  'Finance Manager',
  'Sales Manager',
  'Procurement Manager',
  'Production Manager',
  'Quality Manager',
  'Warehouse Manager',
  'HR Manager',
  'System Administrator'
];

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', role: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  // User limits
  const [userCount, setUserCount] = useState(0);
  const [maxUsers, setMaxUsers] = useState(0);
  const [availableSlots, setAvailableSlots] = useState(0);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await CompanyAdminUserService.getUsers(100, 0);
        console.log('Users response:', response);
        setUsers(response.data || []);
        setUserCount(response.userCount || 0);
        setMaxUsers(response.maxUsers || 10);
        setAvailableSlots(response.availableSlots || 0);
      } catch (error: any) {
        console.error('Error loading users:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [toast]);

  // Validation
  const validateForm = (data: FormData): boolean => {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.role) {
      errors.role = 'Role is required';
    }

    if (!data.password || data.password.trim().length === 0) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add user
  const handleAddUser = async () => {
    if (!validateForm(formData)) return;

    try {
      await CompanyAdminUserService.createUser(formData);
      toast({
        title: 'Success',
        description: `User "${formData.name}" has been created`,
      });
      setShowAddDialog(false);
      setFormData({ name: '', email: '', role: '', password: '' });
      setFormErrors({});
      
      // Reload users
      const response = await CompanyAdminUserService.getUsers(100, 0);
      setUsers(response.data || []);
      setUserCount(response.userCount || 0);
      setMaxUsers(response.maxUsers || 10);
      setAvailableSlots(response.availableSlots || 0);
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create user';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Edit user
  const handleEditUser = (user: CompanyUser) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setFormErrors({});
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUserId) return;
    if (!validateForm(formData)) return;

    try {
      await CompanyAdminUserService.updateUser(editingUserId, formData);
      toast({
        title: 'Success',
        description: 'User has been updated',
      });
      setShowEditDialog(false);
      setEditingUserId(null);
      setFormData({ name: '', email: '', role: '' });
      setFormErrors({});
      
      // Reload users
      const response = await CompanyAdminUserService.getUsers(100, 0);
      setUsers(response.data || []);
      setUserCount(response.userCount || 0);
      setMaxUsers(response.maxUsers || 10);
      setAvailableSlots(response.availableSlots || 0);
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update user';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!deletingUserId) return;

    try {
      await CompanyAdminUserService.deleteUser(deletingUserId);
      toast({
        title: 'Success',
        description: 'User has been deleted',
      });
      setShowDeleteDialog(false);
      setDeletingUserId(null);
      
      // Reload users
      const response = await CompanyAdminUserService.getUsers(100, 0);
      setUsers(response.data || []);
      setUserCount(response.userCount || 0);
      setMaxUsers(response.maxUsers || 10);
      setAvailableSlots(response.availableSlots || 0);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to delete user';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Filter users
  const filteredUsers = Array.isArray(users) ? users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const isUserLimitReached = userCount >= maxUsers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Company Administration</p>
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Button
          onClick={() => {
            setFormData({ name: '', email: '', role: '', password: '' });
            setFormErrors({});
            setShowAddDialog(true);
          }}
          disabled={isUserLimitReached}
        >
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      {/* User Limit Warning */}
      {isUserLimitReached && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            User limit reached: {userCount}/{maxUsers} users. Please upgrade your plan to add more users.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700">Current Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {userCount}/{maxUsers}
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Array.isArray(users) ? users.filter((u) => u.status === 'active').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700">Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {Array.isArray(users) ? users.filter((u) => u.status === 'inactive').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700">Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{availableSlots}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
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
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {users.length === 0 ? 'No users found. Add your first user to get started.' : 'No users match your search.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === 'active'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingUserId(user.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Full Name *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={formErrors.name ? 'border-destructive' : ''}
              />
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email *</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className={formErrors.email ? 'border-destructive' : ''}
              />
              {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className={formErrors.role ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-password">Password *</Label>
              <Input
                id="add-password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className={formErrors.password ? 'border-destructive' : ''}
              />
              {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={formErrors.name ? 'border-destructive' : ''}
              />
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className={formErrors.email ? 'border-destructive' : ''}
              />
              {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className={formErrors.role ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will deactivate the user. They will no longer be able to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
