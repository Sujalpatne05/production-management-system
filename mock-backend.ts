// Mock Backend Server for Development
// This provides API responses without requiring Docker/PostgreSQL

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

type Request = express.Request;
type Response = express.Response;

const app = express();
const PORT = 3000;
const JWT_SECRET = 'dev-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
let users = [
  {
    id: 'user-1',
    email: 'superadmin@system.com',
    fullName: 'Superadmin User',
    roles: ['Superadmin'],
    status: 'active'
  },
  {
    id: 'user-2',
    email: 'admin@demo.com',
    fullName: 'Admin User',
    roles: ['Admin'],
    status: 'active'
  },
  {
    id: 'user-3',
    email: 'user@demo.com',
    fullName: 'Regular User',
    roles: ['User'],
    status: 'active'
  }
];

let orders = [
  {
    id: 'order-1',
    tenantId: 'demo-tenant-id',
    customerId: 'cust-1',
    orderNumber: 'ORD-001',
    date: '2026-02-01',
    status: 'confirmed',
    totalAmount: 5000,
    items: [
      { id: 'item-1', productId: 'prod-1', quantity: 10, unitPrice: 500, totalPrice: 5000 }
    ]
  }
];

let products = [
  {
    id: 'prod-1',
    tenantId: 'demo-tenant-id',
    categoryId: 'cat-1',
    name: 'Smart Speaker',
    sku: 'SPK-001',
    unitOfMeasure: 'piece',
    cost: 25,
    sellingPrice: 49.99,
    reorderLevel: 20
  },
  {
    id: 'prod-2',
    tenantId: 'demo-tenant-id',
    categoryId: 'cat-1',
    name: 'Office Chair',
    sku: 'CHR-001',
    unitOfMeasure: 'piece',
    cost: 80,
    sellingPrice: 199.99,
    reorderLevel: 10
  }
];

let customers = [
  {
    id: 'cust-1',
    tenantId: 'demo-tenant-id',
    name: 'ABC Corporation',
    email: 'contact@abc.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA'
  }
];

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// CRM Leads
let crmLeads = [
  {
    id: 'lead-1',
    name: 'Rajesh Kumar',
    company: 'Tech Solutions Inc',
    email: 'rajesh@techsol.com',
    phone: '+91-9876543210',
    status: 'New',
    value: '₹5,00,000',
    createdDate: '2026-01-20'
  },
  {
    id: 'lead-2',
    name: 'Priya Sharma',
    company: 'Global Industries',
    email: 'priya@global.com',
    phone: '+91-9876543211',
    status: 'Won',
    value: '₹12,50,000',
    createdDate: '2026-01-15'
  }
];

// CRM Follow-ups
let crmFollowUps = [
  {
    id: 'fu-1',
    leadName: 'Rajesh Kumar',
    followUpDate: '2026-01-27',
    followUpTime: '10:00 AM',
    notes: 'Discuss pricing and timeline',
    status: 'Scheduled',
    type: 'Call'
  },
  {
    id: 'fu-2',
    leadName: 'Priya Sharma',
    followUpDate: '2026-01-26',
    followUpTime: '02:00 PM',
    notes: 'Send proposal and check feedback',
    status: 'Pending',
    type: 'Email'
  },
  {
    id: 'fu-3',
    leadName: 'Neha Gupta',
    followUpDate: '2026-01-25',
    followUpTime: '11:00 AM',
    notes: 'Final negotiation meeting',
    status: 'Completed',
    type: 'Meeting'
  }
];

// Work Orders
let workOrders = [
  {
    id: 'wo-1',
    workOrderNo: 'WO-2026-001',
    productName: 'Product A',
    plannedQty: 1000,
    producedQty: 950,
    scrapQty: 30,
    startDate: '2026-01-20',
    endDate: '2026-01-26',
    status: 'Completed',
    efficiency: 95
  },
  {
    id: 'wo-2',
    workOrderNo: 'WO-2026-002',
    productName: 'Product B',
    plannedQty: 500,
    producedQty: 450,
    scrapQty: 15,
    startDate: '2026-01-22',
    endDate: '2026-01-28',
    status: 'In Progress',
    efficiency: 90
  },
  {
    id: 'wo-3',
    workOrderNo: 'WO-2026-003',
    productName: 'Product C',
    plannedQty: 750,
    producedQty: 0,
    scrapQty: 0,
    startDate: '2026-01-27',
    endDate: '2026-02-02',
    status: 'Planning',
    efficiency: 0
  }
];

// Factories/Outlets
let factories = [
  { id: 'fac-1', code: 'FAC-001', name: 'Main Branch', phone: '123-456-7890', email: 'main@company.com', address: '123 Main St, City', status: 'active', manager: 'John Doe', storageCapacity: 50000, currentInventory: 35000, machinesCount: 15, employeesCount: 45, productionLines: 3, efficiency: 92 },
  { id: 'fac-2', code: 'FAC-002', name: 'Downtown Store', phone: '098-765-4321', email: 'downtown@company.com', address: '456 Downtown Ave, City', status: 'active', manager: 'Jane Smith', storageCapacity: 30000, currentInventory: 22000, machinesCount: 8, employeesCount: 28, productionLines: 2, efficiency: 88 }
];

