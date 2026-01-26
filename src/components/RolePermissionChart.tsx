import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";
import { rolePermissions, roleDescriptions, UserRole } from "@/lib/rbac";

interface RolePermissionChartProps {
  role: UserRole;
}

const RolePermissionChart = ({ role }: RolePermissionChartProps) => {
  const permissions = rolePermissions[role];
  const description = roleDescriptions[role];

  const permissionGroups = [
    {
      group: "Core Features",
      permissions: ["dashboard", "crm", "mrp", "production", "sales"],
    },
    {
      group: "Operations",
      permissions: ["purchases", "inventory"],
    },
    {
      group: "Finance & Reports",
      permissions: ["accounting", "reports"],
    },
    {
      group: "System",
      permissions: ["users", "settings", "notifications"],
    },
    {
      group: "Actions",
      permissions: ["create", "edit", "delete", "view"],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">{role.toUpperCase()}</Badge>
          Role Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">{description}</p>
        </div>

        {permissionGroups.map((group) => (
          <div key={group.group}>
            <h4 className="font-semibold text-sm mb-3 text-gray-700">{group.group}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {group.permissions.map((permission) => {
                const allowed =
                  permissions[permission as keyof typeof permissions];
                return (
                  <div
                    key={permission}
                    className={`flex items-center gap-2 p-2 rounded border ${
                      allowed
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    {allowed ? (
                      <Unlock className="w-4 h-4 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm capitalize ${
                        allowed ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {permission}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RolePermissionChart;
