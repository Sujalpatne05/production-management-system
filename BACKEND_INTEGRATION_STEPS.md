# Backend Integration Steps for Dashboard

## Overview
This guide shows how to integrate the dashboard API endpoints with your existing backend server.

## Step 1: Add Dashboard Endpoints File

The file `backend/dashboard-endpoints.js` has been created with all necessary endpoints.

## Step 2: Update Backend Server

### Option A: Using Express Server (server.js)

**File**: `backend/server.js`

Add this import at the top of the file:
```javascript
import { setupDashboardEndpoints } from './dashboard-endpoints.js';
```

Then, in your `startServer` function, add this line after other route setup (around line 400-450):
```javascript
// Setup dashboard endpoints
setupDashboardEndpoints(app, readData, writeData, authenticateToken);
```

**Complete Example:**
```javascript
// At the top of server.js
import { setupDashboardEndpoints } from './dashboard-endpoints.js';

// In startServer function:
const startServer = async (port = PORT) => {
  try {
    await initializeDataFiles();
    
    // ... other route setup ...
    
    // Setup dashboard endpoints
    setupDashboardEndpoints(app, readData, writeData, authenticateToken);
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};
```

### Option B: Using Prisma Server (server-prisma.js)

If using Prisma, add the endpoints similarly:

```javascript
import { setupDashboardEndpoints } from './dashboard-endpoints.js';

// In your server setup:
setupDashboardEndpoints(app, readData, writeData, authenticateToken);
```

## Step 3: Verify Endpoints

After adding the endpoints, test them:

```bash
# Start backend
cd backend
npm start

# In another terminal, test the endpoints:

# Test metrics endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard/metrics

# Test alerts endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard/alerts

# Test drill-down endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/dashboard/transactions/oee"
```

## Step 4: Configure Frontend

### Update Environment Variables

Create or update `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Or for production:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Verify Frontend Configuration

The frontend API client is already configured in `src/services/dashboardApiService.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
```

## Step 5: Test Integration

### Start Both Servers

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

### Test Dashboard

1. Open http://localhost:3000/dashboard
2. You should see:
   - Production metrics (OEE, Efficiency, Uptime, Defect Rate)
   - KPI cards (Running, Completed, Delayed, Total)
   - Running productions table
   - Alerts panel
   - Refresh button

3. Click refresh button - should fetch fresh data from backend
4. Check browser Network tab - should see API calls to:
   - `/api/dashboard/metrics`
   - `/api/dashboard/alerts`

## Step 6: Connect Real Data

The endpoints currently return mock data. To connect real data:

### Update Metrics Calculation

**File**: `backend/dashboard-endpoints.js`

In the `/api/dashboard/metrics` endpoint, replace mock calculations with real data:

```javascript
app.get("/api/dashboard/metrics", authenticateToken, async (req, res) => {
  try {
    const production = await readData("production.json");
    const sales = await readData("sales.json");
    const inventory = await readData("inventory.json");

    // Calculate real metrics from your data
    const totalProduction = production.data?.length || 0;
    const completedProduction = production.data?.filter(
      (p) => p.status === "Completed"
    ).length || 0;
    
    // ... more calculations ...
    
    res.json({
      oee: calculateOEE(production.data),
      efficiency: calculateEfficiency(production.data),
      uptime: calculateUptime(production.data),
      defectRate: calculateDefectRate(production.data),
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
```

### Update Alert Generation

**File**: `backend/dashboard-endpoints.js`

In the `/api/dashboard/alerts` endpoint, implement real alert logic:

```javascript
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
            message: `${item.name} stock below threshold`,
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
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

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
```

## Step 7: Add Helper Functions

Create helper functions for metric calculations:

```javascript
// Add to dashboard-endpoints.js

const calculateOEE = (productionData) => {
  if (!productionData || productionData.length === 0) return 0;
  
  const completed = productionData.filter(p => p.status === "Completed").length;
  const total = productionData.length;
  
  // Simplified: OEE = (Completed / Total) * 100
  return Math.round((completed / total) * 100);
};

const calculateEfficiency = (productionData) => {
  if (!productionData || productionData.length === 0) return 0;
  
  const completed = productionData.filter(p => p.status === "Completed").length;
  const total = productionData.length;
  
  return Math.round((completed / total) * 100);
};

const calculateUptime = (productionData) => {
  if (!productionData || productionData.length === 0) return 0;
  
  // Simplified: Uptime = (Running + Completed) / Total * 100
  const active = productionData.filter(
    p => p.status === "Running" || p.status === "Completed"
  ).length;
  const total = productionData.length;
  
  return Math.round((active / total) * 100);
};

const calculateDefectRate = (productionData) => {
  if (!productionData || productionData.length === 0) return 0;
  
  // Simplified: Defect Rate = Delayed / Total * 100
  const delayed = productionData.filter(p => p.status === "Delayed").length;
  const total = productionData.length;
  
  return Math.round((delayed / total) * 100);
};
```

## Step 8: Test Real Data Integration

1. Ensure your backend has data in:
   - `backend/data/production.json`
   - `backend/data/inventory.json`
   - `backend/data/payments.json`

2. Restart backend server
3. Refresh dashboard in browser
4. Metrics should now show real data

## Step 9: Enable Alert Persistence (Optional)

For production, you may want to store alert read status in a database:

```javascript
// Update mark as read endpoint
app.patch("/api/dashboard/alerts/:alertId/read", authenticateToken, async (req, res) => {
  try {
    // Store in database
    // await db.alerts.update({ id: alertId }, { read: true });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking alert as read:", error);
    res.status(500).json({ error: "Failed to mark alert as read" });
  }
});
```

## Step 10: Upgrade to WebSocket (Optional)

For true real-time updates, upgrade from polling to WebSocket:

```javascript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  // Send metrics every 5 seconds
  const interval = setInterval(async () => {
    const metrics = await fetchMetrics();
    ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
  }, 5000);

  ws.on('close', () => clearInterval(interval));
});
```

## Troubleshooting

### Endpoints not found
- Verify `setupDashboardEndpoints` is called in server.js
- Check that the import path is correct
- Restart backend server

### CORS errors
- Verify frontend URL is in CORS whitelist
- Check `origin` setting in server.js

### Authentication errors
- Verify token is being sent in Authorization header
- Check token is valid and not expired

### No data showing
- Verify backend data files have content
- Check API response in browser Network tab
- Verify metric calculation logic

## Next Steps

1. ✅ Add endpoints to backend
2. ✅ Test endpoints with curl
3. ✅ Connect real data
4. ✅ Test dashboard integration
5. ⏭️ Customize metrics for your business
6. ⏭️ Add email notifications
7. ⏭️ Implement WebSocket for real-time updates
8. ⏭️ Add alert history/archive

## Support

For issues:
1. Check browser console for errors
2. Check backend server logs
3. Verify API endpoints are accessible
4. Check network tab for failed requests
5. Review endpoint implementation in `dashboard-endpoints.js`
