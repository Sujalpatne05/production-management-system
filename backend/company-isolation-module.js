/**
 * COMPANY ISOLATION MODULE
 * Enforces multi-tenant data isolation across all CRUD operations
 * Ensures users can only access data from their assigned company
 */

/**
 * Get user's company ID from database
 * Handles both regular users and company admins
 */
export const getUserCompanyId = async (prisma, userId, userRole) => {
  try {
    // Super admin has access to all companies
    if (userRole === 'super_admin') {
      return null; // null means all companies
    }

    // For regular users, get their company from user record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true }
    });

    if (!user || !user.companyId) {
      throw new Error('User has no company assigned');
    }

    return user.companyId;
  } catch (error) {
    console.error('Error getting user company ID:', error);
    throw error;
  }
};

/**
 * Validate that user has access to a specific company
 */
export const validateCompanyAccess = async (prisma, userId, userRole, targetCompanyId) => {
  try {
    // Super admin has access to all companies
    if (userRole === 'super_admin') {
      return true;
    }

    // Get user's company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true }
    });

    if (!user || !user.companyId) {
      return false;
    }

    // User can only access their own company
    return user.companyId === targetCompanyId;
  } catch (error) {
    console.error('Error validating company access:', error);
    return false;
  }
};

/**
 * Middleware to enforce company isolation on CRUD operations
 * Automatically adds companyId filter to queries
 */
export const enforceCompanyIsolation = (prisma) => {
  return async (req, res, next) => {
    try {
      // Store user's company ID in request for use in route handlers
      const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
      req.userCompanyId = userCompanyId;
      next();
    } catch (error) {
      console.error('Company isolation middleware error:', error);
      res.status(403).json({ success: false, error: 'Access denied' });
    }
  };
};

/**
 * Create company-isolated CRUD endpoints
 * Automatically enforces company isolation on all operations
 */
export const createCompanyIsolatedCrudEndpoints = (app, prisma, resource, model, access = {}, authenticateToken, authorize) => {
  console.log(`🔒 Setting up company-isolated CRUD for ${resource}...`);

  // GET all records (filtered by company)
  app.get(`/api/${resource}`, ...(access.getAll || []), async (req, res) => {
    try {
      console.log(`🔒 [GENERIC CRUD] GET /api/${resource} called`);
      const { companyId, ...filters } = req.query;
      const where = { ...filters };

      // If super admin, allow filtering by companyId
      if (req.user.role === 'super_admin' && companyId) {
        where.companyId = companyId;
      } else if (req.user.role !== 'super_admin') {
        // Regular users can only see their company's data
        const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
        if (!userCompanyId) {
          return res.status(403).json({ success: false, error: 'No company assigned' });
        }
        where.companyId = userCompanyId;
      }

      const data = await prisma[model].findMany({
        where,
        take: 100
      });

      console.log(`🔒 [GENERIC CRUD] Returning ${data.length} records for ${resource}`);
      res.json({
        success: true,
        data,
        total: data.length,
        _source: `generic-crud-${resource}`
      });
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET single record by ID
  app.get(`/api/${resource}/:id`, ...(access.getOne || []), async (req, res) => {
    try {
      const record = await prisma[model].findUnique({
        where: { id: req.params.id }
      });

      if (!record) {
        return res.status(404).json({ success: false, error: 'Record not found' });
      }

      // Verify user has access to this record's company
      if (req.user.role !== 'super_admin' && record.companyId) {
        const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
        if (record.companyId !== userCompanyId) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }
      }

      res.json({ success: true, data: record });
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST - Create new record
  app.post(`/api/${resource}`, ...(access.create || []), async (req, res) => {
    try {
      const { companyId, ...data } = req.body;

      // Determine which company this record belongs to
      let recordCompanyId = companyId;

      if (req.user.role === 'super_admin') {
        // Super admin can create records for any company
        if (!recordCompanyId) {
          return res.status(400).json({ success: false, error: 'companyId is required for super admin' });
        }
      } else {
        // Regular users can only create records for their company
        const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
        if (!userCompanyId) {
          return res.status(403).json({ success: false, error: 'No company assigned' });
        }

        // If companyId is provided, verify it matches user's company
        if (recordCompanyId && recordCompanyId !== userCompanyId) {
          return res.status(403).json({ success: false, error: 'Cannot create records for other companies' });
        }

        recordCompanyId = userCompanyId;
      }

      const newRecord = await prisma[model].create({
        data: {
          ...data,
          companyId: recordCompanyId
        }
      });

      res.status(201).json({
        success: true,
        data: newRecord,
        message: `${resource.slice(0, -1)} created successfully`
      });
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PUT - Update existing record
  app.put(`/api/${resource}/:id`, ...(access.update || []), async (req, res) => {
    try {
      // Get existing record
      const existingRecord = await prisma[model].findUnique({
        where: { id: req.params.id }
      });

      if (!existingRecord) {
        return res.status(404).json({ success: false, error: 'Record not found' });
      }

      // Verify user has access to this record's company
      if (req.user.role !== 'super_admin' && existingRecord.companyId) {
        const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
        if (existingRecord.companyId !== userCompanyId) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }
      }

      // Prevent changing companyId
      const { companyId, ...updateData } = req.body;
      if (companyId && companyId !== existingRecord.companyId) {
        return res.status(403).json({ success: false, error: 'Cannot change company assignment' });
      }

      const updated = await prisma[model].update({
        where: { id: req.params.id },
        data: updateData
      });

      res.json({
        success: true,
        data: updated,
        message: `${resource.slice(0, -1)} updated successfully`
      });
    } catch (error) {
      console.error(`Error updating ${resource}:`, error);
      if (error.code === 'P2025') {
        res.status(404).json({ success: false, error: 'Record not found' });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });

  // DELETE - Delete record
  app.delete(`/api/${resource}/:id`, ...(access.delete || []), async (req, res) => {
    try {
      // Get existing record
      const existingRecord = await prisma[model].findUnique({
        where: { id: req.params.id }
      });

      if (!existingRecord) {
        return res.status(404).json({ success: false, error: 'Record not found' });
      }

      // Verify user has access to this record's company
      if (req.user.role !== 'super_admin' && existingRecord.companyId) {
        const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
        if (existingRecord.companyId !== userCompanyId) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }
      }

      const deleted = await prisma[model].delete({
        where: { id: req.params.id }
      });

      res.json({
        success: true,
        data: deleted,
        message: `${resource.slice(0, -1)} deleted successfully`
      });
    } catch (error) {
      console.error(`Error deleting ${resource}:`, error);
      if (error.code === 'P2025') {
        res.status(404).json({ success: false, error: 'Record not found' });
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  });

  console.log(`✅ Company-isolated CRUD setup complete for ${resource}`);
};

/**
 * Setup company isolation module
 */
export const setupCompanyIsolationModule = (app, prisma, authenticateToken, authorize) => {
  console.log('🔒 Setting up Company Isolation Module...');

  // Test endpoint to verify company isolation is working
  app.get('/api/company-isolation/test', authenticateToken, async (req, res) => {
    try {
      const userCompanyId = await getUserCompanyId(prisma, req.user.id, req.user.role);
      res.json({
        success: true,
        userId: req.user.id,
        userRole: req.user.role,
        userCompanyId,
        message: 'Company isolation is working'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('✅ Company Isolation Module setup complete!');
};
