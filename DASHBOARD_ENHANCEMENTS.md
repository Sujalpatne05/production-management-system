# Dashboard Enhancements - Implementation Guide

## Overview
This document outlines the 4 critical dashboard features implemented for the ERP system:

1. **Real-Time Updates** - Auto-refresh every 30 seconds
2. **Production Metrics** - OEE, efficiency, uptime, defect rate
3. **Drill-Down Analytics** - Click KPIs to see detailed transactions
4. **Alerts & Notifications** - Low stock, payment due, production delays

## Features Implemented

### 1. Real-Time Updates (30-second polling)

**Files:**
- `src/hooks/useRealTimeUpdates.ts` - Custom hook for polling

**How it works:**
- Automatically refreshes dashboard data every 30 seconds
- Can be toggled on/off
- Includes manual refresh button with loading state
- Shows last update timestamp

**Usage:**
```typescript
const { startPolling, stopPolling } = useRealTimeUpdates({
  interval: 30000,
  onUpdate: handleRefresh,
  enabled: true,
});
```

### 2. Production Metrics Widget

**Files:**
- `src/components/dashboard/ProductionMetricsWidget.tsx` - Metrics display
- `src/services/productionMetricsService.ts` - Metrics calculations

**Metrics Displayed:**
- **OEE (Overall Equipment Effectiveness)** - Target: 75%+
  - Calculated as: Availability × Performance × Quality
  - Color-coded: Green (≥75%), Yellow (65-74%), Red (<65%)

- **Efficiency** - Target: 80%+
  - Calculated as: Completed Units / Planned Units × 100
  - Color-coded: Green (≥80%), Yellow (70-79%), Red (<70%)

- **Uptime** - Target: 85%+
  - Calculated as: Operating Hours / Total Hours × 100
  - Color-coded: Green (≥85%), Yellow (75-84%), Red (<75%)

- **Defect Rate** - Target: <5%
  - Calculated as: Defective Units / Total Units × 100
  - Color-coded: Green (<5%), Yellow (5-10%), Red (>10%)

**Summary Stats:**
- Completed Productions
- Running Productions
- Delayed Productions
- Total Productions

**Interactive Features:**
- Click any metric to drill down into detailed data
- Hover effects for better UX
- Color-coded status indicators

### 3. Drill-Down Analytics

**Files:**
- `src/components/dashboard/DrillDownModal.tsx` - Modal with detailed view

**Features:**
- **Trend Chart** - Line chart showing metric trends over time
- **Detailed Transactions Table** - Shows:
  - Transaction ID
  - Date & Time
  - Value
  - Status (success/warning/error)
  - Details description

**Supported Metrics:**
- OEE - Machine effectiveness trends
- Efficiency - Production line efficiency
- Uptime - Machine availability
- Defect Rate - Quality metrics

**Data Visualization:**
- Recharts library for trend analysis
- Color-coded status badges
- Responsive table layout

### 4. Alerts & Notifications System

**Files:**
- `src/components/dashboard/AlertsNotificationPanel.tsx` - Alert display
- `src/services/productionMetricsService.ts` - Alert generation

**Alert Types:**
1. **Low Stock Alerts** (Warning)
   - Triggered when inventory falls below minimum threshold
   - Links to stock management

2. **Payment Due Alerts** (Warning)
   - Triggered 3 days before payment due date
   - Links to payments module

3. **Production Delay Alerts** (Error)
   - Triggered when production status is "Delayed"
   - Links to production module

4. **Production Complete Alerts** (Success)
   - Triggered when production completes
   - Links to production details

**Features:**
- Unread count badge
- Time-relative display (5m ago, 1h ago, etc.)
- Dismiss functionality
- Mark as read
- Quick navigation to related modules
- Max height with scroll for many alerts

## Backend Integration

### API Endpoints

**Files:**
- `backend/dashboard-endpoints.js` - API endpoint definitions
- `src/services/dashboardApiService.ts` - Frontend API client

**Endpoints:**

1. **GET /api/dashboard/metrics**
   - Returns current production metrics
   - Requires authentication
   - Response:
   ```json
   {
     "oee": 82,
     "efficiency": 85,
     "uptime": 92,
     "defectRate": 2.5,
     "totalProduction": 150,
     "completedProduction": 95,
     "runningProduction": 43,
     "delayedProduction": 12
   }
   ```

2. **GET /api/dashboard/alerts**
   - Returns current alerts
   - Requires authentication
   - Response:
   ```json
   [
     {
       "id": "1",
       "type": "warning",
       "title": "Low Stock Alert",
       "message": "MS Plate 5mm stock below threshold",
       "timestamp": "2026-01-24T10:00:00Z",
       "actionUrl": "/dashboard/stock",
       "read": false
     }
   ]
   ```

