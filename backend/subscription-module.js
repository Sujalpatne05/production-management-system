/**
 * SUBSCRIPTION MANAGEMENT MODULE
 * Handles all subscription and plan-related operations
 * Extracted from super-admin-module.js
 */

const createAuditLog = async (prisma, data) => {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

export const setupSubscriptionModule = (app, prisma, authenticateToken, authorize) => {
  console.log("💳 Setting up Subscription Management Module...");

  // =====================
  // SUBSCRIPTION PLANS
  // =====================

  // Get all subscription plans
  app.get("/api/super-admin/plans", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;

      const plans = await prisma.subscriptionPlan.findMany({
        where: { status: "active" },
        orderBy: { price: "asc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.subscriptionPlan.count({ where: { status: "active" } });

      res.json({ 
        success: true, 
        data: plans, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create subscription plan
  app.post("/api/super-admin/plans", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, description, price, billingCycle, maxUsers, maxStorage, features } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Validation
      const errors = {};
      if (!name || name.trim().length === 0) errors.name = "Plan name is required";
      if (price === undefined || price === null) errors.price = "Price is required";
      else if (isNaN(price) || parseFloat(price) < 0) errors.price = "Price must be a non-negative number";
      if (!maxUsers || maxUsers <= 0) errors.maxUsers = "Max users must be greater than 0";
      if (!maxStorage || maxStorage <= 0) errors.maxStorage = "Max storage must be greater than 0";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, error: "Validation failed", details: errors });
      }

      // Check name uniqueness
      const existingPlan = await prisma.subscriptionPlan.findUnique({
        where: { name: name.trim() }
      }).catch(() => null);

      if (existingPlan) {
        return res.status(409).json({ 
          success: false, 
          error: "Plan name already exists",
          code: "DUPLICATE_RECORD"
        });
      }

      const plan = await prisma.subscriptionPlan.create({
        data: {
          name: name.trim(),
          description,
          price: parseFloat(price),
          billingCycle: billingCycle || "monthly",
          maxUsers: parseInt(maxUsers),
          maxStorage: parseInt(maxStorage),
          features: features || [],
          status: "active"
        }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "create",
        resourceType: "subscription_plan",
        resourceId: plan.id,
        changes: { created: plan },
        ipAddress,
        userAgent
      });

      res.status(201).json({ success: true, data: plan, message: "Plan created successfully" });
    } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update subscription plan
  app.put("/api/super-admin/plans/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { name, description, price, billingCycle, maxUsers, maxStorage, features, status } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const existingPlan = await prisma.subscriptionPlan.findUnique({
        where: { id: req.params.id }
      });

      if (!existingPlan) {
        return res.status(404).json({ success: false, error: "Plan not found" });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (billingCycle !== undefined) updateData.billingCycle = billingCycle;
      if (maxUsers !== undefined) updateData.maxUsers = parseInt(maxUsers);
      if (maxStorage !== undefined) updateData.maxStorage = parseInt(maxStorage);
      if (features !== undefined) updateData.features = features;
      if (status !== undefined) updateData.status = status;

      const plan = await prisma.subscriptionPlan.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "update",
        resourceType: "subscription_plan",
        resourceId: plan.id,
        changes: { before: existingPlan, after: plan },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: plan, message: "Plan updated successfully" });
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete subscription plan
  app.delete("/api/super-admin/plans/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: req.params.id }
      });

      if (!plan) {
        return res.status(404).json({ success: false, error: "Plan not found" });
      }

      // Check if plan is in use
      const subscriptionCount = await prisma.subscription.count({
        where: { planId: req.params.id }
      });

      if (subscriptionCount > 0) {
        return res.status(400).json({ 
          success: false, 
          error: `Cannot delete plan. ${subscriptionCount} subscription(s) using this plan.` 
        });
      }

      const deletedPlan = await prisma.subscriptionPlan.update({
        where: { id: req.params.id },
        data: { status: "inactive" }
      });

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        action: "delete",
        resourceType: "subscription_plan",
        resourceId: plan.id,
        changes: { deleted: plan },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: deletedPlan, message: "Plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =====================
  // COMPANY SUBSCRIPTIONS
  // =====================

  // Get company subscriptions
  app.get("/api/super-admin/subscriptions", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { limit = 10, offset = 0, companyId, status } = req.query;
      const where = {};

      if (companyId) where.companyId = companyId;
      if (status) where.status = status;

      const subscriptions = await prisma.subscription.findMany({
        where,
        include: {
          company: true,
          plan: true
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.subscription.count({ where });

      res.json({ 
        success: true, 
        data: subscriptions, 
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update company subscription
  app.put("/api/super-admin/subscriptions/:id", authenticateToken, authorize(["super_admin"]), async (req, res) => {
    try {
      const { planId, status, autoRenew } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get("user-agent");

      // Get existing subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: { id: req.params.id },
        include: { company: true, plan: true }
      });

      if (!existingSubscription) {
        return res.status(404).json({ success: false, error: "Subscription not found" });
      }

      // If changing plan, validate new plan exists
      let newPlan = null;
      if (planId && planId !== existingSubscription.planId) {
        newPlan = await prisma.subscriptionPlan.findUnique({
          where: { id: planId }
        });

        if (!newPlan) {
          return res.status(400).json({ success: false, error: "Subscription plan not found" });
        }

        // Check if downgrading would exceed user limit
        const userCount = await prisma.user.count({
          where: { companyId: existingSubscription.companyId }
        });

        if (userCount > newPlan.maxUsers) {
          return res.status(400).json({ 
            success: false, 
            error: `Cannot downgrade: company has ${userCount} users but new plan allows only ${newPlan.maxUsers}` 
          });
        }
      }

      const updateData = {};
      if (planId !== undefined) updateData.planId = planId;
      if (status !== undefined) updateData.status = status;
      if (autoRenew !== undefined) updateData.autoRenew = autoRenew;

      const subscription = await prisma.subscription.update({
        where: { id: req.params.id },
        data: updateData,
        include: { company: true, plan: true }
      });

      // Update company limits if plan changed
      if (newPlan) {
        await prisma.company.update({
          where: { id: existingSubscription.companyId },
          data: {
            maxUsers: newPlan.maxUsers,
            maxStorage: newPlan.maxStorage
          }
        });
      }

      // Create audit log
      await createAuditLog(prisma, {
        userId: req.user.id,
        companyId: existingSubscription.companyId,
        action: "update",
        resourceType: "subscription",
        resourceId: subscription.id,
        changes: { before: existingSubscription, after: subscription },
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: subscription, message: "Subscription updated successfully" });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log("✅ Subscription Management Module setup complete!");
};
