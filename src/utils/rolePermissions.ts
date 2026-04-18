/**
 * Role-Based Access Control (RBAC) Configuration
 * Maps roles to allowed menu items and modules
 */

export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'sales_manager'
  | 'purchase_manager'
  | 'inventory_manager'
  | 'production_manager'
  | 'accountant'
  | 'hr_manager'
  | 'quality_manager'
  | 'store_manager'
  | 'finance_manager'
  | 'user';

// Map of role names to display names
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  'super_admin': 'Super Admin',
  'admin': 'Admin',
  'sales_manager': 'Sales Manager',
  'purchase_manager': 'Purchase Manager',
  'inventory_manager': 'Inventory Manager',
  'production_manager': 'Production Manager',
  'accountant': 'Accountant',
  'hr_manager': 'HR Manager',
  'quality_manager': 'Quality Manager',
  'store_manager': 'Store Manager',
  'finance_manager': 'Finance Manager',
  'user': 'User',
};

// Define which menu items each role can access
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'super_admin': [
    'Home',
    'Dashboard',
    'Factories',
    'Procurement',
    'Sales',
    'CRM',
    'MRP',
    'Manufacturing',
    'Quality Control',
    'Goods Receipt',
    'Budget Planning',
    'Forecasting',
    'Inventory',
    'Accounting',
    'Store',
    'Approvals',
    'Audit',
    'Accounting Periods',
    'Backup & Restore',
    'PDF Center',
    'Reports',
    'Settings',
  ],
  'admin': [
    'Home',
    'Dashboard',
    'Factories',
    'Procurement',
    'Sales',
    'CRM',
    'MRP',
    'Manufacturing',
    'Quality Control',
    'Goods Receipt',
    'Budget Planning',
    'Forecasting',
    'Inventory',
    'Accounting',
    'Store',
    'Approvals',
    'Audit',
    'Accounting Periods',
    'PDF Center',
    'Reports',
    'Settings',
  ],
  'sales_manager': [
    'Home',
    'Dashboard',
    'Sales',
    'CRM',
    'Orders',
    'Inventory',
    'Reports',
  ],
  'purchase_manager': [
    'Home',
    'Dashboard',
    'Procurement',
    'Inventory',
    'Store',
    'Reports',
  ],
  'inventory_manager': [
    'Home',
    'Dashboard',
    'Inventory',
    'Store',
    'Goods Receipt',
    'Reports',
  ],
  'production_manager': [
    'Home',
    'Dashboard',
    'Manufacturing',
    'MRP',
    'Quality Control',
    'Goods Receipt',
    'Reports',
  ],
  'accountant': [
    'Home',
    'Dashboard',
    'Accounting',
    'Accounting Periods',
    'Reports',
  ],
  'finance_manager': [
    'Home',
    'Dashboard',
    'Accounting',
    'Accounting Periods',
    'Budget Planning',
    'Forecasting',
    'Reports',
  ],
  'hr_manager': [
    'Home',
    'Dashboard',
    'Reports',
  ],
  'quality_manager': [
    'Home',
    'Dashboard',
    'Quality Control',
    'Manufacturing',
    'Reports',
  ],
  'store_manager': [
    'Home',
    'Dashboard',
    'Store',
    'Inventory',
    'Goods Receipt',
    'Reports',
  ],
  'user': [
    'Home',
    'Dashboard',
  ],
};

/**
 * Get the user's role from localStorage
 */
export function getUserRole(): UserRole | null {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.warn('No user data in localStorage');
      return null;
    }
    
    const user = JSON.parse(userStr);
    console.log('Full user object:', user);
    
    // Try different ways to get the role
    let roleName = null;
    
    // Method 1: Check user.roles array (from JWT)
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      const roleObj = user.roles[0];
      roleName = roleObj.role || roleObj.roleName || roleObj.name;
      console.log('Role from roles array:', roleName);
    }
    
    // Method 2: Check user.role directly
    if (!roleName && user.role) {
      roleName = user.role;
      console.log('Role from user.role:', roleName);
    }
    
    // Method 3: Check user.roleId or user.roleName
    if (!roleName && user.roleName) {
      roleName = user.roleName;
      console.log('Role from user.roleName:', roleName);
    }
    
    if (!roleName) {
      console.warn('No role found in user data');
      console.log('User data structure:', JSON.stringify(user, null, 2));
      return null;
    }
    
    // Normalize role name to lowercase with underscores
    const normalizedRole = String(roleName)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/manager/i, 'manager');
    
    console.log('Raw role name:', roleName);
    console.log('Normalized role:', normalizedRole);
    
    // Validate that the role exists in our permissions
    if (normalizedRole in ROLE_PERMISSIONS) {
      console.log('✅ Role found in ROLE_PERMISSIONS');
      return normalizedRole as UserRole;
    } else {
      console.warn('⚠️ Role not found in ROLE_PERMISSIONS:', normalizedRole);
      console.log('Available roles:', Object.keys(ROLE_PERMISSIONS));
      // Still return it - might be a new role
      return normalizedRole as UserRole;
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Check if a user has permission to access a menu item
 */
export function hasMenuPermission(menuTitle: string, userRole?: UserRole | null): boolean {
  const role = userRole || getUserRole();
  
  if (!role) return false;
  
  // Super admin has access to everything
  if (role === 'super_admin') return true;
  
  const allowedMenus = ROLE_PERMISSIONS[role] || [];
  return allowedMenus.includes(menuTitle);
}

/**
 * Filter menu items based on user role
 */
export function filterMenuItemsByRole(menuItems: any[], userRole?: UserRole | null): any[] {
  const role = userRole || getUserRole();
  
  console.log('=== RBAC Filtering ===');
  console.log('Detected role:', role);
  
  if (!role) {
    console.warn('⚠️ No role detected - showing all menus as fallback');
    // Fallback: show all menus if role detection fails
    return menuItems;
  }
  
  // Super admin sees everything
  if (role === 'super_admin') {
    console.log('✅ Super admin detected - showing all menus');
    return menuItems;
  }
  
  const allowedMenus = ROLE_PERMISSIONS[role] || [];
  console.log('Allowed menus for role:', allowedMenus);
  
  if (allowedMenus.length === 0) {
    console.warn('⚠️ No allowed menus found for role:', role);
    console.log('Available roles:', Object.keys(ROLE_PERMISSIONS));
  }
  
  const filtered = menuItems.filter(item => {
    // Always show Home
    if (item.title === 'Home') return true;
    
    // Check if menu item is in allowed list
    const isAllowed = allowedMenus.includes(item.title);
    if (!isAllowed) {
      console.log('Filtering out menu item:', item.title);
    }
    return isAllowed;
  });
  
  console.log('Filtered menu items count:', filtered.length);
  console.log('=== End RBAC Filtering ===');
  return filtered;
}

/**
 * Get display name for a role
 */
export function getRoleDisplayName(role: UserRole | string): string {
  return ROLE_DISPLAY_NAMES[role] || role;
}
