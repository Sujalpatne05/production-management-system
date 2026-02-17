const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function testRemainingModules() {
  console.log('=== TESTING REMAINING EMPTY MODULES ===\n');
  
  try {
    // Get a customer for quotation and payment
    const customer = await p.customer.findFirst();
    const sale = await p.sale.findFirst();
    const purchase = await p.purchase.findFirst();
    const tenantId = 'demo-tenant-id';
    
    // Test 1: Create a Quotation
    console.log('1. Testing Quotations module...');
    try {
      const quotation = await p.quotation.create({
        data: {
          customerId: customer.id,
          tenantId: tenantId,
          status: 'draft',
          validUntil: new Date(Date.now() + 30*24*60*60*1000),
        }
      });
      console.log('   ✓ Quotation created:', quotation.id);
    } catch(e) {
      console.log('   ✗ Quotation creation failed:', e.message.split('\n')[0]);
    }
    
    // Test 2: Create a Payment
    console.log('2. Testing Payments module...');
    try {
      const payment = await p.payment.create({
        data: {
          tenantId: tenantId,
          saleId: sale?.id,
          amount: 1000,
          paymentDate: new Date(),
          method: 'cash',
          status: 'completed',
        }
      });
      console.log('   ✓ Payment created:', payment.id);
    } catch(e) {
      console.log('   ✗ Payment creation failed:', e.message.split('\n')[0]);
    }
    
    // Test 3: Create an Approval
    console.log('3. Testing Approvals module...');
    try {
      const approval = await p.approval.create({
        data: {
          tenantId: tenantId,
          entityType: 'SALE',
          entityId: sale?.id,
          status: 'pending',
          level: 1,
        }
      });
      console.log('   ✓ Approval created:', approval.id);
    } catch(e) {
      console.log('   ✗ Approval creation failed:', e.message.split('\n')[0]);
    }
    
    // Test 4: Create an Audit Log
    console.log('4. Testing Audit Logs module...');
    try {
      const auditLog = await p.auditLog.create({
        data: {
          tenantId: tenantId,
          userId: 'test-user',
          action: 'CREATE',
          entityType: 'SALE',
          entityId: sale?.id,
          changes: {},
        }
      });
      console.log('   ✓ Audit Log created:', auditLog.id);
    } catch(e) {
      console.log('   ✗ Audit Log creation failed:', e.message.split('\n')[0]);
    }
    
    // Test 5: Create a Budget
    console.log('5. Testing Budgets module...');
    try {
      const budget = await p.budget.create({
        data: {
          tenantId: tenantId,
          name: 'Test Budget - ' + Date.now(),
          amount: 100000,
          status: 'draft',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365*24*60*60*1000),
        }
      });
      console.log('   ✓ Budget created:', budget.name);
    } catch(e) {
      console.log('   ✗ Budget creation failed:', e.message.split('\n')[0]);
    }
    
    // Test 6: Create a Forecast
    console.log('6. Testing Forecasts module...');
    try {
      const forecast = await p.forecast.create({
        data: {
          tenantId: tenantId,
          name: 'Test Forecast - ' + Date.now(),
          status: 'draft',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30*24*60*60*1000),
        }
      });
      console.log('   ✓ Forecast created:', forecast.name);
    } catch(e) {
      console.log('   ✗ Forecast creation failed:', e.message.split('\n')[0]);
    }
    
    // Now check final counts
    console.log('\n=== FINAL STATUS ===\n');
    
    const modules = [
      { name: 'Quotations', model: 'quotation' },
      { name: 'Payments', model: 'payment' },
      { name: 'Approvals', model: 'approval' },
      { name: 'Audit Logs', model: 'auditLog' },
      { name: 'Budgets', model: 'budget' },
      { name: 'Forecasts', model: 'forecast' },
    ];
    
    for (const mod of modules) {
      try {
        const count = await p[mod.model].count();
        console.log('✓ ' + mod.name + ': ' + count + ' records');
      } catch(e) {
        console.log('✗ ' + mod.name + ': Not available');
      }
    }
    
  } finally {
    await p.$disconnect();
  }
}

testRemainingModules();
