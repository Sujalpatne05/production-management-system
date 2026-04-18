# Super Admin Frontend Structure

## Directory Structure

```
src/
├── pages/
│   └── super-admin/
│       ├── SuperAdminDashboard.tsx (Main layout)
│       ├── dashboard/
│       │   ├── Overview.tsx
│       │   ├── Analytics.tsx
│       │   └── KeyMetrics.tsx
│       ├── companies/
│       │   ├── CompaniesList.tsx
│       │   ├── CompanyDetails.tsx
│       │   ├── AddCompany.tsx
│       │   └── CompanyStats.tsx
│       ├── admins/
│       │   ├── AdminsList.tsx
│       │   ├── AddAdmin.tsx
│       │   ├── AdminDetails.tsx
│       │   └── AdminActivityLogs.tsx
│       ├── users/
│       │   ├── UsersList.tsx
│       │   ├── UserDetails.tsx
│       │   └── UserActivity.tsx
│       ├── billing/
│       │   ├── SubscriptionPlans.tsx
│       │   ├── CompanySubscriptions.tsx
│       │   ├── Invoices.tsx
│       │   └── Payments.tsx
│       ├── settings/
│       │   ├── GlobalSettings.tsx
│       │   ├── EmailSettings.tsx
│       │   ├── SMSSettings.tsx
│       │   ├── APIKeys.tsx
│       │   └── MaintenanceMode.tsx
│       ├── analytics/
│       │   ├── PlatformAnalytics.tsx
│       │   ├── RevenueReports.tsx
│       │   ├── UserReports.tsx
│       │   └── PerformanceMetrics.tsx
│       ├── audit/
│       │   ├── AuditLogs.tsx
│       │   ├── AdminActivity.tsx
│       │   ├── CompanyActivity.tsx
│       │   ├── ErrorLogs.tsx
│       │   └── SecurityLogs.tsx
│       ├── support/
│       │   ├── SupportTickets.tsx
│       │   ├── TicketDetails.tsx
│       │   └── KnowledgeBase.tsx
│       └── security/
│           ├── Permissions.tsx
│           ├── Roles.tsx
│           ├── IPWhitelist.tsx
│           └── TwoFactorAuth.tsx
├── components/
│   └── super-admin/
│       ├── SuperAdminSidebar.tsx
│       ├── SuperAdminHeader.tsx
│       ├── CompanyCard.tsx
│       ├── AdminCard.tsx
│       ├── AnalyticsChart.tsx
│       └── StatCard.tsx
└── contexts/
    └── SuperAdminContext.tsx
```

## Component Details

### 1. SuperAdminDashboard.tsx
Main layout component for super admin dashboard

### 2. Companies Management
- **CompaniesList.tsx** - List all companies with filters
- **CompanyDetails.tsx** - View company details and statistics
- **AddCompany.tsx** - Create new company
- **CompanyStats.tsx** - Company statistics and usage

### 3. Admins Management
- **AdminsList.tsx** - List all admins with company filter
- **AddAdmin.tsx** - Add admin to company
- **AdminDetails.tsx** - View admin details
- **AdminActivityLogs.tsx** - View admin activity logs

### 4. Users Management
- **UsersList.tsx** - List all users across companies
- **UserDetails.tsx** - View user details
- **UserActivity.tsx** - View user activity logs

### 5. Billing & Subscriptions
- **SubscriptionPlans.tsx** - Manage subscription plans
- **CompanySubscriptions.tsx** - View company subscriptions
- **Invoices.tsx** - Manage invoices
- **Payments.tsx** - Track payments

### 6. Settings
- **GlobalSettings.tsx** - Global configuration
- **EmailSettings.tsx** - Email configuration
- **SMSSettings.tsx** - SMS configuration
- **APIKeys.tsx** - Manage API keys
- **MaintenanceMode.tsx** - System maintenance

### 7. Analytics & Reports
- **PlatformAnalytics.tsx** - Platform-wide analytics
- **RevenueReports.tsx** - Revenue reports
- **UserReports.tsx** - User statistics
- **PerformanceMetrics.tsx** - System performance

### 8. Audit & Logs
- **AuditLogs.tsx** - System audit logs
- **AdminActivity.tsx** - Admin activity logs
- **CompanyActivity.tsx** - Company activity logs
- **ErrorLogs.tsx** - Error logs
- **SecurityLogs.tsx** - Security logs

### 9. Support
- **SupportTickets.tsx** - Support ticket management
- **TicketDetails.tsx** - View ticket details
- **KnowledgeBase.tsx** - Knowledge base articles

### 10. Security
- **Permissions.tsx** - Manage permissions
- **Roles.tsx** - Manage roles
- **IPWhitelist.tsx** - IP whitelist management
- **TwoFactorAuth.tsx** - 2FA settings

## Routes to Add

```typescript
// In App.tsx, add these routes for Super Admin
<Route path="/super-admin" element={<SuperAdminDashboard />}>
  <Route index element={<Overview />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="companies" element={<CompaniesList />} />
  <Route path="companies/:id" element={<CompanyDetails />} />
  <Route path="companies/add" element={<AddCompany />} />
  <Route path="admins" element={<AdminsList />} />
  <Route path="admins/add" element={<AddAdmin />} />
  <Route path="users" element={<UsersList />} />
  <Route path="billing/plans" element={<SubscriptionPlans />} />
  <Route path="billing/subscriptions" element={<CompanySubscriptions />} />
  <Route path="billing/invoices" element={<Invoices />} />
  <Route path="settings" element={<GlobalSettings />} />
  <Route path="settings/email" element={<EmailSettings />} />
  <Route path="settings/api-keys" element={<APIKeys />} />
  <Route path="analytics" element={<PlatformAnalytics />} />
  <Route path="audit/logs" element={<AuditLogs />} />
  <Route path="support/tickets" element={<SupportTickets />} />
  <Route path="security/permissions" element={<Permissions />} />
</Route>
```

## Context (SuperAdminContext.tsx)

```typescript
interface SuperAdminContextType {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  loading: boolean;
  error: string | null;
}

export const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);
```

## Key Features

1. **Company Management**
   - Create, read, update, delete companies
   - View company statistics
   - Manage subscriptions

2. **Admin Management**
   - Add/remove admins
   - View admin activity
   - Reset passwords

3. **User Management**
   - View all users
   - Filter by company
   - Deactivate users

4. **Billing**
   - Manage subscription plans
   - Track invoices
   - Monitor payments

5. **Analytics**
   - Platform analytics
   - Revenue reports
   - User statistics

6. **Audit & Logs**
   - System audit logs
   - Admin activity logs
   - Error tracking

7. **Support**
   - Support ticket management
   - Knowledge base

8. **Security**
   - Permission management
   - Role management
   - IP whitelist

## Authentication Flow

1. User logs in
2. Check role in JWT token
3. If role = "super_admin" → Redirect to /super-admin
4. If role = "admin" → Redirect to /dashboard
5. If role = "user" → Redirect to /dashboard

## Data Isolation

- Super Admin can see all companies' data
- Admin can only see their company's data
- All queries filtered by company_id for admins
- Super admin queries don't filter by company_id

