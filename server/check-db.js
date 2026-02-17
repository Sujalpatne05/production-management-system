const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function checkAll() {
  console.log('=== DATABASE RECORDS CHECK ===\n');
  
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
    ];
    
    for (const mod of modules) {
      try {
        const count = await p[mod.model].count();
        console.log('✓ ' + mod.name + ': ' + count + ' records');
      } catch(e) {
        console.log('✗ ' + mod.name + ': Error - ' + e.message);
      }
    }
  } finally {
    await p.$disconnect();
  }
}

checkAll();
