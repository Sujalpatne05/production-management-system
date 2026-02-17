const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function testAllModules() {
  console.log('=== TESTING ALL MODULES ===\n');
  
  try {
    // Get a customer for sales and orders
    const customer = await p.customer.findFirst();
    
    // Get a product for orders and productions
    const product = await p.product.findFirst();
    
    // Get an expense category
    let expenseCategory = await p.expenseCategory.findFirst();
    if (!expenseCategory) {
      expenseCategory = await p.expenseCategory.create({
        data: { name: 'Utilities', description: 'Utility expenses' }
      });
    }
    
    const tenantId = 'demo-tenant-id';
    
    // Test 1: Create a Sale
    console.log('1. Testing Sales module...');
    try {
      const sale = await p.sale.create({
        data: {
          invoiceNo: 'INV-TEST-' + Date.now(),
          customerId: customer.id,
          tenantId: tenantId,
          subtotal: 5000,
          taxAmount: 0,
          total: 5000,
          status: 'draft',
          saleDate: new Date(),
        }
      });
      console.log('   ✓ Sale created:', sale.invoiceNo);
    } catch(e) {
      console.log('   ✗ Sale creation failed:', e.message);
    }
    
    // Test 2: Create an Order
    console.log('2. Testing Orders module...');
    try {
      const order = await p.order.create({
        data: {
          tenantId: tenantId,
          total: 3000,
          status: 'pending',
        }
      });
      console.log('   ✓ Order created with ID:', order.id);
    } catch(e) {
      console.log('   ✗ Order creation failed:', e.message);
    }
    
    // Test 3: Create a Production
    console.log('3. Testing Productions module...');
    try {
      const production = await p.production.create({
        data: {
          productId: product.id,
          tenantId: tenantId,
          referenceNo: 'REF-' + Date.now(),
          quantity: 50,
          status: 'draft',
          stage: 'planning',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7*24*60*60*1000),
        }
      });
      console.log('   ✓ Production created:', production.referenceNo);
    } catch(e) {
      console.log('   ✗ Production creation failed:', e.message);
    }
    
    // Test 4: Create an Expense
    console.log('4. Testing Expenses module...');
    try {
      const expense = await p.expense.create({
        data: {
          description: 'Test Expense - ' + Date.now(),
          amount: 1000,
          categoryId: expenseCategory.id,
          tenantId: tenantId,
          expenseDate: new Date(),
          status: 'draft',
        }
      });
      console.log('   ✓ Expense created:', expense.description);
    } catch(e) {
      console.log('   ✗ Expense creation failed:', e.message);
    }
    
    // Now check final counts
    console.log('\n=== FINAL DATABASE STATUS ===\n');
    
    const modules = [
      { name: 'Orders', model: 'order' },
      { name: 'Sales', model: 'sale' },
      { name: 'Productions', model: 'production' },
      { name: 'Expenses', model: 'expense' },
    ];
    
    for (const mod of modules) {
      const count = await p[mod.model].count();
      console.log('✓ ' + mod.name + ': ' + count + ' records');
    }
    
  } finally {
    await p.$disconnect();
  }
}

testAllModules();
