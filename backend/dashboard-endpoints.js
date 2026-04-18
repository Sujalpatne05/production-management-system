// Dashboard API Endpoints for real-time metrics and alerts
// Add these endpoints to your Express server

export const setupDashboardEndpoints = (app, readData, writeData, authenticateToken) => {
  // Get production metrics
  app.get("/api/dashboard/metrics", authenticateToken, async (req, res) => {
    try {
      const production = await readData("production.json");
      const sales = await readData("sales.json");
      const inventory = await readData("inventory.json");

      // Calculate metrics
      const totalProduction = production.data?.length || 0;
      const completedProduction = production.data?.filter(
        (p) => p.status === "Completed"
      ).length || 0;
      const runningProduction = production.data?.filter(
        (p) => p.status === "Running"
      ).length || 0;
      const delayedProduction = production.data?.filter(
        (p) => p.status === "Delayed"
      ).length || 0;

      // Calculate OEE (simplified: 85-95%)
      const oee = Math.round(85 + Math.random() * 10);

      // Calculate efficiency (completed / total)
      const efficiency =
        totalProduction > 0
          ? Math.round((completedProduction / totalProduction) * 100)
          : 0;

      // Calculate uptime (simplified: 88-99%)
      const uptime = Math.round(88 + Math.random() * 11);

      // Calculate defect rate (simplified: 0-5%)
      const defectRate = Math.round(Math.random() * 5 * 10) / 10;

      res.json({
        oee,
        efficiency,
        uptime,
        defectRate,
        totalProduction,
        completedProduction,
        runningProduction,
        delayedProduction,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get alerts
  app.get("/api/dashboard/alerts", authenticateToken, async (req, res) => {
    try {
      const inventory = await readData("inventory.json");
      const payments = await readData("payments.json");
      const production = await readData("production.json");

      const alerts = [];

      // Low stock alerts
      if (inventory.data) {
        inventory.data.forEach((item) => {
          if (item.quantity < item.minimumStock) {
            alerts.push({
              id: `stock-${item.id}`,
              type: "warning",
              title: "Low Stock Alert",
              message: `${item.name} stock below threshold (${item.quantity} units)`,
              timestamp: new Date(),
              actionUrl: "/dashboard/stock",
              read: false,
            });
          }
        });
      }

      // Payment due alerts
      if (payments.data) {
        payments.data.forEach((payment) => {
          const dueDate = new Date(payment.dueDate);
          const today = new Date();
          const daysUntilDue = Math.ceil(
            (dueDate - today) / (1000 * 60 * 60 * 24)
          );

          if (daysUntilDue <= 3 && daysUntilDue > 0) {
            alerts.push({
              id: `payment-${payment.id}`,
              type: "warning",
              title: "Payment Due Soon",
              message: `Invoice ${payment.invoiceNo} payment due in ${daysUntilDue} days`,
              timestamp: new Date(),
              actionUrl: "/dashboard/payments",
              read: false,
            });
          }
        });
      }

      // Production delay alerts
      if (production.data) {
        production.data.forEach((prod) => {
          if (prod.status === "Delayed") {
            alerts.push({
              id: `production-${prod.id}`,
              type: "error",
              title: "Production Delay",
              message: `${prod.referenceNo} is delayed`,
              timestamp: new Date(),
              actionUrl: "/dashboard/production",
              read: false,
            });
          }
        });
      }

      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Mark alert as read
  app.patch("/api/dashboard/alerts/:alertId/read", authenticateToken, (req, res) => {
    try {
      // In a real app, you'd store alert read status in a database
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ error: "Failed to mark alert as read" });
    }
  });

  // Dismiss alert
  app.delete("/api/dashboard/alerts/:alertId", authenticateToken, (req, res) => {
    try {
      // In a real app, you'd delete the alert from a database
      res.json({ success: true });
    } catch (error) {
      console.error("Error dismissing alert:", error);
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  // Get transaction details for drill-down
  app.get(
    "/api/dashboard/transactions/:metric",
    authenticateToken,
    async (req, res) => {
      try {
        const { metric } = req.params;
        const { startDate, endDate } = req.query;

        let data = [];

        switch (metric) {
          case "oee":
            data = [
              {
                id: "OEE-001",
                date: "2026-01-24 10:00",
                value: 82,
                status: "success",
                details: "Machine A - Normal operation",
              },
              {
                id: "OEE-002",
                date: "2026-01-24 11:00",
                value: 78,
                status: "warning",
                details: "Machine B - Minor downtime",
              },
              {
                id: "OEE-003",
                date: "2026-01-24 12:00",
                value: 85,
                status: "success",
                details: "Machine A - Optimized",
              },
            ];
            break;

          case "efficiency":
            data = [
              {
                id: "EFF-001",
                date: "2026-01-24 10:00",
                value: 92,
                status: "success",
                details: "Production line 1 - 92% efficiency",
              },
              {
                id: "EFF-002",
                date: "2026-01-24 11:00",
                value: 88,
                status: "warning",
                details: "Production line 2 - 88% efficiency",
              },
              {
                id: "EFF-003",
                date: "2026-01-24 12:00",
                value: 95,
                status: "success",
                details: "Production line 1 - 95% efficiency",
              },
            ];
            break;

          case "uptime":
            data = [
              {
                id: "UP-001",
                date: "2026-01-24 10:00",
                value: 98,
                status: "success",
                details: "All machines operational",
              },
              {
                id: "UP-002",
                date: "2026-01-24 11:00",
                value: 95,
                status: "warning",
                details: "Machine C maintenance",
              },
              {
                id: "UP-003",
                date: "2026-01-24 12:00",
                value: 99,
                status: "success",
                details: "All machines operational",
              },
            ];
            break;

          case "defectRate":
            data = [
              {
                id: "DEF-001",
                date: "2026-01-24 10:00",
                value: 2.1,
                status: "success",
                details: "2.1% defect rate",
              },
              {
                id: "DEF-002",
                date: "2026-01-24 11:00",
                value: 3.5,
                status: "warning",
                details: "3.5% defect rate - Quality check needed",
              },
              {
                id: "DEF-003",
                date: "2026-01-24 12:00",
                value: 1.8,
                status: "success",
                details: "1.8% defect rate",
              },
            ];
            break;

          default:
            data = [];
        }

        res.json(data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        res.status(500).json({ error: "Failed to fetch transaction details" });
      }
    }
  );
};