// Roles
let roles = [
  { id: 'role-1', name: 'Admin', permissions: ['create', 'read', 'update', 'delete'] },
  { id: 'role-2', name: 'Operator', permissions: ['read', 'update'] }
];

// Departments
let departments = [
  { id: 'dept-1', name: 'Production', factoryId: 'fac-1', manager: 'Mike Johnson', capacity: 500 },
  { id: 'dept-2', name: 'Quality Control', factoryId: 'fac-1', manager: 'Sarah Williams', capacity: 100 },
  { id: 'dept-3', name: 'Warehouse', factoryId: 'fac-1', manager: 'Robert Brown', capacity: 50000 }
];

// Waste Management
let rmWaste = [
  { id: 'rm-w-1', date: '2026-01-20', quantity: 50, unit: 'KG', description: 'Defective raw material', category: 'Raw Material' }
];
let productWaste = [
  { id: 'prod-w-1', date: '2026-01-21', quantity: 10, unit: 'PCS', description: 'Failed QC inspection', category: 'Final Product' }
];

// Settings
let units = [
  { id: 'unit-1', name: 'Kilogram', code: 'KG' },
  { id: 'unit-2', name: 'Piece', code: 'PCS' }
];
let productionStages = [
  { id: 'stage-1', name: 'Raw Material Receipt', sequence: 1 },
  { id: 'stage-2', name: 'Production', sequence: 2 }
];
let currencies = [
  { id: 'curr-1', code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { id: 'curr-2', code: 'USD', name: 'US Dollar', symbol: '$' }
];

// Material Codes
let materialCodes = [
  { id: 'mat-1', code: 'MAT-001', name: 'Steel Sheet', category: 'Raw Material' },
  { id: 'mat-2', code: 'MAT-002', name: 'Aluminum Rod', category: 'Raw Material' }
];

// Raw Material Stock
let rmStock = [
  { id: 'rms-1', materialCode: 'MAT-001', quantity: 1000, location: 'A1', unit: 'KG' }
];

// Product Stock
let productStock = [
  { id: 'ps-1', productId: 'prod-1', quantity: 500, location: 'B2', unit: 'PCS' }
];

// Suppliers & Vendors
let suppliers = [
  { id: 'sup-1', name: 'ABC Supplies', contactPerson: 'Mr. Sharma', phone: '123-456-7890', email: 'abc@supplies.com', address: 'Supplier Lane, City' }
];
let vendors = [
  { id: 'vend-1', name: 'XYZ Vendors', contactPerson: 'Ms. Patel', phone: '098-765-4321', email: 'xyz@vendors.com', address: 'Vendor Street, City' }
];

// BOM (Bill of Materials)
let bom = [
  { id: 'bom-1', code: 'BOM-001', productId: 'prod-1', items: [{ materialCode: 'MAT-001', quantity: 5 }], version: 1 }
];

// Machines
let machines = [
  { id: 'mach-1', code: 'MACH-001', name: 'CNC Machine A', type: 'CNC', status: 'active', factoryId: 'fac-1' },
  { id: 'mach-2', code: 'MACH-002', name: 'Lathe Machine B', type: 'Lathe', status: 'active', factoryId: 'fac-1' }
];

// Shifts
let shifts = [
  { id: 'shift-1', name: 'Morning Shift', startTime: '06:00', endTime: '14:00', factoryId: 'fac-1' },
  { id: 'shift-2', name: 'Evening Shift', startTime: '14:00', endTime: '22:00', factoryId: 'fac-1' }
];

// Attendance
let attendance = [
  { id: 'att-1', userId: 'user-1', date: '2026-01-20', status: 'present', shiftId: 'shift-1' },
  { id: 'att-2', userId: 'user-2', date: '2026-01-20', status: 'present', shiftId: 'shift-2' }
];

// Employees
let employees = [
  { id: 'emp-1', name: 'John Doe', designation: 'Operator', department: 'dept-1', phone: '123-456-7890', email: 'john@company.com', status: 'active' },
  { id: 'emp-2', name: 'Jane Smith', designation: 'Quality Inspector', department: 'dept-2', phone: '098-765-4321', email: 'jane@company.com', status: 'active' }
];

// Asset Management
let assets = [
  { id: 'asset-1', code: 'ASSET-001', name: 'Industrial Oven', category: 'Equipment', status: 'active', factoryId: 'fac-1', purchaseDate: '2025-01-15', value: 500000 }
];

// Quality Control mock data
let qcTemplates = [
  { id: 'tpl-1', name: 'Incoming Materials', type: 'incoming', updatedAt: new Date().toISOString() },
  { id: 'tpl-2', name: 'In-Process Check', type: 'in-process', updatedAt: new Date().toISOString() },
  { id: 'tpl-3', name: 'Final Inspection', type: 'final', updatedAt: new Date().toISOString() }
];

let qcInspections = [
  {
    id: 'insp-1',
    status: 'passed',
    inspectionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    template: { name: 'Final Inspection' }
  }
];

let nonConformances = [
  {
    id: 'ncr-1',
    reportNo: 'NCR-2026-001',
    severity: 'medium',
    status: 'open',
    createdAt: new Date().toISOString()
  }
];

// Approvals & Unlock Requests mock data
let approvals = [
  {
    id: 'apr-1',
    entityType: 'PurchaseOrder',
    entityId: 'PO-2026-001',
    requesterId: 'admin@demo.com',
    approverId: undefined,
    level: 1,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    respondedAt: undefined,
    comments: undefined,
    requestType: 'approval'
  }
];

let unlockRequests = [
  {
    id: 'unlock-1',
    entityType: 'Invoice',
    entityId: 'INV-2026-004',
    requesterId: 'manager@demo.com',
    approverId: undefined,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    respondedAt: undefined,
    reason: 'Correction required',
    approvalLevel: 'level2',
    impactArea: 'Moderate',
    requestType: 'unlock'
  }
];

// Audit mock data
let auditLogs = [
  {
    id: 'log-1',
    userId: 'admin@demo.com',
    entityType: 'Order',
    entityId: 'ORD-001',
    action: 'create',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  }
];

let entityHistory = [
  {
    id: 'ent-1',
    entityType: 'Order',
    entityId: 'ORD-001',
    changes: [
      {
        id: 'chg-1',
        action: 'create',
        userId: 'admin@demo.com',
        timestamp: new Date().toISOString(),
        oldValue: null,
        newValue: { status: 'confirmed', total: 5000 }
      }
    ]
  }
];

// Accounting periods
let accountingPeriods = [
  {
    id: 'period-1',
    tenantId: 'default',
    name: 'Jan 2026',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    status: 'open',
    notes: ''
  },
  {
    id: 'period-2',
    tenantId: 'default',
    name: 'Feb 2026',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    status: 'open',
    notes: ''
  }
];

// Budget / Forecast / GRN
let budgets = [
  {
    id: 'budget-1',
    name: 'Q1 Operations',
    budgetPeriod: 'quarterly',
    totalBudget: 250000,
    totalActual: 90000,
    status: 'active'
  }
];

let forecasts = [
  {
    id: 'fc-1',
    name: 'Q1 Demand',
    forecastMethod: 'historical',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    lineItems: [],
    status: 'draft'
  }
];

let grns = [
  {
    id: 'grn-1',
    grnNo: 'GRN-2026-001',
    purchase: { poNo: 'PO-2026-001', supplier: { name: 'Global Supplies Inc' } },
    totalQuantity: 100,
    receivedDate: '2026-02-01',
    status: 'accepted'
  }
];

// Auth Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, roles: user.roles },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    accessToken: token,
    refreshToken: refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      tenant: {
        id: 'demo-tenant-id',
        name: 'Demo Company'
      }
    }
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  const newUser = {
    id: 'user-' + Date.now(),
    email,
    fullName,
    roles: ['User'],
    status: 'active'
  };

  users.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email, roles: newUser.roles },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    accessToken: token,
    refreshToken: jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' }),
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      roles: newUser.roles,
      tenant: { id: 'demo-tenant-id', name: 'Demo Company' }
    }
  });
});

