# Super Admin Panel - Visual Guide

## Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                               │
│                                                              │
│  Email: superadmin@example.com                              │
│  Password: SuperAdmin@123                                   │
│                                                              │
│  [Sign In Button]                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ROLE CHECK (Backend)                           │
│                                                              │
│  if (user.role === 'super_admin') {                         │
│    redirect to /super-admin                                 │
│  } else {                                                   │
│    redirect to /dashboard/overview                          │
│  }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           ROUTE PROTECTION (Frontend)                       │
│                                                              │
│  <ProtectedRoute requiredRoles={['super_admin']}>           │
│    <SuperAdminDashboard />                                  │
│  </ProtectedRoute>                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           SUPER ADMIN DASHBOARD                             │
│                                                              │
│  ✅ Dashboard Overview                                      │
│  ✅ Companies Management                                    │
│  ✅ Admin Management                                        │
│  ✅ User Management                                         │
│  ✅ Billing & Subscriptions                                 │
│  ✅ Audit Logs                                              │
│  ✅ Analytics                                               │
└─────────────────────────────────────────────────────────────┘
```

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPER ADMIN DASHBOARD                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────────────────────────┐   │
│  │   SIDEBAR        │  │         MAIN CONTENT AREA            │   │
│  │                  │  │                                      │   │
│  │ ☰ Dashboard      │  │  Dashboard Overview                  │   │
│  │ 🏢 Companies     │  │  ┌──────────────────────────────┐   │   │
│  │ 👤 Admins        │  │  │ Total Companies: 5           │   │   │
│  │ 👥 Users         │  │  │ Active Companies: 4          │   │   │
│  │ 💳 Billing       │  │  │ Total Users: 45              │   │   │
│  │ 📋 Audit         │  │  │ Total Revenue: $12,500       │   │   │
│  │ 📊 Analytics     │  │  └──────────────────────────────┘   │   │
│  │                  │  │                                      │   │
│  │ [Logout]         │  │  Quick Actions:                      │   │
│  │                  │  │  [Add Company] [View Companies]      │   │
│  │                  │  │  [System Settings]                   │   │
│  │                  │  │                                      │   │
│  └──────────────────┘  └──────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Navigation Flow

```
                    /super-admin (Dashboard)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   /companies          /admins              /users
        │                  │                  │
        ├─ /add            ├─ /add            │
        ├─ /view           ├─ /view           │
        ├─ /edit           ├─ /edit           │
        └─ /delete         └─ /delete         │
        
        ▼                  ▼                  ▼
   /billing            /audit            /analytics
        │                  │                  │
        ├─ /plans          ├─ /filter         ├─ /export
        ├─ /subscriptions  ├─ /export         └─ /metrics
        └─ /manage         └─ /view
```

## Feature Hierarchy

```
SUPER ADMIN PANEL
│
├── 📊 DASHBOARD
│   ├── Analytics Overview
│   ├── Key Metrics
│   └── Quick Actions
│
├── 🏢 COMPANIES
│   ├── List Companies
│   ├── Add Company
│   ├── Edit Company
│   ├── View Details
│   └── Delete Company
│
├── 👤 ADMINS
│   ├── List Admins
│   ├── Add Admin
│   ├── View Credentials
│   ├── Edit Admin
│   └── Remove Admin
│
├── 👥 USERS
│   ├── List All Users
│   ├── Filter by Role
│   ├── Search Users
│   ├── Edit User
│   └── Delete User
│
├── 💳 BILLING
│   ├── Subscription Plans
│   │   ├── List Plans
│   │   ├── Create Plan
│   │   ├── Edit Plan
│   │   └── Delete Plan
│   │
│   └── Company Subscriptions
│       ├── List Subscriptions
│       ├── Filter by Status
│       ├── Edit Subscription
│       └── View Details
│
├── 📋 AUDIT LOGS
│   ├── View All Logs
│   ├── Filter by Action
│   ├── Filter by Resource
│   ├── Search Logs
│   └── Export as CSV
│
└── 📊 ANALYTICS
    ├── Platform Metrics
    ├── Company Statistics
    ├── Revenue Reports
    └── Export Data
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ACTION                              │
│              (Click, Submit, Filter, etc.)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  REACT COMPONENT                            │
│              (Handle user interaction)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  API CLIENT                                 │
│         (Build request with auth token)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API                                │
│         (Validate, Process, Return data)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE                                   │
│         (Store/Retrieve data)                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AUDIT LOG                                  │
│         (Log action with metadata)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSE                                   │
│         (Return to frontend)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  UI UPDATE                                  │
│         (Display results to user)                           │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 1: LOGIN                             │
│         (Email & Password Validation)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 2: JWT TOKEN                         │
│         (Token generation & validation)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 3: ROLE CHECK                        │
│         (Backend: Verify super_admin role)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 4: ROUTE PROTECTION                  │
│         (Frontend: ProtectedRoute component)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 5: AUDIT LOGGING                     │
│         (Log all actions with metadata)                     │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

