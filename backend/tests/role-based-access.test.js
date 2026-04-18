/**
 * Role-Based Access Control Tests
 * Tests the 9-role system and module access control
 */

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import {
  ROLES,
  MODULES,
  hasModuleAccess,
  getAccessibleModules,
  getAllRoles,
  getAllModules,
  isValidRole,
  isValidModule
} from "../role-module-mapping.js";

describe("Role-Based Access Control System", () => {
  
  describe("Role Definitions", () => {
    it("should have 9 defined roles", () => {
      const roles = getAllRoles();
      expect(roles).toHaveLength(9);
    });

    it("should have all required roles", () => {
      const roles = getAllRoles();
      expect(roles).toContain(ROLES.CEO);
      expect(roles).toContain(ROLES.FINANCE_MANAGER);
      expect(roles).toContain(ROLES.SALES_MANAGER);
      expect(roles).toContain(ROLES.PROCUREMENT_MANAGER);
      expect(roles).toContain(ROLES.PRODUCTION_MANAGER);
      expect(roles).toContain(ROLES.QUALITY_MANAGER);
      expect(roles).toContain(ROLES.WAREHOUSE_MANAGER);
      expect(roles).toContain(ROLES.HR_MANAGER);
      expect(roles).toContain(ROLES.SYSTEM_ADMINISTRATOR);
    });

    it("should validate role names correctly", () => {
      expect(isValidRole(ROLES.CEO)).toBe(true);
      expect(isValidRole(ROLES.FINANCE_MANAGER)).toBe(true);
      expect(isValidRole("Invalid Role")).toBe(false);
    });
  });

  describe("Module Definitions", () => {
    it("should have 23 defined modules", () => {
      const modules = getAllModules();
      expect(modules).toHaveLength(23);
    });

    it("should have all required modules", () => {
      const modules = getAllModules();
      expect(modules).toContain(MODULES.DASHBOARD);
      expect(modules).toContain(MODULES.USER_MANAGEMENT);
      expect(modules).toContain(MODULES.SALES);
      expect(modules).toContain(MODULES.INVENTORY);
      expect(modules).toContain(MODULES.ACCOUNTING);
      expect(modules).toContain(MODULES.HR_MANAGEMENT);
    });

    it("should validate module names correctly", () => {
      expect(isValidModule(MODULES.DASHBOARD)).toBe(true);
      expect(isValidModule(MODULES.SALES)).toBe(true);
      expect(isValidModule("Invalid Module")).toBe(false);
    });
  });

  describe("CEO Role Access", () => {
    it("should have access to all 23 modules", () => {
      const modules = getAccessibleModules(ROLES.CEO);
      expect(modules).toHaveLength(23);
    });

    it("should have access to critical modules", () => {
      expect(hasModuleAccess(ROLES.CEO, MODULES.DASHBOARD)).toBe(true);
      expect(hasModuleAccess(ROLES.CEO, MODULES.USER_MANAGEMENT)).toBe(true);
      expect(hasModuleAccess(ROLES.CEO, MODULES.ACCOUNTING)).toBe(true);
      expect(hasModuleAccess(ROLES.CEO, MODULES.SALES)).toBe(true);
    });
  });

  describe("Finance Manager Role Access", () => {
    it("should have access to finance-related modules", () => {
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.ACCOUNTING)).toBe(true);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.INVOICING)).toBe(true);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.PAYMENTS)).toBe(true);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.EXPENSES)).toBe(true);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.PAYROLL)).toBe(true);
    });

    it("should not have access to production modules", () => {
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.PRODUCTION)).toBe(false);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.QUALITY_CONTROL)).toBe(false);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.WAREHOUSE)).toBe(false);
    });

    it("should have access to analytics", () => {
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.ANALYTICS)).toBe(true);
      expect(hasModuleAccess(ROLES.FINANCE_MANAGER, MODULES.REPORTS)).toBe(true);
    });
  });

  describe("Sales Manager Role Access", () => {
    it("should have access to sales-related modules", () => {
      expect(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.SALES)).toBe(true);
      expect(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.ORDERS)).toBe(true);
      expect(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.QUOTATIONS)).toBe(true);
      expect(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.CUSTOMERS)).toBe(true);
    });

    it("should not have access to production modules", () => {
      expect(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.PRODUCTION)).toBe(false);
      expect(hasModuleAccess(ROLES.SALES_MANAGER, MODULES.WAREHOUSE)).toBe(false);
    });
  });

  describe("Procurement Manager Role Access", () => {
    it("should have access to procurement-related modules", () => {
      expect(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.PURCHASES)).toBe(true);
      expect(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.SUPPLIERS)).toBe(true);
      expect(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.PURCHASE_ORDERS)).toBe(true);
    });

    it("should have access to inventory modules", () => {
      expect(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.INVENTORY)).toBe(true);
      expect(hasModuleAccess(ROLES.PROCUREMENT_MANAGER, MODULES.STOCK_MANAGEMENT)).toBe(true);
    });
  });

  describe("Production Manager Role Access", () => {
    it("should have access to production-related modules", () => {
      expect(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.PRODUCTION)).toBe(true);
      expect(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.QUALITY_CONTROL)).toBe(true);
      expect(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.WASTE_MANAGEMENT)).toBe(true);
    });

    it("should have access to inventory modules", () => {
      expect(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.INVENTORY)).toBe(true);
      expect(hasModuleAccess(ROLES.PRODUCTION_MANAGER, MODULES.STOCK_MANAGEMENT)).toBe(true);
    });
  });

  describe("Quality Manager Role Access", () => {
    it("should have access to quality-related modules", () => {
      expect(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.QUALITY_CONTROL)).toBe(true);
      expect(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.PRODUCTION)).toBe(true);
      expect(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.WASTE_MANAGEMENT)).toBe(true);
    });

    it("should not have access to financial modules", () => {
      expect(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.ACCOUNTING)).toBe(false);
      expect(hasModuleAccess(ROLES.QUALITY_MANAGER, MODULES.PAYMENTS)).toBe(false);
    });
  });

  describe("Warehouse Manager Role Access", () => {
    it("should have access to warehouse-related modules", () => {
      expect(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.WAREHOUSE)).toBe(true);
      expect(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.INVENTORY)).toBe(true);
      expect(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.STOCK_MANAGEMENT)).toBe(true);
    });

    it("should have access to order modules", () => {
      expect(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.PURCHASES)).toBe(true);
      expect(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.SALES)).toBe(true);
      expect(hasModuleAccess(ROLES.WAREHOUSE_MANAGER, MODULES.ORDERS)).toBe(true);
    });
  });

  describe("HR Manager Role Access", () => {
    it("should have access to HR-related modules", () => {
      expect(hasModuleAccess(ROLES.HR_MANAGER, MODULES.HR_MANAGEMENT)).toBe(true);
      expect(hasModuleAccess(ROLES.HR_MANAGER, MODULES.PAYROLL)).toBe(true);
      expect(hasModuleAccess(ROLES.HR_MANAGER, MODULES.ATTENDANCE)).toBe(true);
    });

    it("should have access to user management", () => {
      expect(hasModuleAccess(ROLES.HR_MANAGER, MODULES.USER_MANAGEMENT)).toBe(true);
    });

    it("should not have access to financial modules", () => {
      expect(hasModuleAccess(ROLES.HR_MANAGER, MODULES.ACCOUNTING)).toBe(false);
      expect(hasModuleAccess(ROLES.HR_MANAGER, MODULES.INVOICING)).toBe(false);
    });
  });

  describe("System Administrator Role Access", () => {
    it("should have access to all 23 modules", () => {
      const modules = getAccessibleModules(ROLES.SYSTEM_ADMINISTRATOR);
      expect(modules).toHaveLength(23);
    });

    it("should have access to all critical modules", () => {
      expect(hasModuleAccess(ROLES.SYSTEM_ADMINISTRATOR, MODULES.USER_MANAGEMENT)).toBe(true);
      expect(hasModuleAccess(ROLES.SYSTEM_ADMINISTRATOR, MODULES.COMPANY_SETTINGS)).toBe(true);
      expect(hasModuleAccess(ROLES.SYSTEM_ADMINISTRATOR, MODULES.ACCOUNTING)).toBe(true);
    });
  });

  describe("Module Access Consistency", () => {
    it("all roles should have access to Dashboard", () => {
      const roles = getAllRoles();
      roles.forEach(role => {
        expect(hasModuleAccess(role, MODULES.DASHBOARD)).toBe(true);
      });
    });

    it("all roles should have access to Analytics and Reports", () => {
      const roles = getAllRoles();
      roles.forEach(role => {
        expect(hasModuleAccess(role, MODULES.ANALYTICS)).toBe(true);
        expect(hasModuleAccess(role, MODULES.REPORTS)).toBe(true);
      });
    });

    it("no role except CEO and System Admin should have access to Company Settings", () => {
      const roles = getAllRoles();
      roles.forEach(role => {
        if (role === ROLES.CEO || role === ROLES.SYSTEM_ADMINISTRATOR) {
          expect(hasModuleAccess(role, MODULES.COMPANY_SETTINGS)).toBe(true);
        } else {
          expect(hasModuleAccess(role, MODULES.COMPANY_SETTINGS)).toBe(false);
        }
      });
    });
  });

  describe("Access Matrix Integrity", () => {
    it("should have consistent module counts", () => {
      const roles = getAllRoles();
      const moduleCounts = {};

      roles.forEach(role => {
        const modules = getAccessibleModules(role);
        moduleCounts[role] = modules.length;
      });

      // CEO and System Admin should have 23 modules
      expect(moduleCounts[ROLES.CEO]).toBe(23);
      expect(moduleCounts[ROLES.SYSTEM_ADMINISTRATOR]).toBe(23);

      // Other roles should have fewer modules
      expect(moduleCounts[ROLES.FINANCE_MANAGER]).toBeLessThan(23);
      expect(moduleCounts[ROLES.SALES_MANAGER]).toBeLessThan(23);
    });

    it("should not have duplicate modules in any role", () => {
      const roles = getAllRoles();

      roles.forEach(role => {
        const modules = getAccessibleModules(role);
        const uniqueModules = new Set(modules);
        expect(modules).toHaveLength(uniqueModules.size);
      });
    });
  });
});