3. **PATCH /api/dashboard/alerts/:alertId/read**
   - Marks alert as read
   - Requires authentication

4. **DELETE /api/dashboard/alerts/:alertId**
   - Dismisses alert
   - Requires authentication

5. **GET /api/dashboard/transactions/:metric**
   - Returns detailed transaction data for drill-down
   - Query params: startDate, endDate
   - Requires authentication

### Integration Steps

1. **Add endpoints to backend server:**
   ```javascript
   import { setupDashboardEndpoints } from './dashboard-endpoints.js';
   
   // In your Express app setup:
   setupDashboardEndpoints(app, readData, writeData, authenticateToken);
   ```

2. **Update environment variables:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Test endpoints:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/dashboard/metrics
   ```

## Component Architecture

```
HomeEnhanced (Main Dashboard)
├── ProductionMetricsWidget
│   └── Metric Cards (OEE, Efficiency, Uptime, Defect Rate)
├── KPI Cards (Running, Completed, Delayed, Total)
├── Profile & Quick Actions
├── Running Productions Table
├── AlertsNotificationPanel
│   └── Alert Items
└── DrillDownModal
    ├── Trend Chart
    └── Transactions Table
```

## Usage

### Replace Home Dashboard

The enhanced dashboard is already integrated as the default home page. To use it:

1. Dashboard automatically loads `HomeEnhanced` component
2. Real-time updates start automatically (30-second interval)
3. Click any metric or KPI to drill down
4. Alerts appear in the bottom panel
5. Click "View" on alerts to navigate to related modules

### Manual Refresh

Click the "Refresh" button in the top-right to manually update all data.

### Customize Refresh Interval

Edit `HomeEnhanced.tsx`:
```typescript
const { startPolling } = useRealTimeUpdates({
  interval: 30000, // Change this value (in milliseconds)
  onUpdate: handleRefresh,
  enabled: true,
});
```

## Performance Considerations

1. **Polling Strategy**
   - 30-second interval balances real-time updates with server load
   - Can be adjusted based on requirements
   - Consider WebSocket for higher frequency updates

2. **Data Caching**
   - Frontend caches metrics between updates
   - Reduces unnecessary re-renders
   - State updates only when data changes

3. **Lazy Loading**
   - Drill-down modal loads data on demand
   - Reduces initial page load time

## Future Enhancements

1. **WebSocket Integration**
   - Replace polling with WebSocket for true real-time updates
   - Reduces latency and server load

2. **Advanced Filtering**
   - Filter alerts by type
   - Date range selection for drill-down data

3. **Custom Dashboards**
   - Allow users to customize widget layout
   - Save preferred views

4. **Export Functionality**
   - Export metrics to CSV/PDF
   - Schedule automated reports

5. **Predictive Analytics**
   - ML-based anomaly detection
   - Predictive maintenance alerts

## Testing

### Manual Testing Checklist

- [ ] Dashboard loads without errors
- [ ] Real-time updates work (check every 30 seconds)
- [ ] Manual refresh button works
- [ ] Click metrics to open drill-down modal
- [ ] Drill-down shows chart and transactions
- [ ] Alerts display correctly
- [ ] Dismiss alert removes it from list
- [ ] Click "View" on alert navigates correctly
- [ ] Responsive on mobile devices
- [ ] No console errors

### API Testing

```bash
# Test metrics endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard/metrics

# Test alerts endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard/alerts

# Test drill-down endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/dashboard/transactions/oee?startDate=2026-01-24&endDate=2026-01-25"
```

## Troubleshooting

### Dashboard not updating
- Check browser console for errors
- Verify API endpoints are accessible
- Check authentication token is valid
- Ensure CORS is configured correctly

### Alerts not showing
- Verify backend data files have inventory/payments/production data
- Check API response in network tab
- Ensure alert generation logic is correct

### Drill-down modal not opening
- Check if metric parameter is passed correctly
- Verify Dialog component is imported
- Check browser console for errors

## Files Summary

### Frontend Components
- `src/pages/dashboard/HomeEnhanced.tsx` - Main dashboard (1000+ lines)
- `src/components/dashboard/ProductionMetricsWidget.tsx` - Metrics display
- `src/components/dashboard/AlertsNotificationPanel.tsx` - Alerts panel
- `src/components/dashboard/DrillDownModal.tsx` - Drill-down modal

### Services & Hooks
- `src/services/productionMetricsService.ts` - Metrics calculations
- `src/services/dashboardApiService.ts` - API client
- `src/hooks/useRealTimeUpdates.ts` - Real-time polling hook

### Backend
- `backend/dashboard-endpoints.js` - API endpoints

### Configuration
- `src/App.tsx` - Updated routing to use HomeEnhanced

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component documentation
3. Check browser console for errors
4. Verify API endpoints are working
5. Check network tab for failed requests
