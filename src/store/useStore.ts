import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Outlet {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  unit: string;
  status: "active" | "inactive";
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  price: number;
  stock: number;
  unit: string;
  minStock: number;
}

export interface RMCategory {
  id: string;
  name: string;
  description: string;
}

export interface Production {
  id: string;
  referenceNo: string;
  productId: string;
  quantity: number;
  startDate: string;
  endDate?: string;
  status: "running" | "completed" | "cancelled";
  stage: string;
  notes: string;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  paid: number;
  due: number;
  date: string;
  status: "paid" | "partial" | "unpaid";
}

export interface Purchase {
  id: string;
  invoiceNo: string;
  supplierId: string;
  items: { rawMaterialId: string; quantity: number; price: number }[];
  total: number;
  paid: number;
  due: number;
  date: string;
  status: "paid" | "partial" | "unpaid";
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  inTime: string;
  outTime: string;
  status: "present" | "absent" | "late" | "half-day";
  note: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
}

export interface Account {
  id: string;
  name: string;
  type: "bank" | "cash" | "mobile";
  balance: number;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "deposit" | "withdraw";
  amount: number;
  date: string;
  description: string;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  reference: string;
}

export interface CustomerReceive {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  reference: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: "paid" | "pending";
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  status: "active" | "inactive";
}

export interface RMWaste {
  id: string;
  rawMaterialId: string;
  quantity: number;
  date: string;
  reason: string;
}

export interface ProductWaste {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  reason: string;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  customerId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  validUntil: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Unit {
  id: string;
  name: string;
  shortName: string;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  rate: number;
}

export interface ProductionStage {
  id: string;
  name: string;
  order: number;
}

export interface StockAdjustment {
  id: string;
  rawMaterialId: string;
  type: "add" | "subtract";
  quantity: number;
  date: string;
  reason: string;
}

export interface ProductionLoss {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  lossType: "damage" | "defect" | "expiry" | "spillage" | "theft" | "other";
  date: string;
  reason: string;
  notes: string;
  createdAt: string;
}

export interface NonInventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  description: string;
  price: number;
  tax: number;
  supplier: string;
  createdAt: string;
}

export interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  taxNumber: string;
  currency: string;
}

interface StoreState {
  // Data
  outlets: Outlet[];
  products: Product[];
  productCategories: ProductCategory[];
  rawMaterials: RawMaterial[];
  rmCategories: RMCategory[];
  productions: Production[];
  productionLosses: ProductionLoss[];
  nonInventoryItems: NonInventoryItem[];
  sales: Sale[];
  purchases: Purchase[];
  customers: Customer[];
  suppliers: Supplier[];
  attendance: Attendance[];
  expenses: Expense[];
  expenseCategories: ExpenseCategory[];
  accounts: Account[];
  transactions: Transaction[];
  supplierPayments: SupplierPayment[];
  customerReceives: CustomerReceive[];
  payrolls: Payroll[];
  employees: Employee[];
  rmWastes: RMWaste[];
  productWastes: ProductWaste[];
  quotations: Quotation[];
  users: User[];
  roles: Role[];
  units: Unit[];
  currencies: Currency[];
  productionStages: ProductionStage[];
  stockAdjustments: StockAdjustment[];
  companyProfile: CompanyProfile;
  
  // Actions
  addOutlet: (outlet: Omit<Outlet, 'id' | 'createdAt'>) => void;
  updateOutlet: (id: string, outlet: Partial<Outlet>) => void;
  deleteOutlet: (id: string) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addProductCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateProductCategory: (id: string, category: Partial<ProductCategory>) => void;
  deleteProductCategory: (id: string) => void;
  
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (id: string, material: Partial<RawMaterial>) => void;
  deleteRawMaterial: (id: string) => void;
  
  addRMCategory: (category: Omit<RMCategory, 'id'>) => void;
  updateRMCategory: (id: string, category: Partial<RMCategory>) => void;
  deleteRMCategory: (id: string) => void;
  
  addProduction: (production: Omit<Production, 'id'>) => void;
  updateProduction: (id: string, production: Partial<Production>) => void;
  deleteProduction: (id: string) => void;
  
