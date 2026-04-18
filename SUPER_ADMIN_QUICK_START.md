# Super Admin Panel - Quick Start Guide

## Overview
The Super Admin Panel is a comprehensive management interface for system administrators to manage multiple companies, admins, users, subscriptions, and view analytics.

## Login
1. Navigate to the login page
2. Enter credentials:
   - **Email:** superadmin@example.com
   - **Password:** SuperAdmin@123
3. You will be automatically redirected to `/super-admin`

## Dashboard Features

### 1. Companies Management (`/super-admin/companies`)
**Purpose:** Manage all companies (tenants) in the system

**Features:**
- View all companies with their subscription plans and status
- Add new company with admin assignment
- Edit company information
- Delete (soft-delete) companies
- View company details and recent activity

**Actions:**
- Click "Add Company" to create a new company and assign an admin
- Click "View" to see company details
- Click "Edit" to modify company information
- Click "Delete" to soft-delete a company

### 2. Admin Management (`/super-admin/admins`)
**Purpose:** Manage company administrators

**Features:**
- View all company admins
- See which company each admin manages
- View admin credentials
- Edit admin information
- Remove admin role

**Actions:**
- Click "View Password" to see admin credentials
- Click "Copy" to copy password to clipboard
- Click "Edit" to modify admin details
- Click "Delete" to remove admin role

### 3. User Management (`/super-admin/users`)
**Purpose:** View all users across all companies

**Features:**
- View all users in the system
- Filter by role (Super Admin, Admin, User)
- Search by name or email
- View user status and creation date
- Edit or delete users

**Actions:**
- Use search to find specific users
- Use role filter to view users by role
- Click "Edit" to modify user information
- Click "Delete" to remove user

### 4. Billing & Subscriptions

#### Subscription Plans (`/super-admin/billing/plans`)
**Purpose:** Manage subscription plans

**Features:**
- View all available subscription plans
- See plan details (price, max users, storage, features)
- Create new plans
- Edit existing plans
- Delete plans (if not in use)

**Actions:**
- Click "Create Plan" to add a new subscription plan
- Click "Edit" to modify plan details
- Click "Delete" to remove a plan

#### Subscriptions (`/super-admin/billing/subscriptions`)
**Purpose:** Manage company subscriptions

**Features:**
- View all company subscriptions
- See subscription status (active, expired, cancelled)
- Filter by status
- View plan details and pricing
- Edit subscription details

**Actions:**
- Use status filter to view subscriptions by status
- Click "Edit" to modify subscription details

### 5. Audit Logs (`/super-admin/audit`)
**Purpose:** Track all system actions for compliance

**Features:**
- View all audit logs with timestamps
- Filter by action (create, update, delete, login, logout)
- Filter by resource type (company, user, admin, subscription)
- See who performed each action and when
- View IP addresses and status
- Export logs as CSV

**Actions:**
- Use action filter to view specific types of actions
- Use resource filter to view logs for specific resources
- Click "Export CSV" to download audit logs

### 6. Analytics (`/super-admin/analytics`)
**Purpose:** View platform-wide analytics and metrics

**Features:**
- Total companies count
- Active vs inactive companies
- Total users across all companies
- Total revenue
- Active rate percentage
- Average users per company
- Export analytics as CSV

**Actions:**
- View key metrics on the dashboard
- Click "Export CSV" to download analytics data

## Sidebar Navigation
The super admin sidebar provides quick access to all features:
- **Dashboard** - Overview and key metrics
- **Companies** - Company management
- **Admins** - Admin management
- **Users** - User management
- **Billing** - Plans and subscriptions
- **Audit** - Audit logs
- **Analytics** - Platform analytics

## Common Tasks

### Create a New Company
1. Go to Companies → Add Company
2. Fill in company details (name, email, phone, address, website)
3. Select subscription plan
4. Fill in admin details (name, email, phone, password)
5. Click "Create Company & Admin"

### Add a New Admin
1. Go to Admins → Add Admin
2. Select company from dropdown
3. Fill in admin details (name, email, username, password)
4. Click "Create Admin"

### View Company Details
1. Go to Companies
2. Click "View" button for the company
3. See company information, admin details, and recent activity

### Export Data
1. Go to Audit Logs or Analytics
2. Click "Export CSV" button
3. File will be downloaded to your computer

### Filter and Search
- Use search boxes to find specific records
- Use dropdown filters to narrow results by status, role, or action
- Results update in real-time as you type

## Security Features

### Role-Based Access Control
- Only super admins can access the super admin panel
- Non-super-admin users are redirected to regular dashboard
- All actions are logged in audit logs

### Audit Logging
- Every action is logged with:
  - User who performed the action
  - What action was performed
  - When it was performed
  - IP address of the user
  - Status (success or failure)

### Data Isolation
- Each company's data is isolated
- Company admins can only see their own company's data
- Super admins can see all companies' data

## Troubleshooting

### 404 Error on Super Admin Routes
- Ensure you're logged in as a super admin
- Check that the URL is correct (e.g., `/super-admin/companies`)
- Clear browser cache and reload

### Cannot Create Company
- Ensure all required fields are filled
- Check that email is unique
- Verify subscription plan exists
- Check browser console for error messages

### Audit Logs Not Showing
- Ensure you have the correct filters applied
- Try clearing filters to see all logs
- Check that actions have been performed (logs only show after actions)

### Export Not Working
- Ensure you have the correct permissions
- Check browser's download settings
- Try a different browser if issue persists

## API Endpoints (Backend)

All super admin features use the following API endpoints:

**Companies:**
- `GET /api/super-admin/companies` - List all companies
- `POST /api/super-admin/companies` - Create company
- `PUT /api/super-admin/companies/:id` - Update company
- `DELETE /api/super-admin/companies/:id` - Delete company

**Admins:**
- `GET /api/super-admin/admins` - List all admins
- `POST /api/super-admin/admins` - Create admin
- `PUT /api/super-admin/admins/:id` - Update admin
- `DELETE /api/super-admin/admins/:id` - Delete admin

**Users:**
- `GET /api/users` - List all users
- `DELETE /api/super-admin/users/:id` - Delete user

**Plans:**
- `GET /api/super-admin/plans` - List all plans
- `POST /api/super-admin/plans` - Create plan
- `DELETE /api/super-admin/plans/:id` - Delete plan

**Subscriptions:**
- `GET /api/super-admin/subscriptions` - List subscriptions
- `PUT /api/super-admin/subscriptions/:id` - Update subscription

**Audit Logs:**
- `GET /api/super-admin/audit-logs` - List audit logs

**Analytics:**
- `GET /api/super-admin/analytics` - Get analytics data
- `GET /api/super-admin/analytics/export` - Export analytics

## Support
For issues or questions, contact the development team or check the documentation files in the project.
