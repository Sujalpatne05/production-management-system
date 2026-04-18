/**
 * Role and Module Mapping System
 * Defines the 9 roles and their access to 23 modules
 */

// Define the 9 roles
export const ROLES = {
  CEO: "CEO",
  FINANCE_MANAGER: "Finance Manager",
  SALES_MANAGER: "Sales Manager",
  PROCUREMENT_MANAGER: "Procurement Manager",
  PRODUCTION_MANAGER: "Production Manager",
  QUALITY_MANAGER: "Quality Manager",
  WAREHOUSE_MANAGER: "Warehouse Manager",
  HR_MANAGER: "HR Manager",
  SYSTEM_ADMINISTRATOR: "System Administrator"
};

// Define the 23 modules
export const MODULES = {
  // Core Modules
  DASHBOARD: "Dashboard",
  USER_MANAGEMENT: "User Management",
  
  // Sales & Orders
  SALES: "Sales",
  ORDERS: "Orders",
  QUOTATIONS: "Quotations",
  CUSTOMERS: "Customers",
  
  // Inventory & Warehouse
  INVENTORY: "Inventory",
  WAREHOUSE: "Warehouse",
  STOCK_MANAGEMENT: "Stock Management",
  
  // Procurement
  PURCHASES: "Purchases",
  SUPPLIERS: "Suppliers",
  
  // Production
  PRODUCTION: "Production",
  QUALITY_CONTROL: "Quality Control",
  WASTE_MANAGEMENT: "Waste Management",
  
  // Finance & Accounting
  ACCOUNTING: "Accounting",
  INVOICING: "Invoicing",
  PAYMENTS: "Payments",
  EXPENSES: "Expenses",
  
  // HR & Payroll
  HR_MANAGEMENT: "HR Management",
  PAYROLL: "Payroll",
  ATTENDANCE: "Attendance",
  
  // Analytics & Reports
  ANALYTICS: "Analytics",
  REPORTS: "Reports"
};

// Role-Module Access Matrix
// Maps each role to the modules they can access
export const ROLE_MODULE_ACCESS = {
  [ROLES.CEO]: [
    MODULES.DASHBOARD,
    MODULES.USER_MANAGEMENT,
    MODULES.SALES,
    MODULES.ORDERS,
    MODULES.QUOTATIONS,
    MODULES.CUSTOMERS,
    MODULES.INVENTORY,
    MODULES.WAREHOUSE,
    MODULES.STOCK_MANAGEMENT,
    MODULES.PURCHASES,
    MODULES.SUPPLIERS,
    MODULES.PRODUCTION,
    MODULES.QUALITY_CONTROL,
    MODULES.WASTE_MANAGEMENT,
    MODULES.ACCOUNTING,
    MODULES.INVOICING,
    MODULES.PAYMENTS,
    MODULES.EXPENSES,
    MODULES.HR_MANAGEMENT,
    MODULES.PAYROLL,
    MODULES.ATTENDANCE,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.FINANCE_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.ACCOUNTING,
    MODULES.INVOICING,
    MODULES.PAYMENTS,
    MODULES.EXPENSES,
    MODULES.PAYROLL,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.SALES_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.SALES,
    MODULES.ORDERS,
    MODULES.QUOTATIONS,
    MODULES.CUSTOMERS,
    MODULES.INVOICING,
    MODULES.PAYMENTS,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.PROCUREMENT_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.PURCHASES,
    MODULES.SUPPLIERS,
    MODULES.PURCHASE_ORDERS,
    MODULES.INVENTORY,
    MODULES.STOCK_MANAGEMENT,
    MODULES.PAYMENTS,
    MODULES.EXPENSES,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.PRODUCTION_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.PRODUCTION,
    MODULES.QUALITY_CONTROL,
    MODULES.WASTE_MANAGEMENT,
    MODULES.INVENTORY,
    MODULES.STOCK_MANAGEMENT,
    MODULES.ORDERS,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.QUALITY_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.QUALITY_CONTROL,
    MODULES.PRODUCTION,
    MODULES.WASTE_MANAGEMENT,
    MODULES.INVENTORY,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.WAREHOUSE_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.WAREHOUSE,
    MODULES.INVENTORY,
    MODULES.STOCK_MANAGEMENT,
    MODULES.PURCHASES,
    MODULES.SALES,
    MODULES.ORDERS,
    MODULES.WASTE_MANAGEMENT,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.HR_MANAGER]: [
    MODULES.DASHBOARD,
    MODULES.HR_MANAGEMENT,
    MODULES.PAYROLL,
    MODULES.ATTENDANCE,
    MODULES.USER_MANAGEMENT,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ],
  
  [ROLES.SYSTEM_ADMINISTRATOR]: [
    MODULES.DASHBOARD,
    MODULES.USER_MANAGEMENT,
    MODULES.SALES,
    MODULES.ORDERS,
    MODULES.QUOTATIONS,
    MODULES.CUSTOMERS,
    MODULES.INVENTORY,
    MODULES.WAREHOUSE,
    MODULES.STOCK_MANAGEMENT,
    MODULES.PURCHASES,
    MODULES.SUPPLIERS,
    MODULES.PRODUCTION,
    MODULES.QUALITY_CONTROL,
    MODULES.WASTE_MANAGEMENT,
    MODULES.ACCOUNTING,
    MODULES.INVOICING,
    MODULES.PAYMENTS,
    MODULES.EXPENSES,
    MODULES.HR_MANAGEMENT,
    MODULES.PAYROLL,
    MODULES.ATTENDANCE,
    MODULES.ANALYTICS,
    MODULES.REPORTS
  ]
};

/**
 * Check if a role has access to a module
 * @param {string} role - The user's role
 * @param {string} module - The module to check access for
 * @returns {boolean} - True if role has access to module
 */
export function hasModuleAccess(role, module) {
  const allowedModules = ROLE_MODULE_ACCESS[role];
  return allowedModules && allowedModules.includes(module);
}

/**
 * Get all modules accessible by a role
 * @param {string} role - The user's role
 * @returns {array} - Array of accessible modules
 */
export function getAccessibleModules(role) {
  return ROLE_MODULE_ACCESS[role] || [];
}

/**
 * Get all available roles
 * @returns {array} - Array of all role names
 */
export function getAllRoles() {
  return Object.values(ROLES);
}

/**
 * Get all available modules
 * @returns {array} - Array of all module names
 */
export function getAllModules() {
  return Object.values(MODULES);
}

/**
 * Validate if a role is valid
 * @param {string} role - The role to validate
 * @returns {boolean} - True if role is valid
 */
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/**
 * Validate if a module is valid
 * @param {string} module - The module to validate
 * @returns {boolean} - True if module is valid
 */
export function isValidModule(module) {
  return Object.values(MODULES).includes(module);
}
