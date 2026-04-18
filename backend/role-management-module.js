/**
 * Role Management Module
 * Provides endpoints for managing user roles and module access
 */

import {
  ROLES,
  MODULES,
  ROLE_MODULE_ACCESS,
  getAllRoles,
  getAllModules,
  getAccessibleModules,
  hasModuleAccess,
  isValidRole
} from "./role-module-mapping.js";

export function setupRoleManagementModule(app, prisma, authenticateToken, authorize) {
  
  // =====================
  // ROLE MANAGEMENT
  // =====================

  /**
   * Get all available roles
   * Super Admin only
   */
  app.get("/api/super-admin/roles", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const roles = getAllRoles();
      
      res.json({
        success: true,
        data: roles.map(role => ({
          name: role,
          modules: getAccessibleModules(role),
          moduleCount: getAccessibleModules(role).length
        }))
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Get role details with module access
   * Super Admin only
   */
  app.get("/api/super-admin/roles/:roleName", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { roleName } = req.params;

      if (!isValidRole(roleName)) {
        return res.status(404).json({ success: false, error: "Role not found" });
      }

      const modules = getAccessibleModules(roleName);

      res.json({
        success: true,
        data: {
          name: roleName,
          modules,
          moduleCount: modules.length,
          description: getRoleDescription(roleName)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Get all available modules
   * Super Admin only
   */
  app.get("/api/super-admin/modules", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const modules = getAllModules();
      
      res.json({
        success: true,
        data: modules,
        total: modules.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Get user's accessible modules
   * Authenticated users
   */
  app.get("/api/user/accessible-modules", authenticateToken, async (req, res) => {
    try {
      const modules = getAccessibleModules(req.user.role);

      res.json({
        success: true,
        data: {
          role: req.user.role,
          modules,
          moduleCount: modules.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Check if user has access to a module
   * Authenticated users
   */
  app.post("/api/user/check-module-access", authenticateToken, async (req, res) => {
    try {
      const { module } = req.body;

      if (!module) {
        return res.status(400).json({ success: false, error: "Module name is required" });
      }

      const hasAccess = hasModuleAccess(req.user.role, module);

      res.json({
        success: true,
        data: {
          module,
          role: req.user.role,
          hasAccess,
          message: hasAccess ? "Access granted" : "Access denied"
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Get role-module access matrix
   * Super Admin only
   */
  app.get("/api/super-admin/role-module-matrix", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const matrix = {};

      Object.entries(ROLE_MODULE_ACCESS).forEach(([role, modules]) => {
        matrix[role] = {
          moduleCount: modules.length,
          modules: modules
        };
      });

      res.json({
        success: true,
        data: matrix,
        totalRoles: Object.keys(matrix).length,
        totalModules: getAllModules().length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Get users by role
   * Super Admin only
   */
  app.get("/api/super-admin/users-by-role/:role", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { role } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      if (!isValidRole(role)) {
        return res.status(400).json({ success: false, error: "Invalid role" });
      }

      const users = await prisma.user.findMany({
        where: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          companyId: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.user.count({ where: { role } });

      res.json({
        success: true,
        data: users,
        total,
        role,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Assign role to user
   * Super Admin only
   */
  app.post("/api/super-admin/assign-role", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { userId, role } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required" });
      }

      if (!role) {
        return res.status(400).json({ success: false, error: "Role is required" });
      }

      if (!isValidRole(role)) {
        return res.status(400).json({ success: false, error: "Invalid role" });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      // Update user role
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: user.companyId,
        action: "assign_role",
        resourceType: "user",
        resourceId: userId,
        changes: {
          before: { role: user.role },
          after: { role: updatedUser.role }
        },
        ipAddress,
        userAgent
      });

      res.json({
        success: true,
        data: updatedUser,
        message: `Role assigned successfully. User now has access to ${getAccessibleModules(role).length} modules`
      });
    } catch (error) {
      console.error("Error assigning role:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Get role statistics
   * Super Admin only
   */
  app.get("/api/super-admin/role-statistics", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const stats = {};

      for (const role of getAllRoles()) {
        const count = await prisma.user.count({ where: { role } });
        stats[role] = {
          userCount: count,
          moduleCount: getAccessibleModules(role).length
        };
      }

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Role Management Module initialized");
}

/**
 * Helper function to create audit logs
 */
async function createAuditLog(prisma, { userId, companyId, action, resourceType, resourceId, changes, ipAddress, userAgent, status = "success", errorMessage = null }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        companyId,
        action,
        resourceType,
        resourceId,
        changes,
        ipAddress,
        userAgent,
        status,
        errorMessage
      }
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
}

/**
 * Get role description
 */
function getRoleDescription(role) {
  const descriptions = {
    [ROLES.CEO]: "Chief Executive Officer - Full access to all modules and company operations",
    [ROLES.FINANCE_MANAGER]: "Manages financial operations, accounting, invoicing, and payroll",
    [ROLES.SALES_MANAGER]: "Manages sales, orders, quotations, and customer relationships",
    [ROLES.PROCUREMENT_MANAGER]: "Manages purchases, suppliers, and procurement operations",
    [ROLES.PRODUCTION_MANAGER]: "Manages production, quality control, and waste management",
    [ROLES.QUALITY_MANAGER]: "Manages quality control and production quality assurance",
    [ROLES.WAREHOUSE_MANAGER]: "Manages warehouse, inventory, and stock operations",
    [ROLES.HR_MANAGER]: "Manages human resources, payroll, and attendance",
    [ROLES.SYSTEM_ADMINISTRATOR]: "System administrator with full access to all modules"
  };

  return descriptions[role] || "User role";
}
