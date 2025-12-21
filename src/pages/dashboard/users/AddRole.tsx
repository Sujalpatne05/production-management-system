import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

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

const AddRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRole } = useStore();
  
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const selectAll = () => {
    setSelectedPermissions(permissions.map(p => p.id));
  };

  const clearAll = () => {
    setSelectedPermissions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      });
      return;
    }

    addRole({
      name,
      permissions: selectedPermissions,
    });

    toast({
      title: "Role Created",
      description: `Role "${name}" has been created successfully.`,
    });

    navigate("/dashboard/users/roles");
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.group]) acc[perm.group] = [];
    acc[perm.group].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Role</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Permissions</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <Card key={group}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">{group}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {perms.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={perm.id}
                            checked={selectedPermissions.includes(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id)}
                          />
                          <Label htmlFor={perm.id} className="text-sm cursor-pointer">
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Create Role</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard/users/roles")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRole;