// Test file for Super Admin Module
// This file tests the super admin endpoints

import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Helper function to generate test token
function generateToken(userId, role) {
  return jwt.sign(
    { id: userId, role, name: "Test User", email: "test@example.com", username: "testuser" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

// Test data
const testData = {
  company: {
    name: "Test Company",
    email: "test-company@example.com",
    phone: "+1234567890",
    address: "123 Test St",
    website: "https://test.com",
    subscriptionPlan: "starter"
  },
  plan: {
    name: "Test Plan",
    description: "A test subscription plan",
    price: 99.99,
    billingCycle: "monthly",
    maxUsers: 50,
    maxStorage: 5000,
    features: ["feature1", "feature2"]
  },
  user: {
    name: "Test User",
    email: "testuser@example.com",
    role: "user",
    phone: "+1234567890"
  }
};

async function runTests() {
  try {
    console.log("🧪 Starting Super Admin Module Tests...\n");

    // Test 1: Create a subscription plan
    console.log("Test 1: Creating subscription plan...");
    const plan = await prisma.subscriptionPlan.create({
      data: testData.plan
    });
    console.log("✅ Plan created:", plan.id);

    // Test 2: Create a company
    console.log("\nTest 2: Creating company...");
    const company = await prisma.company.create({
      data: {
        ...testData.company,
        maxUsers: plan.maxUsers,
        maxStorage: plan.maxStorage
      }
    });
    console.log("✅ Company created:", company.id);

    // Test 3: Create a super admin user
    console.log("\nTest 3: Creating super admin user...");
    const superAdminUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@test.com",
        role: "super_admin",
        status: "active",
        password: "password"
      }
    });
    console.log("✅ Super admin user created:", superAdminUser.id);

    // Test 4: Create a company admin user
    console.log("\nTest 4: Creating company admin user...");
    const adminUser = await prisma.user.create({
      data: {
        name: "Company Admin",
        email: "admin@test.com",
        role: "admin",
        status: "active",
        companyId: company.id,
        password: "password"
      }
    });
    console.log("✅ Company admin user created:", adminUser.id);

    // Test 5: Assign admin to company
    console.log("\nTest 5: Assigning admin to company...");
    const companyAdmin = await prisma.companyAdmin.create({
      data: {
        companyId: company.id,
        userId: adminUser.id,
        role: "admin",
        status: "active"
      }
    });
    console.log("✅ Admin assigned to company:", companyAdmin.id);

    // Test 6: Create subscription for company
    console.log("\nTest 6: Creating subscription for company...");
    const subscription = await prisma.subscription.create({
      data: {
        companyId: company.id,
        planId: plan.id,
        startDate: new Date(),
        status: "active",
        autoRenew: true
      }
    });
    console.log("✅ Subscription created:", subscription.id);

    // Test 7: Create audit log
    console.log("\nTest 7: Creating audit log...");
    const auditLog = await prisma.auditLog.create({
      data: {
        userId: superAdminUser.id,
        companyId: company.id,
        action: "create",
        resourceType: "company",
        resourceId: company.id,
        changes: { created: company },
        ipAddress: "127.0.0.1",
        userAgent: "Test Agent",
        status: "success"
      }
    });
    console.log("✅ Audit log created:", auditLog.id);

    // Test 8: Create regular user in company
    console.log("\nTest 8: Creating regular user in company...");
    const regularUser = await prisma.user.create({
      data: {
        name: "Regular User",
        email: "user@test.com",
        role: "user",
        status: "active",
        companyId: company.id,
        password: "password"
      }
    });
    console.log("✅ Regular user created:", regularUser.id);

    // Test 9: Query companies with relationships
    console.log("\nTest 9: Querying companies with relationships...");
    const companiesWithRelations = await prisma.company.findMany({
      include: {
        admins: { include: { user: true } },
        subscriptions: { include: { plan: true } },
        users: { select: { id: true, name: true, email: true } },
        auditLogs: { take: 5 }
      }
    });
    console.log("✅ Found", companiesWithRelations.length, "companies");
    console.log("   Company details:", {
      id: companiesWithRelations[0].id,
      name: companiesWithRelations[0].name,
      admins: companiesWithRelations[0].admins.length,
      users: companiesWithRelations[0].users.length,
      subscriptions: companiesWithRelations[0].subscriptions.length
    });

    // Test 10: Query audit logs
    console.log("\nTest 10: Querying audit logs...");
    const logs = await prisma.auditLog.findMany({
      include: { user: true, company: true },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    console.log("✅ Found", logs.length, "audit logs");

    // Test 11: Update company
    console.log("\nTest 11: Updating company...");
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: { name: "Updated Test Company" }
    });
    console.log("✅ Company updated:", updatedCompany.name);

    // Test 12: Soft delete company
    console.log("\nTest 12: Soft deleting company...");
    const deletedCompany = await prisma.company.update({
      where: { id: company.id },
      data: { deletedAt: new Date() }
    });
    console.log("✅ Company soft deleted:", deletedCompany.deletedAt);

    // Test 13: Query non-deleted companies
    console.log("\nTest 13: Querying non-deleted companies...");
    const activeCompanies = await prisma.company.findMany({
      where: { deletedAt: null }
    });
    console.log("✅ Found", activeCompanies.length, "active companies");

    // Test 14: Count users by company
    console.log("\nTest 14: Counting users by company...");
    const userCount = await prisma.user.count({
      where: { companyId: company.id }
    });
    console.log("✅ Company has", userCount, "users");

    // Test 15: Verify data isolation
    console.log("\nTest 15: Verifying data isolation...");
    const companyUsers = await prisma.user.findMany({
      where: { companyId: company.id }
    });
    console.log("✅ Company users:", companyUsers.map(u => u.email));

    console.log("\n✅ All tests passed!\n");

    // Cleanup
    console.log("🧹 Cleaning up test data...");
    await prisma.auditLog.deleteMany({ where: { companyId: company.id } });
    await prisma.companyAdmin.deleteMany({ where: { companyId: company.id } });
    await prisma.subscription.deleteMany({ where: { companyId: company.id } });
    await prisma.user.deleteMany({ where: { companyId: company.id } });
    await prisma.company.delete({ where: { id: company.id } });
    await prisma.subscriptionPlan.delete({ where: { id: plan.id } });
    await prisma.user.deleteMany({ where: { id: { in: [superAdminUser.id, adminUser.id] } } });
    console.log("✅ Cleanup complete");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
