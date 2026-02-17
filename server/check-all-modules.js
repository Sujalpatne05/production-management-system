const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function checkAllModules() {
  console.log('=== COMPLETE DATABASE INVENTORY ===\n');
  
  try {
    const modules = [
      { name: 'Tenants', model: 'tenant' },
      { name: 'Users', model: 'user' },
      { name: 'Suppliers', model: 'supplier' },
      { name: 'Customers', model: 'customer' },
      { name: 'Products', model: 'product' },
      { name: 'RawMaterials', model: 'rawMaterial' },
      { name: 'Orders', model: 'order' },
      { name: 'Sales', model: 'sale' },
      { name: 'Purchases', model: 'purchase' },
      { name: 'Productions', model: 'production' },
      { name: 'Stocks', model: 'stock' },
      { name: 'Expenses', model: 'expense' },
      { name: 'Accounts', model: 'account' },
      { name: 'BOMs', model: 'bom' },
      { name: 'QC Inspections', model: 'qcInspection' },
      { name: 'GRNs', model: 'grn' },
      { name: 'Budgets', model: 'budget' },
      { name: 'Forecasts', model: 'forecast' },
      { name: 'Quotations', model: 'quotation' },
      { name: 'Payments', model: 'payment' },
      { name: 'Approvals', model: 'approval' },
      { name: 'Audit Logs', model: 'auditLog' },
    ];
    
    let totalRecords = 0;
    const activeModules = [];
    const emptyModules = [];
    
    for (const mod of modules) {
      try {
        const count = await p[mod.model].count();
        console.log((count > 0 ? '✓' : '○') + ' ' + mod.name + ': ' + count + ' records');
        totalRecords += count;
        if (count > 0) {
          activeModules.push({ name: mod.name, count });
        } else {
          emptyModules.push(mod.name);
        }
      } catch(e) {
        console.log('✗ ' + mod.name + ': Model not found or error');
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('Total Records: ' + totalRecords);
    console.log('Active Modules: ' + activeModules.length);
    console.log('Empty Modules: ' + emptyModules.length);
    
    if (emptyModules.length > 0) {
      console.log('\nEmpty Modules (0 records):');
      emptyModules.forEach(m => console.log('  • ' + m));
    }
    
  } finally {
    await p.$disconnect();
  }
}

checkAllModules();
