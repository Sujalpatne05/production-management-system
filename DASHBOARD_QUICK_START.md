# Dashboard Enhancements - Quick Start Guide

## What's New

Your ERP dashboard now includes 4 critical features:

1. ✅ **Real-Time Updates** - Auto-refresh every 30 seconds
2. ✅ **Production Metrics** - OEE, efficiency, uptime, defect rate
3. ✅ **Drill-Down Analytics** - Click KPIs to see detailed data
4. ✅ **Alerts & Notifications** - Low stock, payment due, production delays

## Getting Started (5 minutes)

### Step 1: Frontend is Ready
The enhanced dashboard is already integrated. Just start your frontend:

```bash
npm run dev
```

The dashboard will automatically load with:
- Production metrics widget
- Real-time updates (every 30 seconds)
- Interactive drill-down modals
- Alert notifications panel

### Step 2: Add Backend Endpoints (Optional but Recommended)

To connect to real data, add the dashboard endpoints to your backend:

**In `backend/server.js`:**

```javascript
// Add this import at the top
import { setupDashboardEndpoints } from './dashboard-endpoints.js';

// Add this in your startServer function, after other route setup:
setupDashboardEndpoints(app, readData, writeData, authenticateToken);
```

**Then start your backend:**

```bash
cd backend
npm start
```

### Step 3: Test the Dashboard

1. Open http://localhost:3000/dashboard
2. You should see:
   - Production metrics (OEE, Efficiency, Uptime, Defect Rate)
   - KPI cards (Running, Completed, Delayed, Total)
   - Running productions table
   - Alerts panel at the bottom
   - Refresh button in top-right

3. Click any metric to see drill-down details
4. Click "View" on alerts to navigate to related modules

## Features Overview

### Real-Time Updates
- Dashboard refreshes automatically every 30 seconds
- Shows "Last updated: X seconds ago"
- Manual refresh button available
- No page reload needed

### Production Metrics
Four key metrics with color-coded status:

| Metric | Target | Green | Yellow | Red |
|--------|--------|-------|--------|-----|
| OEE | 75%+ | ≥75% | 65-74% | <65% |
| Efficiency | 80%+ | ≥80% | 70-79% | <70% |
| Uptime | 85%+ | ≥85% | 75-84% | <75% |
| Defect Rate | <5% | <5% | 5-10% | >10% |

### Drill-Down Analytics
Click any metric to see:
- Trend chart (line graph over time)
- Detailed transaction table
- Status indicators
- Timestamp information

### Alerts & Notifications
Four types of alerts:
1. **Low Stock** (Warning) - When inventory < minimum
2. **Payment Due** (Warning) - 3 days before due date
3. **Production Delay** (Error) - When production is delayed
4. **Production Complete** (Success) - When production finishes

Features:
- Unread count badge
- Dismiss alerts
- Quick navigation to related modules
- Time-relative display (5m ago, 1h ago, etc.)

## File Structure

```
src/
├── pages/dashboard/
│   └── HomeEnhanced.tsx (Main dashboard - 1000+ lines)
├── components/dashboard/
│   ├── ProductionMetricsWidget.tsx
│   ├── AlertsNotificationPanel.tsx
│   └── DrillDownModal.tsx
├── services/
│   ├── productionMetricsService.ts
│   └── dashboardApiService.ts
└── hooks/
    └── useRealTimeUpdates.ts

backend/
└── dashboard-endpoints.js (API endpoints)
```

## API Endpoints

If you added the backend endpoints, these are available:

```
GET  /api/dashboard/metrics          - Get current metrics
GET  /api/dashboard/alerts           - Get current alerts
PATCH /api/dashboard/alerts/:id/read - Mark alert as read
DELETE /api/dashboard/alerts/:id     - Dismiss alert
GET  /api/dashboard/transactions/:metric - Get drill-down data
```

## Customization

### Change Refresh Interval
Edit `src/pages/dashboard/HomeEnhanced.tsx`:

```typescript
const { startPolling } = useRealTimeUpdates({
  interval: 60000, // Change to 60 seconds (default: 30000ms)
  onUpdate: handleRefresh,
  enabled: true,
});
```

### Change Metric Thresholds
Edit `src/components/dashboard/ProductionMetricsWidget.tsx`:

```typescript
<MetricCard
  title="OEE"
  value={metrics.oee}
  unit="%"
  icon={<TrendingUp className="h-4 w-4" />}
  onClick={() => onDrillDown?.("oee")}
  threshold={80} // Change from 75 to 80
/>
```

### Add Custom Alerts
Edit `src/services/productionMetricsService.ts`:

```typescript
export const generateAlerts = (): AlertData[] => {
  return [
    // Add your custom alerts here
    {
      id: 'custom-1',
      type: 'warning',
      title: 'Custom Alert',
      message: 'Your custom message',
      timestamp: new Date(),
      actionUrl: '/dashboard/custom',
      read: false,
    },
  ];
};
```

## Troubleshooting

### Dashboard shows mock data instead of real data
- Make sure backend endpoints are added
- Check that API_URL is correct in environment
- Verify authentication token is valid

### Alerts not showing
- Check backend has production/inventory/payments data
- Verify alert generation logic in productionMetricsService.ts
- Check browser console for errors

### Real-time updates not working
- Check browser console for errors
- Verify API endpoints are accessible
- Check network tab for failed requests

### Drill-down modal not opening
- Check browser console for errors
- Verify Dialog component is imported
- Check if metric parameter is passed

## Next Steps

1. **Connect Real Data**
   - Update API endpoints to fetch from your database
   - Implement proper alert generation logic
   - Add WebSocket for true real-time updates

2. **Customize Metrics**
   - Adjust thresholds based on your business
   - Add more production metrics
   - Implement custom calculations

3. **Enhance Alerts**
   - Add email notifications
   - Implement alert scheduling
   - Add alert history/archive

4. **Advanced Features**
   - Export metrics to PDF/CSV
   - Schedule automated reports
   - Add predictive analytics
   - Implement custom dashboards

## Support

For detailed documentation, see: `DASHBOARD_ENHANCEMENTS.md`

For issues:
1. Check browser console for errors
2. Verify API endpoints are working
3. Check network tab for failed requests
4. Review component documentation
