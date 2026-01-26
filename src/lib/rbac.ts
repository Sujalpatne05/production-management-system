// Role-Based Access Control Types and Utilities

export type UserRole = "admin" | "manager" | "staff";

export interface RolePermission {
  dashboard: boolean;
  crm: boolean;
  mrp: boolean;
  production: boolean;
  sales: boolean;
  purchases: boolean;
  inventory: boolean;
  accounting: boolean;
  reports: boolean;
  users: boolean;
  settings: boolean;
  notifications: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

export const rolePermissions: Record<UserRole, RolePermission> = {
  admin: {
    dashboard: true,
    crm: true,
    mrp: true,
    production: true,
    sales: true,
    purchases: true,
    inventory: true,
    accounting: true,
    reports: true,
    users: true,
    settings: true,
    notifications: true,
    create: true,
    edit: true,
    delete: true,
    view: true,
  },
  manager: {
    dashboard: true,
    crm: true,
    mrp: true,
    production: true,
    sales: true,
    purchases: true,
    inventory: true,
    accounting: true,
    reports: true,
    users: false,
    settings: false,
    notifications: true,
    create: true,
    edit: true,
    delete: false,
    view: true,
  },
  staff: {
    dashboard: true,
    crm: true,
    mrp: true,
    production: true,
    sales: true,
    purchases: false,
    inventory: false,
    accounting: false,
    reports: false,
    users: false,
    settings: false,
    notifications: true,
    create: false,
    edit: false,
    delete: false,
    view: true,
  },
};

export const roleDescriptions: Record<UserRole, string> = {
  admin: "Full access to all features and settings. Can manage users and system configuration.",
  manager: "Access to most features. Can create and edit data but cannot delete or manage users.",
  staff: "Limited access. Can view data and perform basic tasks. No create, edit, or delete access.",
};

export const hasPermission = (role: UserRole, permission: keyof RolePermission): boolean => {
  return rolePermissions[role][permission];
};

export const hasActionPermission = (
  role: UserRole,
  action: "create" | "view" | "edit" | "delete"
): boolean => {
  return rolePermissions[role][action];
};
