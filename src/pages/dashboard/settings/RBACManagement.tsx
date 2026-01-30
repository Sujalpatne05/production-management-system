import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RolePermissionChart from "@/components/RolePermissionChart";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";
import { roleDescriptions } from "@/lib/rbac";

const RBACManagement = () => {
  const roles = ["admin", "manager", "staff"] as const;

  const roleStats = [
    { role: "admin", label: "Admins", count: 2, color: "text-red-600", bgColor: "bg-red-50" },
    { role: "manager", label: "Managers", count: 5, color: "text-blue-600", bgColor: "bg-blue-50" },
    { role: "staff", label: "Staff", count: 12, color: "text-green-600", bgColor: "bg-green-50" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role-Based Access Control"
        subtitle="Manage user roles and permissions across the application"
      />

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleStats.map((stat) => (
          <Card key={stat.role} className={`border-l-4 ${stat.bgColor}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.count}</p>
                  <p className="text-xs text-gray-500 mt-2 capitalize">
                    {stat.role === "admin"
                      ? "System Administrators"
                      : stat.role === "manager"
                      ? "Department Managers"
                      : "Regular Staff Members"}
                  </p>
                </div>
                <Shield className={`w-8 h-8 opacity-20 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Information Cards */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permission Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            The system uses a role-based access control (RBAC) model with three tiers:
          </p>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role} className="flex items-start gap-3 p-3 bg-white rounded border">
                <Badge className="mt-1 capitalize">
                  {role === "admin" && "bg-red-100 text-red-800"}
                  {role === "manager" && "bg-blue-100 text-blue-800"}
                  {role === "staff" && "bg-green-100 text-green-800"}
                </Badge>
                <div>
                  <h4 className="font-semibold capitalize">{role}</h4>
                  <p className="text-sm text-gray-600">{roleDescriptions[role]}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role} className="lg:col-span-1">
            <RolePermissionChart role={role} />
          </div>
        ))}
      </div>

      {/* Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Implementation Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Admin Role (Full Access)</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Access to all modules and features</li>
              <li>✓ Can create, edit, and delete all records</li>
              <li>✓ User and role management</li>
              <li>✓ System configuration and settings</li>
              <li>✓ View all reports and analytics</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">Manager Role (Limited Admin)</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>✓ Access to core operations (CRM, Sales, Production, Inventory)</li>
              <li>✓ Can create and edit records</li>
              <li>✗ Cannot delete records or manage users</li>
              <li>✗ Cannot access system settings</li>
              <li>✓ View reports and analytics</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Staff Role (View Only)</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Access to core modules (CRM, Sales, Production)</li>
              <li>✗ Cannot create, edit, or delete records</li>
              <li>✗ No access to sensitive modules (Accounting, Inventory)</li>
              <li>✗ Cannot access settings or user management</li>
              <li>✓ Can view reports assigned to them</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RBACManagement;
