/**
 * Role-Based Access Control (RBAC) Middleware
 * Provides middleware functions for role and module-based access control
 */

import { hasModuleAccess, isValidRole, ROLES } from "./role-module-mapping.js";

/**
 * Middleware to check if user has access to a specific module
 * @param {string} module - The module to check access for
 * @returns {function} - Express middleware function
 */
export function requireModuleAccess(module) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Super admins and system administrators have access to all modules
    if (req.user.role === "super_admin" || req.user.role === ROLES.SYSTEM_ADMINISTRATOR) {
      return next();
    }

    // Check if user's role has access to the module
    if (!hasModuleAccess(req.user.role, module)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "MODULE_ACCESS_DENIED",
        details: {
          module,
          userRole: req.user.role,
          message: `Your role (${req.user.role}) does not have access to the ${module} module`
        }
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has access to multiple modules
 * @param {array} modules - Array of modules to check access for
 * @returns {function} - Express middleware function
 */
export function requireAnyModuleAccess(modules) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Super admins and system administrators have access to all modules
    if (req.user.role === "super_admin" || req.user.role === ROLES.SYSTEM_ADMINISTRATOR) {
      return next();
    }

    // Check if user's role has access to any of the modules
    const hasAccess = modules.some(module => hasModuleAccess(req.user.role, module));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "MODULE_ACCESS_DENIED",
        details: {
          modules,
          userRole: req.user.role,
          message: `Your role (${req.user.role}) does not have access to any of the requested modules`
        }
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has access to all specified modules
 * @param {array} modules - Array of modules to check access for
 * @returns {function} - Express middleware function
 */
export function requireAllModuleAccess(modules) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Super admins and system administrators have access to all modules
    if (req.user.role === "super_admin" || req.user.role === ROLES.SYSTEM_ADMINISTRATOR) {
      return next();
    }

    // Check if user's role has access to all modules
    const hasAccess = modules.every(module => hasModuleAccess(req.user.role, module));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "MODULE_ACCESS_DENIED",
        details: {
          modules,
          userRole: req.user.role,
          message: `Your role (${req.user.role}) does not have access to all requested modules`
        }
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has a specific role
 * @param {array|string} roles - Role or array of roles to check
 * @returns {function} - Express middleware function
 */
export function requireRole(roles) {
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!roleArray.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "ROLE_ACCESS_DENIED",
        details: {
          requiredRoles: roleArray,
          userRole: req.user.role,
          message: `Your role (${req.user.role}) is not authorized for this action`
        }
      });
    }

    next();
  };
}

/**
 * Middleware to check if user is a company admin or super admin
 * @returns {function} - Express middleware function
 */
export function requireAdminRole() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "ADMIN_ACCESS_DENIED",
        message: "This action requires admin privileges"
      });
    }

    next();
  };
}

/**
 * Middleware to check if user is a super admin
 * @returns {function} - Express middleware function
 */
export function requireSuperAdmin() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "SUPER_ADMIN_ACCESS_DENIED",
        message: "This action requires super admin privileges"
      });
    }

    next();
  };
}

/**
 * Middleware to check if user is a company admin
 * @returns {function} - Express middleware function
 */
export function requireCompanyAdmin() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "COMPANY_ADMIN_ACCESS_DENIED",
        message: "This action requires company admin privileges"
      });
    }

    next();
  };
}

/**
 * Middleware to check if user is a regular user
 * @returns {function} - Express middleware function
 */
export function requireUserRole() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "USER_ACCESS_DENIED",
        message: "This action requires user role"
      });
    }

    next();
  };
}

/**
 * Middleware to check if user belongs to the same company
 * @param {string} companyIdParam - The request parameter name containing company ID
 * @returns {function} - Express middleware function
 */
export function requireSameCompany(companyIdParam = "companyId") {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Super admins can access any company
    if (req.user.role === "super_admin") {
      return next();
    }

    // Get the company ID from request
    const requestedCompanyId = req.params[companyIdParam] || req.body[companyIdParam] || req.query[companyIdParam];

    // Check if user belongs to the requested company
    if (req.user.companyId !== requestedCompanyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        code: "COMPANY_ACCESS_DENIED",
        message: "You do not have access to this company"
      });
    }

    next();
  };
}

/**
 * Middleware to attach user's accessible modules to request
 * @returns {function} - Express middleware function
 */
export function attachAccessibleModules() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Import here to avoid circular dependency
    const { getAccessibleModules } = require("./role-module-mapping.js");

    req.user.accessibleModules = getAccessibleModules(req.user.role);
    next();
  };
}
