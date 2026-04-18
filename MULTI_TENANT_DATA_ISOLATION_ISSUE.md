# Multi-Tenant Data Isolation Issue

## 🔴 Problems Identified

### Problem 1: Dashboard Shows Mock Data
**Issue:** Dashboard displays hardcoded mock data instead of real company data
- All metrics are hardcoded (₹45,65,000 sales, ₹23,45,000 purchase, etc.)
- Data doesn't change when switching companies
- New companies show same data as old companies

**Root Cause:** `DashboardMetrics.tsx` uses hardcoded mock data arrays

### Problem 2: No Company Name Display
**Issue:** Header doesn't show company name
- Shows generic "IProduction Management System"
- Should show "Zeptec Company" or company name

**Root Cause:** `DashboardHeader.tsx` doesn't retrieve or display company name

### Problem 3: No Company Data Filtering
**Issue:** Dashboard doesn't filter data by company
- All users see same data regardless of company
- New company should have empty dashboard

**Root Cause:** No `companyId` filter applied to data queries

---

## 🔧 Solution Required

### Step 1: Update DashboardHeader to Show Company Name

**File:** `src/components/DashboardHeader.tsx`

Add company name display:
```typescript
const DashboardHeader = () => {
  const navigate = useNavigate();
  
  // Get company name from localStorage
  const getCompanyName = () => {
    try {
      const tenant = localStorage.getItem('tenant');
      if (tenant) {
        const tenantData = JSON.parse(tenant);
        return tenantData.name || 'IProduction';
      }
    } catch (error) {
      console.error('Error getting company name:', error);
    }
    return 'IProduction';
  };
  
  const companyName = getCompanyName();
  
  return (
    <header className="...">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
        <div className="hidden md:block">
          <h2 className="text-sm font-semibold">{companyName}</h2>
        </div>
      </div>
      {/* Rest of header */}
    </header>
  );
};
```

### Step 2: Update DashboardMetrics to Fetch Real Data

**File:** `src/pages/dashboard/DashboardMetrics.tsx`

Replace mock data with API calls:
```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get company ID from localStorage
        const tenant = JSON.parse(localStorage.getItem('tenant') || '{}');
        const companyId = tenant.id;
        
        if (!companyId) {
          console.warn('No company ID found');
          return;
        }
        
        // Fetch dashboard data for this company
        const response = await apiClient.get(`/api/dashboard/metrics?companyId=${companyId}`);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  // Use real data from metrics instead of mock data
  const kpiMetrics = [
    {
      title: "Total Sales",
      value: `₹${metrics?.totalSales || 0}`,
      change: metrics?.salesChange || "+0%",
      // ...
    },
    // ...
  ];
  
  // Rest of component
};
```

### Step 3: Update Backend to Filter by Company

**Backend API Endpoints** should:
1. Accept `companyId` parameter
2. Filter all queries by `companyId`
3. Return only company-specific data

Example:
```javascript
app.get('/api/dashboard/metrics', authenticateToken, async (req, res) => {
  const companyId = req.query.companyId;
  
  if (!companyId) {
    return res.status(400).json({ error: 'companyId required' });
  }
  
  // Filter all queries by companyId
  const sales = await prisma.sale.findMany({
    where: { companyId }
  });
  
  const purchases = await prisma.purchase.findMany({
    where: { companyId }
  });
  
  // Calculate metrics from filtered data
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalPurchase = purchases.reduce((sum, p) => sum + p.total, 0);
  
  res.json({
    totalSales,
    totalPurchase,
    // ...
  });
});
```

---

## 📊 Expected Behavior After Fix

### For Zeptec Company (New):
```
Header: "Zeptec Company"
Dashboard:
- Total Sales: ₹0 (no sales yet)
- Total Purchase: ₹0 (no purchases yet)
- Pending Payments: ₹0
- Profit Margin: ₹0
- Stock Status: Empty
- Low Stock Products: None
```

### For Test Company (Old):
```
Header: "Test Company"
Dashboard:
- Shows only Test Company's data
- Sales, purchases, inventory specific to Test Company
```

---

## 🔄 Implementation Steps

### Phase 1: Frontend (Quick Fix)
1. Update DashboardHeader to show company name
2. Update DashboardMetrics to fetch real data
3. Add companyId filter to all API calls

### Phase 2: Backend (Data Isolation)
1. Add companyId filter to all queries
2. Ensure all endpoints validate company access
3. Return 403 for cross-company access

### Phase 3: Testing
1. Create multiple companies
2. Login with different company admins
3. Verify each sees only their company's data
4. Verify header shows correct company name

---

## 🎯 Success Criteria

✅ Header displays company name
✅ Dashboard shows company-specific data
✅ New company has empty dashboard
✅ Each company sees only their data
✅ No data leakage between companies
✅ Company name updates when switching companies

---

## 📁 Files to Modify

1. `src/components/DashboardHeader.tsx` - Add company name display
2. `src/pages/dashboard/DashboardMetrics.tsx` - Fetch real data
3. Backend API endpoints - Add companyId filtering

---

## ⚠️ Current State

- ❌ Dashboard shows mock data
- ❌ No company name displayed
- ❌ No data isolation between companies
- ❌ New companies show old data

---

## ✅ After Fix

- ✅ Dashboard shows real company data
- ✅ Company name displayed in header
- ✅ Data isolated by company
- ✅ New companies have empty dashboard

---

**Last Updated:** April 17, 2026
**Status:** ⏳ Awaiting Implementation