```
App.tsx
│
├── BrowserRouter
│   └── Routes
│       │
│       ├── /login → Login Component
│       │
│       ├── /dashboard → Dashboard Layout
│       │   └── (Regular user routes)
│       │
│       └── /super-admin → ProtectedRoute
│           └── SuperAdminDashboard
│               ├── SuperAdminSidebar
│               ├── Header
│               └── Outlet
│                   ├── SuperAdminOverview
│                   ├── CompaniesList
│                   ├── AddCompany
│                   ├── AdminsList
│                   ├── AddAdmin
│                   ├── UsersList
│                   ├── PlansList
│                   ├── SubscriptionsList
│                   ├── AuditLogs
│                   └── Analytics
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                  LOCAL STORAGE                              │
│                                                              │
│  token: "eyJhbGciOiJIUzI1NiIs..."                           │
│  user: {                                                    │
│    id: "user123",                                           │
│    name: "Super Admin",                                     │
│    email: "superadmin@example.com",                         │
│    role: "super_admin",                                     │
│    companyId: null                                          │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT STATE                            │
│                                                              │
│  companies: []                                              │
│  admins: []                                                 │
│  users: []                                                  │
│  loading: false                                             │
│  error: null                                                │
│  filters: {}                                                │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints Map

```
/api/super-admin/
├── companies
│   ├── GET    → List all companies
│   ├── POST   → Create company
│   ├── PUT    → Update company
│   └── DELETE → Delete company
│
├── admins
│   ├── GET    → List all admins
│   ├── POST   → Create admin
│   ├── PUT    → Update admin
│   └── DELETE → Delete admin
│
├── users
│   ├── GET    → List all users
│   └── DELETE → Delete user
│
├── plans
│   ├── GET    → List plans
│   ├── POST   → Create plan
│   └── DELETE → Delete plan
│
├── subscriptions
│   ├── GET    → List subscriptions
│   └── PUT    → Update subscription
│
├── audit-logs
│   └── GET    → List audit logs
│
└── analytics
    ├── GET    → Get analytics
    └── /export → Export analytics
```

## User Journey

```
START
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  1. VISIT LOGIN PAGE                                        │
│     URL: localhost:8081/login                               │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ENTER CREDENTIALS                                       │
│     Email: superadmin@example.com                           │
│     Password: SuperAdmin@123                                │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  3. CLICK SIGN IN                                           │
│     Backend validates credentials                           │
│     JWT token generated                                     │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  4. REDIRECT TO SUPER ADMIN                                 │
│     URL: localhost:8081/super-admin                         │
│     ProtectedRoute checks role                              │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  5. DASHBOARD LOADS                                         │
│     Analytics fetched from API                              │
│     Sidebar navigation displayed                            │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  6. NAVIGATE TO FEATURES                                    │
│     Click on sidebar items                                  │
│     Routes update dynamically                               │
│     Content loads from API                                  │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  7. PERFORM ACTIONS                                         │
│     Add/Edit/Delete companies, admins, users                │
│     Filter and search data                                  │
│     Export reports                                          │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  8. AUDIT LOGGING                                           │
│     All actions logged in database                          │
│     Viewable in Audit Logs section                          │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────┐
│  9. LOGOUT                                                  │
│     Click Logout button                                     │
│     Token cleared from storage                              │
│     Redirect to login page                                  │
└────────────────────┬────────────────────────────────────────┘
  │
  ▼
END
```

---

This visual guide provides a comprehensive overview of the Super Admin Panel architecture, data flow, and user journey.
