const resolveEnv = (key: string, fallback?: string) => {
  const viteEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env?.[key] : undefined;
  const nodeEnv = typeof process !== 'undefined' ? (process as any).env?.[key] : undefined;
  return (viteEnv ?? nodeEnv ?? fallback) as string | undefined;
};

// API Configuration
export const API_CONFIG = {
  // API Backend Configuration
  API_URL:
    resolveEnv('VITE_API_URL') ||
    resolveEnv('REACT_APP_API_URL') ||
    'http://localhost:3000/api',
  BASE_URL:
    resolveEnv('VITE_BASE_URL') ||
    resolveEnv('REACT_APP_BASE_URL') ||
    'http://localhost:3000',
  WS_URL:
    resolveEnv('VITE_WS_URL') ||
    resolveEnv('REACT_APP_WS_URL') ||
    'ws://localhost:3000',

  // Feature Flags
  ENABLE_API: true,
  ENABLE_WEBSOCKET: true,
  ENABLE_SERVICE_WORKER: false,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    GET: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    ASSIGN_ROLES: '/users/assign-roles',
  },

  // Roles & Permissions
  ROLES: {
    LIST: '/roles',
    GET: '/roles/:id',
    CREATE: '/roles',
    UPDATE: '/roles/:id',
    DELETE: '/roles/:id',
    ASSIGN_PERMISSIONS: '/roles/assign-permissions',
  },
  
  // Tenants
  TENANTS: {
    LIST: '/tenants',
    GET: '/tenants/:id',
    CREATE: '/tenants',
    UPDATE: '/tenants/:id',
    DELETE: '/tenants/:id',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    GET: '/orders/:id',
    CREATE: '/orders',
    UPDATE: '/orders/:id',
    DELETE: '/orders/:id',
    STATS: '/orders/stats/:tenantId',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    GET: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    CATEGORIES: '/product-categories',
  },
  
  // Production
  PRODUCTION: {
    LIST: '/productions',
    GET: '/productions/:id',
    CREATE: '/productions',
    UPDATE: '/productions/:id',
    DELETE: '/productions/:id',
    STATS: '/productions/stats/:tenantId',
    LOSSES: '/production-losses',
    STAGES: '/production-stages',
  },
  
  // Inventory
  STOCK: {
    LIST: '/stock',
    GET: '/stock/:id',
    UPDATE: '/stock/:id',
  },
  
  // Parties (Customers & Suppliers)
  CUSTOMERS: {
    LIST: '/customers',
    GET: '/customers/:id',
    CREATE: '/customers',
    UPDATE: '/customers/:id',
    DELETE: '/customers/:id',
  },
  SUPPLIERS: {
    LIST: '/suppliers',
    GET: '/suppliers/:id',
    CREATE: '/suppliers',
    UPDATE: '/suppliers/:id',
    DELETE: '/suppliers/:id',
  },
  
  // Sales & Purchases
  SALES: {
    LIST: '/sales',
    GET: '/sales/:id',
    CREATE: '/sales',
    UPDATE: '/sales/:id',
    DELETE: '/sales/:id',
  },
  PURCHASES: {
    LIST: '/purchases',
    GET: '/purchases/:id',
    CREATE: '/purchases',
    UPDATE: '/purchases/:id',
    DELETE: '/purchases/:id',
  },
  
  // Accounting
  ACCOUNTING: {
    ACCOUNTS: '/accounting/accounts',
    TRANSACTIONS: '/accounting/transactions',
    REPORTS: '/accounting/reports',
  },
  
  // Reports
  REPORTS: {
    LIST: '/reports',
    GET: '/reports/:id',
    GENERATE: '/reports/generate',
  },

  // Forecasting
  FORECAST: {
    LIST: '/forecast',
    CREATE: '/forecast',
    GET: '/forecast/:id',
    DASHBOARD: '/forecast/dashboard',
  },

  // Quality Control
  QC: {
    TEMPLATES: '/qc/templates',
    INSPECTIONS: '/qc/inspections',
    NON_CONFORMANCE: '/qc/non-conformance',
    DASHBOARD: '/qc/dashboard',
  },
};

// Mock API responses
export const mockApiResponse = (data: any) => {
  return Promise.resolve({ data, success: true });
};