  addProductionLoss: (loss: Omit<ProductionLoss, 'id'>) => void;
  deleteProductionLoss: (id: string) => void;
  
  addNonInventoryItem: (item: Omit<NonInventoryItem, 'id' | 'createdAt'>) => void;
  deleteNonInventoryItem: (id: string) => void;
  
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  addExpenseCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  updateExpenseCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteExpenseCategory: (id: string) => void;
  
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  
  addSupplierPayment: (payment: Omit<SupplierPayment, 'id'>) => void;
  addCustomerReceive: (receive: Omit<CustomerReceive, 'id'>) => void;
  
  addPayroll: (payroll: Omit<Payroll, 'id'>) => void;
  updatePayroll: (id: string, payroll: Partial<Payroll>) => void;
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addRMWaste: (waste: Omit<RMWaste, 'id'>) => void;
  addProductWaste: (waste: Omit<ProductWaste, 'id'>) => void;
  
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt'>) => void;
  updateQuotation: (id: string, quotation: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, unit: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  
  addCurrency: (currency: Omit<Currency, 'id'>) => void;
  updateCurrency: (id: string, currency: Partial<Currency>) => void;
  deleteCurrency: (id: string) => void;
  
  addProductionStage: (stage: Omit<ProductionStage, 'id'>) => void;
  updateProductionStage: (id: string, stage: Partial<ProductionStage>) => void;
  deleteProductionStage: (id: string) => void;
  
  addStockAdjustment: (adjustment: Omit<StockAdjustment, 'id'>) => void;
  
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  
  exportData: () => string;
  importData: (data: string) => void;
  resetData: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

// Initial mock data
const initialState = {
  outlets: [
    { id: '1', name: 'Main Branch', phone: '123-456-7890', email: 'main@company.com', status: 'active' as const, address: '123 Main St, City', createdAt: '2024-01-01' },
    { id: '2', name: 'Downtown Store', phone: '098-765-4321', email: 'downtown@company.com', status: 'active' as const, address: '456 Downtown Ave, City', createdAt: '2024-01-15' },
  ],
  products: [
    { id: '1', name: 'Widget A', categoryId: '1', sku: 'WGT-001', price: 29.99, cost: 15.00, stock: 150, unit: 'pcs', status: 'active' as const },
    { id: '2', name: 'Widget B', categoryId: '1', sku: 'WGT-002', price: 49.99, cost: 25.00, stock: 80, unit: 'pcs', status: 'active' as const },
    { id: '3', name: 'Gadget X', categoryId: '2', sku: 'GDG-001', price: 99.99, cost: 50.00, stock: 45, unit: 'pcs', status: 'active' as const },
  ],
  productCategories: [
    { id: '1', name: 'Widgets', description: 'Various widget products' },
    { id: '2', name: 'Gadgets', description: 'Electronic gadgets' },
  ],
  rawMaterials: [
    { id: '1', name: 'Steel Sheet', categoryId: '1', sku: 'RM-001', price: 50.00, stock: 500, unit: 'kg', minStock: 100 },
    { id: '2', name: 'Plastic Pellets', categoryId: '2', sku: 'RM-002', price: 15.00, stock: 1000, unit: 'kg', minStock: 200 },
    { id: '3', name: 'Copper Wire', categoryId: '1', sku: 'RM-003', price: 80.00, stock: 50, unit: 'meter', minStock: 100 },
  ],
  rmCategories: [
    { id: '1', name: 'Metals', description: 'Metal raw materials' },
    { id: '2', name: 'Plastics', description: 'Plastic raw materials' },
  ],
  productions: [
    { id: '1', referenceNo: 'PRD-001', productId: '1', quantity: 100, startDate: '2024-01-20', status: 'running' as const, stage: 'Assembly', notes: 'Priority order' },
    { id: '2', referenceNo: 'PRD-002', productId: '2', quantity: 50, startDate: '2024-01-18', endDate: '2024-01-22', status: 'completed' as const, stage: 'Packaging', notes: '' },
  ],
  productionLosses: [
    { id: 'PL-001', productId: '1', productName: 'Widget A', quantity: 5, lossType: 'defect' as const, date: '2024-01-20', reason: 'Quality control rejection', notes: 'Recheck process needed', createdAt: '2024-01-20T10:00:00Z' },
  ],
  nonInventoryItems: [
    { id: 'NI-001', name: 'Office Supplies', code: 'OS-001', category: 'office-supplies', unit: 'pack', description: 'General office supplies', price: 50.00, tax: 5.00, supplier: 'ABC Office Co.', createdAt: '2024-01-15T10:00:00Z' },
    { id: 'NI-002', name: 'Annual Software License', code: 'SL-001', category: 'licenses', unit: 'service', description: 'Enterprise software license for 1 year', price: 1000.00, tax: 100.00, supplier: 'Tech Solutions Inc.', createdAt: '2024-01-16T10:00:00Z' },
  ],
  sales: [
    { id: '1', invoiceNo: 'INV-001', customerId: '1', items: [{ productId: '1', quantity: 10, price: 29.99 }], total: 299.90, paid: 299.90, due: 0, date: '2024-01-20', status: 'paid' as const },
    { id: '2', invoiceNo: 'INV-002', customerId: '2', items: [{ productId: '2', quantity: 5, price: 49.99 }], total: 249.95, paid: 100, due: 149.95, date: '2024-01-22', status: 'partial' as const },
  ],
  purchases: [
    { id: '1', invoiceNo: 'PUR-001', supplierId: '1', items: [{ rawMaterialId: '1', quantity: 100, price: 50.00 }], total: 5000, paid: 5000, due: 0, date: '2024-01-15', status: 'paid' as const },
  ],
  customers: [
    { id: '1', name: 'John Doe', phone: '111-222-3333', email: 'john@email.com', address: '123 Customer St', balance: 0, createdAt: '2024-01-01' },
    { id: '2', name: 'Jane Smith', phone: '444-555-6666', email: 'jane@email.com', address: '456 Client Ave', balance: 149.95, createdAt: '2024-01-05' },
  ],
  suppliers: [
    { id: '1', name: 'ABC Suppliers', phone: '777-888-9999', email: 'abc@supplier.com', address: '789 Supplier Rd', balance: 0, createdAt: '2024-01-01' },
    { id: '2', name: 'XYZ Materials', phone: '000-111-2222', email: 'xyz@materials.com', address: '321 Material Ln', balance: 2500, createdAt: '2024-01-03' },
  ],
  attendance: [
    { id: '1', employeeId: '1', employeeName: 'Mike Johnson', date: '2024-01-22', inTime: '09:00', outTime: '17:00', status: 'present' as const, note: '' },
    { id: '2', employeeId: '2', employeeName: 'Sarah Wilson', date: '2024-01-22', inTime: '09:15', outTime: '17:00', status: 'late' as const, note: 'Traffic delay' },
  ],
  expenses: [
    { id: '1', categoryId: '1', amount: 500, date: '2024-01-20', description: 'Office supplies', paymentMethod: 'Cash' },
    { id: '2', categoryId: '2', amount: 1200, date: '2024-01-21', description: 'Electricity bill', paymentMethod: 'Bank Transfer' },
  ],
  expenseCategories: [
    { id: '1', name: 'Office Supplies', description: 'Stationery and office equipment' },
    { id: '2', name: 'Utilities', description: 'Electricity, water, internet' },
    { id: '3', name: 'Travel', description: 'Transportation and travel expenses' },
  ],
  accounts: [
    { id: '1', name: 'Main Bank Account', type: 'bank' as const, balance: 50000, accountNumber: '1234567890' },
    { id: '2', name: 'Petty Cash', type: 'cash' as const, balance: 2000, accountNumber: '' },
  ],
  transactions: [
    { id: '1', accountId: '1', type: 'deposit' as const, amount: 10000, date: '2024-01-15', description: 'Customer payment' },
    { id: '2', accountId: '2', type: 'withdraw' as const, amount: 500, date: '2024-01-20', description: 'Office supplies' },
  ],
  supplierPayments: [
    { id: '1', supplierId: '1', amount: 5000, date: '2024-01-15', paymentMethod: 'Bank Transfer', reference: 'PAY-001' },
  ],
  customerReceives: [
    { id: '1', customerId: '1', amount: 299.90, date: '2024-01-20', paymentMethod: 'Cash', reference: 'REC-001' },
  ],
  payrolls: [
    { id: '1', employeeId: '1', employeeName: 'Mike Johnson', month: '2024-01', basicSalary: 3000, bonus: 200, deductions: 100, netSalary: 3100, status: 'paid' as const },
  ],
  employees: [
    { id: '1', name: 'Mike Johnson', email: 'mike@company.com', phone: '111-111-1111', position: 'Production Manager', department: 'Production', salary: 3000, joinDate: '2023-06-01', status: 'active' as const },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@company.com', phone: '222-222-2222', position: 'Sales Executive', department: 'Sales', salary: 2500, joinDate: '2023-08-15', status: 'active' as const },
  ],
  rmWastes: [
    { id: '1', rawMaterialId: '1', quantity: 5, date: '2024-01-20', reason: 'Defective batch' },
  ],
  productWastes: [
    { id: '1', productId: '1', quantity: 3, date: '2024-01-21', reason: 'Quality control rejection' },
  ],
  quotations: [
    { id: '1', quotationNo: 'QT-001', customerId: '1', items: [{ productId: '1', quantity: 50, price: 27.99 }], total: 1399.50, validUntil: '2024-02-20', status: 'sent' as const, createdAt: '2024-01-20' },
  ],
  users: [
    { id: '1', name: 'Admin User', email: 'admin@company.com', roleId: '1', status: 'active' as const, createdAt: '2024-01-01' },
    { id: '2', name: 'Sales User', email: 'sales@company.com', roleId: '2', status: 'active' as const, createdAt: '2024-01-05' },
  ],
  roles: [
    { id: '1', name: 'Administrator', permissions: ['all'] },
    { id: '2', name: 'Sales Manager', permissions: ['sales', 'customers', 'quotations'] },
    { id: '3', name: 'Production Manager', permissions: ['production', 'stock', 'raw-materials'] },
  ],
  units: [
    { id: '1', name: 'Piece', shortName: 'pcs' },
    { id: '2', name: 'Kilogram', shortName: 'kg' },
    { id: '3', name: 'Meter', shortName: 'm' },
    { id: '4', name: 'Liter', shortName: 'L' },
  ],
  currencies: [
    { id: '1', name: 'US Dollar', code: 'USD', symbol: '$', rate: 1 },
    { id: '2', name: 'Euro', code: 'EUR', symbol: '€', rate: 0.85 },
  ],
  productionStages: [
    { id: '1', name: 'Cutting', order: 1 },
    { id: '2', name: 'Assembly', order: 2 },
    { id: '3', name: 'Quality Check', order: 3 },
    { id: '4', name: 'Packaging', order: 4 },
  ],
  stockAdjustments: [],
  companyProfile: {
    name: 'IProduction Company',
    email: 'info@iproduction.com',
    phone: '123-456-7890',
    address: '123 Business Park, City, Country',
    logo: '',
    taxNumber: 'TAX-123456',
    currency: 'USD',
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Outlets
      addOutlet: (outlet) => set((state) => ({
        outlets: [...state.outlets, { ...outlet, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateOutlet: (id, outlet) => set((state) => ({
        outlets: state.outlets.map((o) => o.id === id ? { ...o, ...outlet } : o)
      })),
      deleteOutlet: (id) => set((state) => ({
        outlets: state.outlets.filter((o) => o.id !== id)
      })),
      
      // Products
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: generateId() }]
      })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, ...product } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),
      
      // Product Categories
      addProductCategory: (category) => set((state) => ({
        productCategories: [...state.productCategories, { ...category, id: generateId() }]
      })),
      updateProductCategory: (id, category) => set((state) => ({
        productCategories: state.productCategories.map((c) => c.id === id ? { ...c, ...category } : c)
      })),
      deleteProductCategory: (id) => set((state) => ({
        productCategories: state.productCategories.filter((c) => c.id !== id)
      })),
      
      // Raw Materials
      addRawMaterial: (material) => set((state) => ({
        rawMaterials: [...state.rawMaterials, { ...material, id: generateId() }]
      })),
      updateRawMaterial: (id, material) => set((state) => ({
        rawMaterials: state.rawMaterials.map((m) => m.id === id ? { ...m, ...material } : m)
      })),
      deleteRawMaterial: (id) => set((state) => ({
        rawMaterials: state.rawMaterials.filter((m) => m.id !== id)
      })),
      
      // RM Categories
      addRMCategory: (category) => set((state) => ({
        rmCategories: [...state.rmCategories, { ...category, id: generateId() }]
      })),
      updateRMCategory: (id, category) => set((state) => ({
        rmCategories: state.rmCategories.map((c) => c.id === id ? { ...c, ...category } : c)
      })),
      deleteRMCategory: (id) => set((state) => ({
        rmCategories: state.rmCategories.filter((c) => c.id !== id)
      })),
      
      // Productions
      addProduction: (production) => set((state) => ({
        productions: [...state.productions, { ...production, id: generateId() }]
      })),
      updateProduction: (id, production) => set((state) => ({
        productions: state.productions.map((p) => p.id === id ? { ...p, ...production } : p)
      })),
      deleteProduction: (id) => set((state) => ({
        productions: state.productions.filter((p) => p.id !== id)
      })),
      
      // Production Losses
      addProductionLoss: (loss) => set((state) => ({
        productionLosses: [...state.productionLosses, { ...loss, id: generateId() }]
      })),
      deleteProductionLoss: (id) => set((state) => ({
        productionLosses: state.productionLosses.filter((l) => l.id !== id)
      })),
      
      // Non Inventory Items
      addNonInventoryItem: (item) => set((state) => ({
        nonInventoryItems: [...state.nonInventoryItems, { ...item, id: generateId(), createdAt: new Date().toISOString() }]
      })),
      deleteNonInventoryItem: (id) => set((state) => ({
        nonInventoryItems: state.nonInventoryItems.filter((item) => item.id !== id)
      })),
      
      // Sales
      addSale: (sale) => set((state) => ({
        sales: [...state.sales, { ...sale, id: generateId() }]
      })),
      updateSale: (id, sale) => set((state) => ({
        sales: state.sales.map((s) => s.id === id ? { ...s, ...sale } : s)
      })),
      deleteSale: (id) => set((state) => ({
        sales: state.sales.filter((s) => s.id !== id)
      })),
      
      // Purchases
      addPurchase: (purchase) => set((state) => ({
        purchases: [...state.purchases, { ...purchase, id: generateId() }]
      })),
      updatePurchase: (id, purchase) => set((state) => ({
        purchases: state.purchases.map((p) => p.id === id ? { ...p, ...purchase } : p)
      })),
      deletePurchase: (id) => set((state) => ({
        purchases: state.purchases.filter((p) => p.id !== id)
      })),
      
      // Customers
      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateCustomer: (id, customer) => set((state) => ({
        customers: state.customers.map((c) => c.id === id ? { ...c, ...customer } : c)
      })),
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter((c) => c.id !== id)
      })),
      
      // Suppliers
      addSupplier: (supplier) => set((state) => ({
        suppliers: [...state.suppliers, { ...supplier, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateSupplier: (id, supplier) => set((state) => ({
        suppliers: state.suppliers.map((s) => s.id === id ? { ...s, ...supplier } : s)
      })),
      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id)
      })),
      
      // Attendance
      addAttendance: (attendance) => set((state) => ({
        attendance: [...state.attendance, { ...attendance, id: generateId() }]
      })),
      updateAttendance: (id, attendance) => set((state) => ({
        attendance: state.attendance.map((a) => a.id === id ? { ...a, ...attendance } : a)
      })),
      deleteAttendance: (id) => set((state) => ({
        attendance: state.attendance.filter((a) => a.id !== id)
      })),
      
      // Expenses
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: generateId() }]
      })),
      updateExpense: (id, expense) => set((state) => ({
        expenses: state.expenses.map((e) => e.id === id ? { ...e, ...expense } : e)
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      })),
      
      // Expense Categories
      addExpenseCategory: (category) => set((state) => ({
        expenseCategories: [...state.expenseCategories, { ...category, id: generateId() }]
      })),
      updateExpenseCategory: (id, category) => set((state) => ({
        expenseCategories: state.expenseCategories.map((c) => c.id === id ? { ...c, ...category } : c)
      })),
      deleteExpenseCategory: (id) => set((state) => ({
        expenseCategories: state.expenseCategories.filter((c) => c.id !== id)
      })),
      
      // Accounts
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: generateId() }]
      })),
      updateAccount: (id, account) => set((state) => ({
        accounts: state.accounts.map((a) => a.id === id ? { ...a, ...account } : a)
      })),
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id)
      })),
      
      // Transactions
      addTransaction: (transaction) => set((state) => {
        const account = state.accounts.find(a => a.id === transaction.accountId);
        if (account) {
          const newBalance = transaction.type === 'deposit' 
            ? account.balance + transaction.amount 
            : account.balance - transaction.amount;
          return {
            transactions: [...state.transactions, { ...transaction, id: generateId() }],
            accounts: state.accounts.map(a => a.id === transaction.accountId ? { ...a, balance: newBalance } : a)
          };
        }
        return { transactions: [...state.transactions, { ...transaction, id: generateId() }] };
      }),
      
      // Supplier Payments
      addSupplierPayment: (payment) => set((state) => {
        const supplier = state.suppliers.find(s => s.id === payment.supplierId);
        if (supplier) {
          return {
            supplierPayments: [...state.supplierPayments, { ...payment, id: generateId() }],
            suppliers: state.suppliers.map(s => s.id === payment.supplierId ? { ...s, balance: s.balance - payment.amount } : s)
          };
        }
        return { supplierPayments: [...state.supplierPayments, { ...payment, id: generateId() }] };
      }),
      
      // Customer Receives
      addCustomerReceive: (receive) => set((state) => {
        const customer = state.customers.find(c => c.id === receive.customerId);
        if (customer) {
          return {
            customerReceives: [...state.customerReceives, { ...receive, id: generateId() }],
            customers: state.customers.map(c => c.id === receive.customerId ? { ...c, balance: c.balance - receive.amount } : c)
          };
        }
        return { customerReceives: [...state.customerReceives, { ...receive, id: generateId() }] };
      }),
      
      // Payroll
      addPayroll: (payroll) => set((state) => ({
        payrolls: [...state.payrolls, { ...payroll, id: generateId() }]
      })),
      updatePayroll: (id, payroll) => set((state) => ({
        payrolls: state.payrolls.map((p) => p.id === id ? { ...p, ...payroll } : p)
      })),
      
      // Employees
      addEmployee: (employee) => set((state) => ({
        employees: [...state.employees, { ...employee, id: generateId() }]
      })),
      updateEmployee: (id, employee) => set((state) => ({
        employees: state.employees.map((e) => e.id === id ? { ...e, ...employee } : e)
      })),
      deleteEmployee: (id) => set((state) => ({
        employees: state.employees.filter((e) => e.id !== id)
      })),
      
      // RM Wastes
      addRMWaste: (waste) => set((state) => {
        const material = state.rawMaterials.find(m => m.id === waste.rawMaterialId);
        if (material) {
          return {
            rmWastes: [...state.rmWastes, { ...waste, id: generateId() }],
            rawMaterials: state.rawMaterials.map(m => m.id === waste.rawMaterialId ? { ...m, stock: m.stock - waste.quantity } : m)
          };
        }
        return { rmWastes: [...state.rmWastes, { ...waste, id: generateId() }] };
      }),
      
      // Product Wastes
      addProductWaste: (waste) => set((state) => {
        const product = state.products.find(p => p.id === waste.productId);
        if (product) {
          return {
            productWastes: [...state.productWastes, { ...waste, id: generateId() }],
            products: state.products.map(p => p.id === waste.productId ? { ...p, stock: p.stock - waste.quantity } : p)
          };
        }
        return { productWastes: [...state.productWastes, { ...waste, id: generateId() }] };
      }),
      
      // Quotations
      addQuotation: (quotation) => set((state) => ({
        quotations: [...state.quotations, { ...quotation, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateQuotation: (id, quotation) => set((state) => ({
        quotations: state.quotations.map((q) => q.id === id ? { ...q, ...quotation } : q)
      })),
      deleteQuotation: (id) => set((state) => ({
        quotations: state.quotations.filter((q) => q.id !== id)
      })),
      
      // Users
      addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateUser: (id, user) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...u, ...user } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      })),
      
      // Roles
      addRole: (role) => set((state) => ({
        roles: [...state.roles, { ...role, id: generateId() }]
      })),
      updateRole: (id, role) => set((state) => ({
        roles: state.roles.map((r) => r.id === id ? { ...r, ...role } : r)
      })),
      deleteRole: (id) => set((state) => ({
        roles: state.roles.filter((r) => r.id !== id)
      })),
      
      // Units
      addUnit: (unit) => set((state) => ({
        units: [...state.units, { ...unit, id: generateId() }]
      })),
      updateUnit: (id, unit) => set((state) => ({
        units: state.units.map((u) => u.id === id ? { ...u, ...unit } : u)
      })),
      deleteUnit: (id) => set((state) => ({
        units: state.units.filter((u) => u.id !== id)
      })),
      
      // Currencies
      addCurrency: (currency) => set((state) => ({
        currencies: [...state.currencies, { ...currency, id: generateId() }]
      })),
      updateCurrency: (id, currency) => set((state) => ({
        currencies: state.currencies.map((c) => c.id === id ? { ...c, ...currency } : c)
      })),
      deleteCurrency: (id) => set((state) => ({
        currencies: state.currencies.filter((c) => c.id !== id)
      })),
      
      // Production Stages
      addProductionStage: (stage) => set((state) => ({
        productionStages: [...state.productionStages, { ...stage, id: generateId() }]
      })),
      updateProductionStage: (id, stage) => set((state) => ({
        productionStages: state.productionStages.map((s) => s.id === id ? { ...s, ...stage } : s)
      })),
      deleteProductionStage: (id) => set((state) => ({
        productionStages: state.productionStages.filter((s) => s.id !== id)
      })),
      
      // Stock Adjustments
      addStockAdjustment: (adjustment) => set((state) => {
        const material = state.rawMaterials.find(m => m.id === adjustment.rawMaterialId);
        if (material) {
          const newStock = adjustment.type === 'add' 
            ? material.stock + adjustment.quantity 
            : material.stock - adjustment.quantity;
          return {
            stockAdjustments: [...state.stockAdjustments, { ...adjustment, id: generateId() }],
            rawMaterials: state.rawMaterials.map(m => m.id === adjustment.rawMaterialId ? { ...m, stock: Math.max(0, newStock) } : m)
          };
        }
        return { stockAdjustments: [...state.stockAdjustments, { ...adjustment, id: generateId() }] };
      }),
      
      // Company Profile
      updateCompanyProfile: (profile) => set((state) => ({
        companyProfile: { ...state.companyProfile, ...profile }
      })),
      
      // Backup & Restore
      exportData: () => {
        const state = get();
        const exportObj = {
          outlets: state.outlets,
          products: state.products,
          productCategories: state.productCategories,
          rawMaterials: state.rawMaterials,
          rmCategories: state.rmCategories,
          productions: state.productions,
          sales: state.sales,
          purchases: state.purchases,
          customers: state.customers,
          suppliers: state.suppliers,
          attendance: state.attendance,
          expenses: state.expenses,
          expenseCategories: state.expenseCategories,
          accounts: state.accounts,
          transactions: state.transactions,
          supplierPayments: state.supplierPayments,
          customerReceives: state.customerReceives,
          payrolls: state.payrolls,
          employees: state.employees,
          rmWastes: state.rmWastes,
          productWastes: state.productWastes,
          quotations: state.quotations,
          users: state.users,
          roles: state.roles,
          units: state.units,
          currencies: state.currencies,
          productionStages: state.productionStages,
          stockAdjustments: state.stockAdjustments,
          companyProfile: state.companyProfile,
        };
        return JSON.stringify(exportObj, null, 2);
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set(parsed);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
      
      resetData: () => set(initialState),
    }),
    {
      name: 'iproduction-storage',
    }
  )
);
