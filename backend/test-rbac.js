/**
 * Simple test runner for Role-Based Access Control
 * Run with: node test-rbac.js
 */

import {
  ROLES,
  MODULES,
  hasModuleAccess,
  getAccessibleModules,
  getAllRoles,
  getAllModules,
  isValidRole,
  isValidModule,
  ROLE_MODULE_ACCESS
} from "./role-module-mapping.js";

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passedTests++;
  } else {
    console.log(`❌ ${message}`);
    failedTests++;
  }
}

function testSection(name) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${name}`);
  console.log(`${'='.repeat(60)}`);
}

// Test 1: Role Definitions
testSection("Role Definitions");
const roles = getAllRoles();
assert(roles.length === 9, "Should have 9 defined roles");
assert(roles.includes(ROLES.CEO), "Should include CEO role");
assert(roles.includes(ROLES.FINANCE_MANAGER), "Should include Finance Manager role");
assert(roles.includes(ROLES.SALES_MANAGER), "Should include Sales Manager role");
assert(roles.includes(ROLES.PROCUREMENT_MANAGER), "Should include Procurement Manager role");
assert(roles.includes(ROLES.PRODUCTION_MANAGER), "Should include Production Manager role");
assert(roles.includes(ROLES.QUALITY_MANAGER), "Should include Quality Manager role");
assert(roles.includes(ROLES.WAREHOUSE_MANAGER), "Should include Warehouse Manager role");
assert(roles.includes(ROLES.HR_MANAGER), "Should include HR Manager role");
assert(roles.includes(ROLES.SYSTEM_ADMINISTRATOR), "Should include System Administrator role");

// Test 2: Module Definitions
testSection("Module Definitions");
const modules = getAllModules();
assert(modules.length === 23, "Should have 23 defined modules");
assert(modules.includes(MODULES.DASHBOARD), "Should include Dashboard module");
assert(modules.includes(MODULES.USER_MANAGEMENT), "Should include User Management module");
assert(modules.includes(MODULES.SALES), "Should include Sales module");
assert(modules.includes(MODULES.ACCOUNTING), "Should include Accounting module");

// Test 3: CEO Role Access
testSection("CEO Role Access");
const ceoModules = getAccessibleModules(ROLES.CEO);
assert(ceoModules.length === 23, "CEO should have access to all 23 modules");
assert(hasModuleAccess(ROLES.CEO, MODULES.DASHBOARD), "CEO should have access to Dashboard");
assert(hasModuleAccess(ROLES.CEO, MODULES.ACCOUNTING), "CEO should have access to Accounting");
assert(hasModuleAccess(ROLES.CEO, MODULES.SALES), "CEO should have access to Sales");

// Test 4: Finance Manager Role Access
testSection("Finance Manager Role Access");
const financeModules = getAccessibleModules(ROLES.FINANCE_MANAGER);
assert(financeModules.length > 0, "Finance Manager should have access to some modules");
assert(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.ACCOUNTING), "Finance Manager should have access to Accounting");
assert(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.INVOICING), "Finance Manager should have access to Invoicing");
assert(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.PAYMENTS), "Finance Manager should have access to Payments");
assert(!hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.PRODUCTION), "Finance Manager should NOT have access to Production");
assert(!hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.WAREHOUSE), "Finance Manager should NOT have access to Warehouse");

// Test 5: Sales Manager Role Access
testSection("Sales Manager Role Access");
assert(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.SALES), "Sales Manager should have access to Sales");
assert(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.ORDERS), "Sales Manager should have access to Orders");
assert(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.CUSTOMERS), "Sales Manager should have access to Customers");
assert(!hasModuleAccess(ROLES.SALES_MANAGER, MODULES.PRODUCTION), "Sales Manager should NOT have access to Production");

// Test 6: Procurement Manager Role Access
testSection("Procurement Manager Role Access");
assert(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.PURCHASES), "Procurement Manager should have access to Purchases");
assert(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.SUPPLIERS), "Procurement Manager should have access to Suppliers");
assert(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.INVENTORY), "Procurement Manager should have access to Inventory");

// Test 7: Production Manager Role Access
testSection("Production Manager Role Access");
assert(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.PRODUCTION), "Production Manager should have access to Production");
assert(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.QUALITY_CONTROL), "Production Manager should have access to Quality Control");
assert(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.INVENTORY), "Production Manager should have access to Inventory");

// Test 8: Quality Manager Role Access
testSection("Quality Manager Role Access");
assert(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.QUALITY_CONTROL), "Quality Manager should have access to Quality Control");
assert(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.PRODUCTION), "Quality Manager should have access to Production");
assert(!hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.ACCOUNTING), "Quality Manager should NOT have access to Accounting");

// Test 9: Warehouse Manager Role Access
testSection("Warehouse Manager Role Access");
assert(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.WAREHOUSE), "Warehouse Manager should have access to Warehouse");
assert(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.INVENTORY), "Warehouse Manager should have access to Inventory");
assert(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.STOCK_MANAGEMENT), "Warehouse Manager should have access to Stock Management");

// Test 10: HR Manager Role Access
testSection("HR Manager Role Access");
assert(hasModuleAccess(ROLES.HR_MANAGER, MODULES.HR_MANAGEMENT), "HR Manager should have access to HR Management");
assert(hasModuleAccess(ROLES.HR_MANAGER, MODULES.PAYROLL), "HR Manager should have access to Payroll");
assert(hasModuleAccess(ROLES.HR_MANAGER, MODULES.ATTENDANCE), "HR Manager should have access to Attendance");
assert(!hasModuleAccess(ROLES.HR_MANAGER, MODULES.ACCOUNTING), "HR Manager should NOT have access to Accounting");

// Test 11: System Administrator Role Access
testSection("System Administrator Role Access");
const sysAdminModules = getAccessibleModules(ROLES.SYSTEM_ADMINISTRATOR);
assert(sysAdminModules.length === 23, "System Administrator should have access to all 23 modules");
assert(hasModuleAccess(ROLES.SYSTEM_ADMINISTRATOR, MODULES.USER_MANAGEMENT), "System Administrator should have access to User Management");

// Test 12: Role Validation
testSection("Role Validation");
assert(isValidRole(ROLES.CEO), "CEO should be a valid role");
assert(isValidRole(ROLES.FINANCE_MANAGER), "Finance Manager should be a valid role");
assert(!isValidRole("Invalid Role"), "Invalid Role should not be valid");

// Test 13: Module Validation
testSection("Module Validation");
assert(isValidModule(MODULES.DASHBOARD), "Dashboard should be a valid module");
assert(isValidModule(MODULES.SALES), "Sales should be a valid module");
assert(!isValidModule("Invalid Module"), "Invalid Module should not be valid");

// Test 14: Access Matrix Consistency
testSection("Access Matrix Consistency");
let allRolesHaveDashboard = true;
let allRolesHaveAnalytics = true;

for (const role of getAllRoles()) {
  if (!hasModuleAccess(role, MODULES.DASHBOARD)) allRolesHaveDashboard = false;
  if (!hasModuleAccess(role, MODULES.ANALYTICS)) allRolesHaveAnalytics = false;
}

assert(allRolesHaveDashboard, "All roles should have access to Dashboard");
assert(allRolesHaveAnalytics, "All roles should have access to Analytics");

// Test 15: No Duplicate Modules
testSection("No Duplicate Modules");
let noDuplicates = true;
for (const role of getAllRoles()) {
  const modules = getAccessibleModules(role);
  const uniqueModules = new Set(modules);
  if (modules.length !== uniqueModules.size) {
    noDuplicates = false;
    console.log(`❌ Role ${role} has duplicate modules`);
  }
}
assert(noDuplicates, "No role should have duplicate modules");

// Test 16: Module Count Verification
testSection("Module Count Verification");
const moduleCounts = {};
for (const role of getAllRoles()) {
  moduleCounts[role] = getAccessibleModules(role).length;
}

console.log("\nModule counts by role:");
for (const [role, count] of Object.entries(moduleCounts)) {
  console.log(`  ${role}: ${count} modules`);
}

assert(moduleCounts[ROLES.CEO] === 23, "CEO should have 23 modules");
assert(moduleCounts[ROLES.SYSTEM_ADMINISTRATOR] === 23, "System Administrator should have 23 modules");
assert(moduleCounts[ROLES.FINANCE_MANAGER] < 23, "Finance Manager should have less than 23 modules");

// Summary
testSection("Test Summary");
const totalTests = passedTests + failedTests;
console.log(`\n✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${failedTests}/${totalTests}`);
console.log(`\nSuccess Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

if (failedTests === 0) {
  console.log("\n🎉 All tests passed!");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failedTests} test(s) failed`);
  process.exit(1);
}
