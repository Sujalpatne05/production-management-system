import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Roles
  const roles = ['Admin', 'Manager', 'User', 'Supervisor'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Roles created');

  // Create Permissions
  const permissions = [
    { code: 'orders.read', description: 'Read orders' },
    { code: 'orders.write', description: 'Create or update orders' },
    { code: 'orders.delete', description: 'Delete orders' },
    { code: 'users.read', description: 'Read users' },
    { code: 'users.write', description: 'Manage users' },
    { code: 'users.delete', description: 'Delete users' },
    { code: 'tenants.manage', description: 'Manage tenants' },
    { code: 'production.read', description: 'Read production data' },
    { code: 'production.write', description: 'Manage production' },
    { code: 'inventory.read', description: 'Read inventory' },
    { code: 'inventory.write', description: 'Manage inventory' },
    { code: 'reports.view', description: 'View reports' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { description: perm.description },
      create: perm,
    });
  }
  console.log('✅ Permissions created');

  // Assign permissions to roles
  const rolePermMap: Record<string, string[]> = {
    Admin: permissions.map((p) => p.code), // All permissions
    Manager: [
      'orders.read',
      'orders.write',
      'users.read',
      'production.read',
      'production.write',
      'inventory.read',
      'inventory.write',
      'reports.view',
    ],
    Supervisor: [
      'orders.read',
      'production.read',
      'production.write',
      'inventory.read',
      'reports.view',
    ],
    User: ['orders.read', 'production.read', 'inventory.read'],
  };

  for (const [roleName, codes] of Object.entries(rolePermMap)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;
    for (const code of codes) {
      const perm = await prisma.permission.findUnique({ where: { code } });
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }
  console.log('✅ Role permissions assigned');

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant-id' },
    update: {},
    create: {
      id: 'demo-tenant-id',
      name: 'Demo Company',
      plan: 'enterprise',
      status: 'active',
    },
  });
  console.log('✅ Demo tenant created');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      fullName: 'Admin User',
      status: 'active',
    },
  });
  console.log('✅ Demo user created');

  // Assign admin role to demo user
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_tenantId_roleId: {
          userId: user.id,
          tenantId: tenant.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        tenantId: tenant.id,
        roleId: adminRole.id,
      },
    });
    console.log('✅ Admin role assigned to demo user');
  }

  // Create default currency
  await prisma.currency.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'USD' } },
    update: {},
    create: {
      tenantId: tenant.id,
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 1,
      isDefault: true,
    },
  });
  console.log('✅ Default currency created');

  // Create production stages
  const stages = [
    { name: 'Planning', sequenceNo: 1 },
    { name: 'Raw Materials Prep', sequenceNo: 2 },
    { name: 'Production', sequenceNo: 3 },
    { name: 'Quality Check', sequenceNo: 4 },
    { name: 'Packaging', sequenceNo: 5 },
    { name: 'Completed', sequenceNo: 6 },
  ];
  for (const stage of stages) {
    await prisma.productionStage.upsert({
      where: { name: stage.name },
      update: {},
      create: stage,
    });
  }
  console.log('✅ Production stages created');

  // Create product categories
  const productCats = [
    { name: 'Electronics', description: 'Electronic products' },
    { name: 'Furniture', description: 'Furniture items' },
    { name: 'Textiles', description: 'Textile products' },
    { name: 'Chemicals', description: 'Chemical products' },
  ];
  const createdCategories: any[] = [];
  for (const cat of productCats) {
    const category = await prisma.productCategory.create({
      data: cat,
    });
    createdCategories.push(category);
  }
  console.log('✅ Product categories created');

  // Create products
  const products = [
    {
      tenantId: tenant.id,
      categoryId: createdCategories[0].id,
      name: 'Smart Speaker',
      sku: 'SPK-001',
      unitOfMeasure: 'piece',
      cost: 25,
      sellingPrice: 49.99,
      reorderLevel: 20,
    },
    {
      tenantId: tenant.id,
      categoryId: createdCategories[1].id,
      name: 'Office Chair',
      sku: 'CHR-001',
      unitOfMeasure: 'piece',
      cost: 80,
      sellingPrice: 199.99,
      reorderLevel: 10,
    },
    {
      tenantId: tenant.id,
      categoryId: createdCategories[2].id,
      name: 'Cotton Fabric',
      sku: 'FAB-001',
      unitOfMeasure: 'meter',
      cost: 5,
      sellingPrice: 12.99,
      reorderLevel: 100,
    },
  ];
  const createdProducts: any[] = [];
  for (const product of products) {
    const p = await prisma.product.create({ data: product });
    createdProducts.push(p);
  }
  console.log('✅ Products created');

  // Create raw material categories
  const rmCategories = [
    { name: 'Plastics' },
    { name: 'Metals' },
    { name: 'Fabrics' },
    { name: 'Chemicals' },
  ];
  const createdRMCats: any[] = [];
  for (const cat of rmCategories) {
    const c = await prisma.rawMaterialCategory.create({ data: cat });
    createdRMCats.push(c);
  }
  console.log('✅ Raw material categories created');

  // Create raw materials
  const rawMaterials = [
    {
      tenantId: tenant.id,
      categoryId: createdRMCats[0].id,
      name: 'ABS Plastic Pellets',
      sku: 'ABS-001',
      unitOfMeasure: 'kg',
      cost: 2,
      reorderLevel: 500,
    },
    {
      tenantId: tenant.id,
      categoryId: createdRMCats[2].id,
      name: 'Cotton Thread',
      sku: 'THD-001',
      unitOfMeasure: 'spool',
      cost: 1.5,
      reorderLevel: 50,
    },
  ];
  const createdRMs: any[] = [];
  for (const rm of rawMaterials) {
    const r = await prisma.rawMaterial.create({ data: rm });
    createdRMs.push(r);
  }
  console.log('✅ Raw materials created');

  // Create stocks for products
  for (const product of createdProducts) {
    await prisma.stock.create({
      data: {
        tenantId: tenant.id,
        productId: product.id,
        quantity: 100,
        warehouseLocation: 'WH-A-01',
      },
    });
  }
  console.log('✅ Product stocks created');

  // Create stocks for raw materials
  for (const rm of createdRMs) {
    await prisma.stock.create({
      data: {
        tenantId: tenant.id,
        rawMaterialId: rm.id,
        quantity: 1000,
        warehouseLocation: 'WH-B-01',
      },
    });
  }
  console.log('✅ Raw material stocks created');

  // Create customers
  const customers = [
    {
      tenantId: tenant.id,
      name: 'ABC Corp',
      email: 'sales@abccorp.com',
      phone: '555-0001',
      city: 'New York',
      country: 'USA',
    },
    {
      tenantId: tenant.id,
      name: 'XYZ Industries',
      email: 'info@xyz.com',
      phone: '555-0002',
      city: 'Los Angeles',
      country: 'USA',
    },
  ];
  const createdCustomers: any[] = [];
  for (const cust of customers) {
    const c = await prisma.customer.create({ data: cust });
    createdCustomers.push(c);
  }
  console.log('✅ Customers created');

  // Create suppliers
  const suppliers = [
    {
      tenantId: tenant.id,
      name: 'Global Supplies Inc',
      email: 'orders@globalsupplies.com',
      phone: '555-1001',
      city: 'Chicago',
      country: 'USA',
    },
    {
      tenantId: tenant.id,
      name: 'Premium Materials Ltd',
      email: 'sales@premium.com',
      phone: '555-1002',
      city: 'Toronto',
      country: 'Canada',
    },
  ];
  const createdSuppliers: any[] = [];
  for (const supp of suppliers) {
    const s = await prisma.supplier.create({ data: supp });
    createdSuppliers.push(s);
  }
  console.log('✅ Suppliers created');

  // Create factory
  await prisma.factory.create({
    data: {
      tenantId: tenant.id,
      name: 'Main Production Facility',
      address: '123 Industrial Ave',
      city: 'Detroit',
      province: 'Michigan',
      country: 'USA',
      capacity: 10000,
    },
  });
  console.log('✅ Factory created');

  // Create expense categories
  const expenseCats = [
    { name: 'Utilities' },
    { name: 'Maintenance' },
    { name: 'Labor' },
    { name: 'Marketing' },
  ];
  for (const cat of expenseCats) {
    await prisma.expenseCategory.upsert({
      where: { id: `exp-${cat.name.toLowerCase()}` },
      update: {},
      create: { id: `exp-${cat.name.toLowerCase()}`, ...cat },
    });
  }
  console.log('✅ Expense categories created');

  // Create chart of accounts
  const accounts = [
    { code: '1000', name: 'Cash', type: 'asset', subType: 'current_asset' },
    { code: '1100', name: 'Accounts Receivable', type: 'asset', subType: 'current_asset' },
    { code: '1200', name: 'Inventory', type: 'asset', subType: 'current_asset' },
    { code: '2000', name: 'Accounts Payable', type: 'liability', subType: 'current_liability' },
    { code: '3000', name: 'Owner Equity', type: 'equity', subType: 'equity' },
    { code: '4000', name: 'Sales Revenue', type: 'income', subType: 'revenue' },
    { code: '5000', name: 'Cost of Goods Sold', type: 'expense', subType: 'expense' },
    { code: '6000', name: 'Operating Expenses', type: 'expense', subType: 'expense' },
  ];
  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: acc.code } },
      update: {},
      create: { tenantId: tenant.id, ...acc },
    });
  }
  console.log('✅ Chart of accounts created');

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