app.post('/api/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newToken = jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      accessToken: newToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        tenant: { id: 'demo-tenant-id', name: 'Demo Company' }
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Order Endpoints
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder = {
    id: 'order-' + Date.now(),
    tenantId: 'demo-tenant-id',
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  Object.assign(order, req.body, { updatedAt: new Date().toISOString() });
  res.json(order);
});

app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  orders.splice(index, 1);
  res.status(204).send();
});

app.get('/api/orders/stats/:tenantId', (req: Request, res: Response) => {
  res.json({
    totalOrders: orders.length,
    totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    byStatus: {
      draft: orders.filter(o => o.status === 'draft').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      completed: orders.filter(o => o.status === 'completed').length
    }
  });
});

// Product Endpoints
app.get('/api/products', (req: Request, res: Response) => {
  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct = {
    id: 'prod-' + Date.now(),
    tenantId: 'demo-tenant-id',
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  Object.assign(product, req.body, { updatedAt: new Date().toISOString() });
  res.json(product);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

app.get('/api/product-categories', (req: Request, res: Response) => {
  res.json([
    { id: 'cat-1', name: 'Electronics', description: 'Electronic products' },
    { id: 'cat-2', name: 'Furniture', description: 'Furniture items' },
    { id: 'cat-3', name: 'Textiles', description: 'Textile products' }
  ]);
});

// Customer Endpoints
app.get('/api/customers', (req: Request, res: Response) => {
  res.json(customers);
});

app.get('/api/customers/:id', (req: Request, res: Response) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

app.post('/api/customers', (req: Request, res: Response) => {
  const newCustomer = {
    id: 'cust-' + Date.now(),
    tenantId: 'demo-tenant-id',
    ...req.body
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// CRM Leads Endpoints
app.get('/api/crm/leads', (req: Request, res: Response) => {
  res.json(crmLeads);
});

app.post('/api/crm/leads', (req: Request, res: Response) => {
  const newLead = {
    id: generateId('lead'),
    name: req.body.name,
    company: req.body.company,
    email: req.body.email,
    phone: req.body.phone,
    status: req.body.status || 'New',
    value: req.body.value || '',
    createdDate: new Date().toISOString().split('T')[0]
  };
  crmLeads.unshift(newLead);
  res.status(201).json(newLead);
});

app.put('/api/crm/leads/:id', (req: Request, res: Response) => {
  const lead = crmLeads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  Object.assign(lead, req.body);
  res.json(lead);
});

app.delete('/api/crm/leads/:id', (req: Request, res: Response) => {
  const index = crmLeads.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lead not found' });
  crmLeads.splice(index, 1);
  res.status(204).send();
});

// Work Orders Endpoints
app.get('/api/mrp/work-orders', (req: Request, res: Response) => {
  res.json(workOrders);
});

app.post('/api/mrp/work-orders', (req: Request, res: Response) => {
  const newWO = {
    id: generateId('wo'),
    workOrderNo: req.body.workOrderNo,
    productName: req.body.productName,
    plannedQty: req.body.plannedQty,
    producedQty: req.body.producedQty || 0,
    scrapQty: req.body.scrapQty || 0,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    status: req.body.status || 'Planning',
    efficiency: req.body.efficiency || 0
  };
  workOrders.unshift(newWO);
  res.status(201).json(newWO);
});

app.put('/api/mrp/work-orders/:id', (req: Request, res: Response) => {
  const wo = workOrders.find(w => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found' });
  Object.assign(wo, req.body);
  res.json(wo);
});

app.delete('/api/mrp/work-orders/:id', (req: Request, res: Response) => {
  const index = workOrders.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Work order not found' });
  workOrders.splice(index, 1);
  res.status(204).send();
});

// CRM Follow-ups Endpoints
app.get('/api/crm/follow-ups', (req: Request, res: Response) => {
  res.json(crmFollowUps);
});

app.post('/api/crm/follow-ups', (req: Request, res: Response) => {
  const newFollowUp = {
    id: generateId('fu'),
    leadName: req.body.leadName,
    followUpDate: req.body.followUpDate,
    followUpTime: req.body.followUpTime,
    notes: req.body.notes,
    status: req.body.status || 'Scheduled',
    type: req.body.type
  };
  crmFollowUps.unshift(newFollowUp);
  res.status(201).json(newFollowUp);
});

app.put('/api/crm/follow-ups/:id', (req: Request, res: Response) => {
  const fu = crmFollowUps.find(f => f.id === req.params.id);
  if (!fu) return res.status(404).json({ error: 'Follow-up not found' });
  Object.assign(fu, req.body);
  res.json(fu);
});

app.delete('/api/crm/follow-ups/:id', (req: Request, res: Response) => {
  const index = crmFollowUps.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Follow-up not found' });
  crmFollowUps.splice(index, 1);
  res.status(204).send();
});

// Factories Endpoints
app.get('/api/factories', (req: Request, res: Response) => res.json(factories));
app.get('/api/factories/:id', (req: Request, res: Response) => {
  const factory = factories.find(f => f.id === req.params.id);
  res.json(factory || { error: 'Factory not found' });
});
app.post('/api/factories', (req: Request, res: Response) => {
  const newFactory = { ...req.body, id: generateId('fac') };
  factories.push(newFactory);
  res.status(201).json(newFactory);
});
app.put('/api/factories/:id', (req: Request, res: Response) => {
  const factory = factories.find(f => f.id === req.params.id);
  if (!factory) return res.status(404).json({ error: 'Factory not found' });
  Object.assign(factory, req.body);
  res.json(factory);
});
app.delete('/api/factories/:id', (req: Request, res: Response) => {
  const index = factories.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Factory not found' });
  factories.splice(index, 1);
  res.status(204).send();
});

// Users Endpoints
app.get('/api/users', (req: Request, res: Response) => res.json(users));
app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  res.json(user || { error: 'User not found' });
});
app.post('/api/users', (req: Request, res: Response) => {
  const newUser = { ...req.body, id: generateId('user') };
  users.push(newUser);
  res.status(201).json(newUser);
});
app.put('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  res.json(user);
});
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

// Roles Endpoints
app.get('/api/roles', (req: Request, res: Response) => res.json(roles));
app.get('/api/roles/:id', (req: Request, res: Response) => {
  const role = roles.find(r => r.id === req.params.id);
  res.json(role || { error: 'Role not found' });
});
app.post('/api/roles', (req: Request, res: Response) => {
  const newRole = { ...req.body, id: generateId('role') };
  roles.push(newRole);
  res.status(201).json(newRole);
});
app.put('/api/roles/:id', (req: Request, res: Response) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  Object.assign(role, req.body);
  res.json(role);
});

// Departments Endpoints
app.get('/api/departments', (req: Request, res: Response) => res.json(departments));
app.post('/api/departments', (req: Request, res: Response) => {
  const newDept = { ...req.body, id: generateId('dept') };
  departments.push(newDept);
  res.status(201).json(newDept);
});
app.put('/api/departments/:id', (req: Request, res: Response) => {
  const dept = departments.find(d => d.id === req.params.id);
  if (!dept) return res.status(404).json({ error: 'Department not found' });
  Object.assign(dept, req.body);
  res.json(dept);
});

// Waste Management Endpoints
app.get('/api/wastes/raw-material', (req: Request, res: Response) => res.json(rmWaste));
app.post('/api/wastes/raw-material', (req: Request, res: Response) => {
  const newWaste = { ...req.body, id: generateId('rm-w') };
  rmWaste.push(newWaste);
  res.status(201).json(newWaste);
});
app.delete('/api/wastes/raw-material/:id', (req: Request, res: Response) => {
  const index = rmWaste.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Waste not found' });
  rmWaste.splice(index, 1);
  res.status(204).send();
});

app.get('/api/wastes/product', (req: Request, res: Response) => res.json(productWaste));
app.post('/api/wastes/product', (req: Request, res: Response) => {
  const newWaste = { ...req.body, id: generateId('prod-w') };
  productWaste.push(newWaste);
  res.status(201).json(newWaste);
});
app.delete('/api/wastes/product/:id', (req: Request, res: Response) => {
  const index = productWaste.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Waste not found' });
  productWaste.splice(index, 1);
  res.status(204).send();
});

// Settings Endpoints
app.get('/api/settings/units', (req: Request, res: Response) => res.json(units));
app.post('/api/settings/units', (req: Request, res: Response) => {
  const newUnit = { ...req.body, id: generateId('unit') };
  units.push(newUnit);
  res.status(201).json(newUnit);
});

app.get('/api/settings/production-stages', (req: Request, res: Response) => res.json(productionStages));
app.post('/api/settings/production-stages', (req: Request, res: Response) => {
  const newStage = { ...req.body, id: generateId('stage') };
  productionStages.push(newStage);
  res.status(201).json(newStage);
});

app.get('/api/settings/currencies', (req: Request, res: Response) => res.json(currencies));
app.post('/api/settings/currencies', (req: Request, res: Response) => {
  const newCurrency = { ...req.body, id: generateId('curr') };
  currencies.push(newCurrency);
  res.status(201).json(newCurrency);
});

// Material Codes Endpoints
app.get('/api/material-codes', (req: Request, res: Response) => res.json(materialCodes));
app.post('/api/material-codes', (req: Request, res: Response) => {
  const newCode = { ...req.body, id: generateId('mat') };
  materialCodes.push(newCode);
  res.status(201).json(newCode);
});

// Stock Endpoints
app.get('/api/stock', (req: Request, res: Response) => {
  res.json([
    { id: 'stock-1', tenantId: 'demo-tenant-id', productId: 'prod-1', quantity: 100, warehouseLocation: 'A1' },
    { id: 'stock-2', tenantId: 'demo-tenant-id', productId: 'prod-2', quantity: 50, warehouseLocation: 'B2' }
  ]);
});

// Raw Material Stock Endpoints
app.get('/api/stock/raw-material', (req: Request, res: Response) => res.json(rmStock));
app.post('/api/stock/raw-material', (req: Request, res: Response) => {
  const newStock = { ...req.body, id: generateId('rms') };
  rmStock.push(newStock);
  res.status(201).json(newStock);
});
app.put('/api/stock/raw-material/:id', (req: Request, res: Response) => {
  const stock = rmStock.find(s => s.id === req.params.id);
  if (!stock) return res.status(404).json({ error: 'Stock not found' });
  Object.assign(stock, req.body);
  res.json(stock);
});

// Product Stock Endpoints
app.get('/api/stock/product', (req: Request, res: Response) => res.json(productStock));
app.post('/api/stock/product', (req: Request, res: Response) => {
  const newStock = { ...req.body, id: generateId('ps') };
  productStock.push(newStock);
  res.status(201).json(newStock);
});
app.put('/api/stock/product/:id', (req: Request, res: Response) => {
  const stock = productStock.find(s => s.id === req.params.id);
  if (!stock) return res.status(404).json({ error: 'Stock not found' });
  Object.assign(stock, req.body);
  res.json(stock);
});

// Suppliers Endpoints
app.get('/api/suppliers', (req: Request, res: Response) => res.json(suppliers));
app.post('/api/suppliers', (req: Request, res: Response) => {
  const newSupplier = { ...req.body, id: generateId('sup') };
  suppliers.push(newSupplier);
  res.status(201).json(newSupplier);
});
app.put('/api/suppliers/:id', (req: Request, res: Response) => {
  const supplier = suppliers.find(s => s.id === req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  Object.assign(supplier, req.body);
  res.json(supplier);
});

// Vendors Endpoints
app.get('/api/vendors', (req: Request, res: Response) => res.json(vendors));
app.post('/api/vendors', (req: Request, res: Response) => {
  const newVendor = { ...req.body, id: generateId('vend') };
  vendors.push(newVendor);
  res.status(201).json(newVendor);
});
app.put('/api/vendors/:id', (req: Request, res: Response) => {
  const vendor = vendors.find(v => v.id === req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  Object.assign(vendor, req.body);
  res.json(vendor);
});

// BOM Endpoints
app.get('/api/bom', (req: Request, res: Response) => res.json(bom));
app.get('/api/bom/:id', (req: Request, res: Response) => {
  const bomItem = bom.find(b => b.id === req.params.id);
  res.json(bomItem || { error: 'BOM not found' });
});
app.post('/api/bom', (req: Request, res: Response) => {
  const newBOM = { ...req.body, id: generateId('bom') };
  bom.push(newBOM);
  res.status(201).json(newBOM);
});
app.put('/api/bom/:id', (req: Request, res: Response) => {
  const bomItem = bom.find(b => b.id === req.params.id);
  if (!bomItem) return res.status(404).json({ error: 'BOM not found' });
  Object.assign(bomItem, req.body);
  res.json(bomItem);
});

// Machines Endpoints
app.get('/api/machines', (req: Request, res: Response) => res.json(machines));
app.post('/api/machines', (req: Request, res: Response) => {
  const newMachine = { ...req.body, id: generateId('mach') };
  machines.push(newMachine);
  res.status(201).json(newMachine);
});
app.put('/api/machines/:id', (req: Request, res: Response) => {
  const machine = machines.find(m => m.id === req.params.id);
  if (!machine) return res.status(404).json({ error: 'Machine not found' });
  Object.assign(machine, req.body);
  res.json(machine);
});

// Shifts Endpoints
app.get('/api/shifts', (req: Request, res: Response) => res.json(shifts));
app.post('/api/shifts', (req: Request, res: Response) => {
  const newShift = { ...req.body, id: generateId('shift') };
  shifts.push(newShift);
  res.status(201).json(newShift);
});
app.put('/api/shifts/:id', (req: Request, res: Response) => {
  const shift = shifts.find(s => s.id === req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });
  Object.assign(shift, req.body);
  res.json(shift);
});

// Attendance Endpoints
app.get('/api/attendance', (req: Request, res: Response) => res.json(attendance));
app.post('/api/attendance', (req: Request, res: Response) => {
  const newAttendance = { ...req.body, id: generateId('att') };
  attendance.push(newAttendance);
  res.status(201).json(newAttendance);
});

// Employees Endpoints
app.get('/api/employees', (req: Request, res: Response) => res.json(employees));
app.post('/api/employees', (req: Request, res: Response) => {
  const newEmployee = { ...req.body, id: generateId('emp') };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});
app.put('/api/employees/:id', (req: Request, res: Response) => {
  const employee = employees.find(e => e.id === req.params.id);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  Object.assign(employee, req.body);
  res.json(employee);
});

// Asset Management Endpoints
app.get('/api/assets', (req: Request, res: Response) => res.json(assets));
app.post('/api/assets', (req: Request, res: Response) => {
  const newAsset = { ...req.body, id: generateId('asset') };
  assets.push(newAsset);
  res.status(201).json(newAsset);
});
app.put('/api/assets/:id', (req: Request, res: Response) => {
  const asset = assets.find(a => a.id === req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  Object.assign(asset, req.body);
  res.json(asset);
});

// Inventory Reports Endpoints
app.get('/api/inventory/reports', (req: Request, res: Response) => {
  res.json({ totalStock: rmStock.length + productStock.length, rawMaterial: rmStock.length, products: productStock.length });
});

// Reports Endpoints
app.get('/api/reports/inventory', (req: Request, res: Response) => res.json({ report: 'Inventory Report', date: new Date().toISOString() }));
app.get('/api/reports/production', (req: Request, res: Response) => res.json({ report: 'Production Report', date: new Date().toISOString() }));
app.get('/api/reports/sales', (req: Request, res: Response) => res.json({ report: 'Sales Report', date: new Date().toISOString() }));

// Production Endpoints
app.get('/api/productions', (req: Request, res: Response) => {
  res.json([
    {
      id: 'prod-run-1',
      tenantId: 'demo-tenant-id',
      productId: 'prod-1',
      startDate: '2026-02-01',
      expectedCompletionDate: '2026-02-10',
      status: 'in-progress',
      quantity: 500,
      loss: 10,
      yield: 490
    }
  ]);
});

// Sales Endpoints
app.get('/api/sales', (req: Request, res: Response) => {
  res.json([
    {
      id: 'sale-1',
      tenantId: 'demo-tenant-id',
      customerId: 'cust-1',
      saleNumber: 'SALE-001',
      date: '2026-02-01',
      totalAmount: 5000,
      status: 'delivered'
    }
  ]);
});

// Purchase Endpoints
app.get('/api/purchases', (req: Request, res: Response) => {
  res.json([
    {
      id: 'pur-1',
      tenantId: 'demo-tenant-id',
      supplierId: 'supp-1',
      purchaseNumber: 'PUR-001',
      date: '2026-02-01',
      totalAmount: 2000,
      status: 'received'
    }
  ]);
});

// Accounting Endpoints
app.get('/api/accounting/accounts', (req: Request, res: Response) => {
  res.json([
    { id: 'acc-1', code: '1000', name: 'Cash', type: 'asset', balance: 50000 },
    { id: 'acc-2', code: '2000', name: 'Accounts Payable', type: 'liability', balance: 10000 }
  ]);
});

app.get('/api/accounting/transactions', (req: Request, res: Response) => {
  res.json([
    { id: 'txn-1', accountId: 'acc-1', date: '2026-02-01', description: 'Opening balance', debit: 50000 }
  ]);
});

app.get('/api/accounting/reports', (req: Request, res: Response) => {
  res.json([
    { id: 'rpt-1', type: 'balance_sheet', period: '2026-01', generatedAt: new Date().toISOString() }
  ]);
});

// Quality Control Endpoints
app.get('/api/qc/templates', (req: Request, res: Response) => {
  res.json(qcTemplates);
});

app.post('/api/qc/templates', (req: Request, res: Response) => {
  const newTemplate = {
    id: generateId('tpl'),
    name: req.body.name || 'Template',
    type: req.body.type || 'general',
    updatedAt: new Date().toISOString()
  };
  qcTemplates.unshift(newTemplate);
  res.status(201).json(newTemplate);
});

app.get('/api/qc/inspections', (req: Request, res: Response) => {
  res.json(qcInspections);
});

app.post('/api/qc/inspections', (req: Request, res: Response) => {
  const template = qcTemplates.find(t => t.id === req.body.templateId) || qcTemplates[0];
  const newInspection = {
    id: generateId('insp'),
    status: req.body?.results?.overall?.passed ? 'passed' : 'failed',
    inspectionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    template: template ? { name: template.name } : { name: 'Template' }
  };
  qcInspections.unshift(newInspection);
  res.status(201).json(newInspection);
});

app.get('/api/qc/non-conformance', (req: Request, res: Response) => {
  res.json(nonConformances);
});

app.post('/api/qc/non-conformance', (req: Request, res: Response) => {
  const newNcr = {
    id: generateId('ncr'),
    reportNo: req.body.reportNo || `NCR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    severity: req.body.severity || 'medium',
    status: req.body.status || 'open',
    createdAt: new Date().toISOString()
  };
  nonConformances.unshift(newNcr);
  res.status(201).json(newNcr);
});

// Approvals Endpoints
app.get('/api/approvals/stats', (req: Request, res: Response) => {
  const pending = approvals.filter(a => a.status === 'pending').length;
  const approved = approvals.filter(a => a.status === 'approved').length;
  const rejected = approvals.filter(a => a.status === 'rejected').length;
  const unlockRequestsCount = unlockRequests.length;
  res.json({ pending, approved, rejected, unlockRequests: unlockRequestsCount });
});

app.get('/api/approvals/pending', (req: Request, res: Response) => {
  res.json(approvals.filter(a => a.status === 'pending'));
});

app.get('/api/approvals/history', (req: Request, res: Response) => {
  res.json(approvals.filter(a => a.status !== 'pending'));
});

app.get('/api/approvals/unlock-requests', (req: Request, res: Response) => {
  res.json(unlockRequests);
});

app.post('/api/approvals', (req: Request, res: Response) => {
  const newRequest = {
    id: generateId('unlock'),
    entityType: req.body.entityType,
    entityId: req.body.entityId,
    requesterId: 'admin@demo.com',
    approverId: undefined,
    status: req.body.status || 'pending',
    requestedAt: new Date().toISOString(),
    respondedAt: undefined,
    reason: req.body.reason,
    approvalLevel: req.body.approvalLevel || 'level1',
    impactArea: req.body.impactArea || 'Standard',
    requestType: req.body.requestType || 'unlock'
  };
  unlockRequests.unshift(newRequest);
  res.status(201).json(newRequest);
});

app.post('/api/approvals/:id/approve', (req: Request, res: Response) => {
  const id = req.params.id;
  const approval = approvals.find(a => a.id === id) || unlockRequests.find(u => u.id === id);
  if (!approval) return res.status(404).json({ error: 'Approval not found' });
  approval.status = 'approved';
  approval.approverId = 'superadmin@system.com';
  approval.respondedAt = new Date().toISOString();
  approval.comments = req.body?.comments;
  res.json(approval);
});

app.post('/api/approvals/:id/reject', (req: Request, res: Response) => {
  const id = req.params.id;
  const approval = approvals.find(a => a.id === id) || unlockRequests.find(u => u.id === id);
  if (!approval) return res.status(404).json({ error: 'Approval not found' });
  approval.status = 'rejected';
  approval.approverId = 'superadmin@system.com';
  approval.respondedAt = new Date().toISOString();
  approval.comments = req.body?.comments;
  res.json(approval);
});

// Audit Endpoints
app.get('/api/audit/logs', (req: Request, res: Response) => {
  res.json(auditLogs);
});

app.get('/api/audit/entities', (req: Request, res: Response) => {
  res.json(entityHistory);
});

app.get('/api/audit/stats', (req: Request, res: Response) => {
  const totalLogs = auditLogs.length;
  const totalUsers = new Set(auditLogs.map(l => l.userId).filter(Boolean)).size;
  const topActions = [
    { action: 'create', count: auditLogs.filter(l => l.action === 'create').length }
  ];
  const topEntities = [
    { entityType: 'Order', count: auditLogs.filter(l => l.entityType === 'Order').length }
  ];
  const recentActivity = [
    { date: new Date().toISOString().slice(0, 10), count: totalLogs }
  ];
  res.json({ totalLogs, totalUsers, topActions, topEntities, recentActivity });
});

app.get('/api/audit/export', (req: Request, res: Response) => {
  const format = String(req.query.format || 'csv');
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(auditLogs, null, 2));
  }
  const csv = [
    ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'].join(','),
    ...auditLogs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.userId || '-',
      log.action,
      log.entityType,
      log.entityId,
      log.ipAddress || '-'
    ].join(','))
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  return res.send(csv);
});

// Accounting Periods Endpoints
app.get('/api/accounting-periods', (req: Request, res: Response) => {
  const tenantId = String(req.query.tenantId || 'default');
  res.json(accountingPeriods.filter(p => p.tenantId === tenantId));
});

app.post('/api/accounting-periods/:id/close', (req: Request, res: Response) => {
  const period = accountingPeriods.find(p => p.id === req.params.id);
  if (!period) return res.status(404).json({ error: 'Period not found' });
  period.status = 'closed';
  res.json(period);
});

app.post('/api/accounting-periods/:id/reopen', (req: Request, res: Response) => {
  const period = accountingPeriods.find(p => p.id === req.params.id);
  if (!period) return res.status(404).json({ error: 'Period not found' });
  period.status = 'open';
  res.json(period);
});

// Budget / Forecast / GRN Endpoints
app.get('/api/budget', (req: Request, res: Response) => {
  res.json(budgets);
});

app.post('/api/budget', (req: Request, res: Response) => {
  const newBudget = {
    id: generateId('budget'),
    name: req.body.name || 'Budget',
    budgetPeriod: req.body.budgetPeriod || 'monthly',
    totalBudget: Number(req.body.totalBudgetAmount || 0),
    totalActual: 0,
    status: req.body.status || 'draft'
  };
  budgets.unshift(newBudget);
  res.status(201).json(newBudget);
});

app.get('/api/forecast', (req: Request, res: Response) => {
  res.json(forecasts);
});

app.post('/api/forecast', (req: Request, res: Response) => {
  const newForecast = {
    id: generateId('forecast'),
    name: req.body.name || 'Forecast',
    forecastMethod: req.body.method || 'manual',
    startDate: req.body.startDate || new Date().toISOString().slice(0, 10),
    endDate: req.body.endDate || new Date().toISOString().slice(0, 10),
    lineItems: [],
    status: 'draft'
  };
  forecasts.unshift(newForecast);
  res.status(201).json(newForecast);
});

app.get('/api/grn', (req: Request, res: Response) => {
  res.json(grns);
});

app.post('/api/grn', (req: Request, res: Response) => {
  const newGrn = {
    id: generateId('grn'),
    grnNo: `GRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    purchase: { poNo: req.body.purchaseOrderNo || 'PO-AUTO', supplier: { name: req.body.supplier || 'Supplier' } },
    totalQuantity: Number(req.body.totalQuantity || 0),
    receivedDate: req.body.receivedDate || new Date().toISOString().slice(0, 10),
    status: req.body.status || 'pending'
  };
  grns.unshift(newGrn);
  res.status(201).json(newGrn);
});

// PDF Endpoints (HTML previews)
app.get('/api/pdf/invoice/:saleId', (req: Request, res: Response) => {
  res.send(`<html><body><h1>Invoice ${req.params.saleId}</h1><p>Mock PDF preview</p></body></html>`);
});

app.get('/api/pdf/purchase-order/:purchaseId', (req: Request, res: Response) => {
  res.send(`<html><body><h1>Purchase Order ${req.params.purchaseId}</h1><p>Mock PDF preview</p></body></html>`);
});

app.get('/api/pdf/delivery-challan/:orderId', (req: Request, res: Response) => {
  res.send(`<html><body><h1>Delivery Challan ${req.params.orderId}</h1><p>Mock PDF preview</p></body></html>`);
});

app.get('/api/pdf/production-report/:productionId', (req: Request, res: Response) => {
  res.send(`<html><body><h1>Production Report ${req.params.productionId}</h1><p>Mock PDF preview</p></body></html>`);
});

app.get('/api/pdf/financial-statement', (req: Request, res: Response) => {
  res.send(`<html><body><h1>Financial Statement</h1><p>Mock PDF preview</p></body></html>`);
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Mock backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   🚀 MOCK BACKEND SERVER RUNNING                           ║
║   📍 http://localhost:${PORT}                                  ║
║   ✅ Ready for frontend connection                          ║
║                                                            ║
║   🔐 Test Credentials:                                     ║
║   • superadmin@system.com (Superadmin)                     ║
║   • admin@demo.com (Admin)                                 ║
║   • user@demo.com (User)                                   ║
║                                                            ║
║   📊 API Endpoints Active:                                 ║
║   • /api/auth/login                                        ║
║   • /api/orders                                            ║
║   • /api/products                                          ║
║   • /api/customers                                         ║
║   • /api/stock                                             ║
║   • /api/sales & /api/purchases                            ║
║   • /api/accounting/*                                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
