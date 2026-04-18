# Super Admin Panel - Technical Design Document

## Overview

The Super Admin Panel is a comprehensive management interface for system administrators to oversee and manage multiple companies within the ERP system. This design document outlines the technical architecture, database schema, API endpoints, and integration points required to implement the super admin panel feature.

The system leverages the existing multi-tenant architecture with Prisma ORM and PostgreSQL, extending it with new models for company management, subscription plans, audit logging, and analytics.

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Super Admin Panel UI                         │
│  (Company Mgmt | Admin Mgmt | Users | Plans | Analytics | Logs) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js API Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Authentication & Authorization Middleware               │   │
│  │ - JWT Token Validation                                  │   │
│  │ - Role-Based Access Control (RBAC)                      │   │
│  │ - Company-Level Data Isolation                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Route Handlers                                       │   │
│  │ - Company Management Routes                             │   │
│  │ - Admin Management Routes                               │   │
│  │ - User Provisioning Routes                              │   │
│  │ - Subscription Management Routes                        │   │
│  │ - Audit Logging Routes                                  │   │
│  │ - Analytics Routes                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Business Logic Layer                                     │   │
│  │ - Permission Boundary Enforcement                       │   │
│  │ - User Limit Validation                                 │   │
│  │ - Audit Log Creation                                    │   │
│  │ - Analytics Calculation                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Prisma ORM Layer                              │
│  - Query Building & Optimization                                │
│  - Transaction Management                                       │
│  - Relationship Resolution                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Core Tables:                                             │   │
│  │ - Company, CompanyAdmin, User                            │   │
│  │ - SubscriptionPlan, Subscription                         │   │
│  │ - AuditLog, SupportTicket                                │   │
│  │ - Invoice, SubscriptionPayment                           │   │
│  │ - ApiKey, SystemSetting                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Action (Super Admin / Company Admin)
         │
         ▼
    API Request
         │
         ▼
Authentication Middleware
    (Validate JWT Token)
         │
         ▼
Authorization Middleware
    (Check Role & Permissions)
         │
         ▼
Company-Level Filter
    (Apply companyId filter)
         │
         ▼
Business Logic Handler
    (Validate, Process, Enforce Rules)
         │
         ▼
Audit Log Creation
    (Log action with before/after state)
         │
         ▼
Database Operation
    (Create, Update, Delete, Query)
         │
         ▼
Response Formatting
    (Success/Error Response)
         │
         ▼
API Response to Client
```

## Components and Interfaces

### 1. Authentication & Authorization Layer

**Purpose**: Ensure only authenticated users with appropriate roles can access super admin features.

**Components**:
- `authenticateToken`: Middleware that validates JWT tokens
- `authorize(roles)`: Middleware that checks if user has required role
- `authorizeSelfOrRoles(roles)`: Middleware for self-access or role-based access

**Key Features**:
- JWT-based authentication with 8-hour expiration
- Role-based access control (super_admin, admin, user)
- Company-level data isolation through companyId filtering
- Audit logging of all access attempts

### 2. Company Management Module

**Purpose**: Enable super admins to manage companies (tenants) in the system.

**Endpoints**:
- `GET /api/super-admin/companies` - List all companies with pagination
- `GET /api/super-admin/companies/:id` - Get company details with admins and subscriptions
- `POST /api/super-admin/companies` - Create new company
- `PUT /api/super-admin/companies/:id` - Update company information
- `DELETE /api/super-admin/companies/:id` - Soft-delete company

**Business Logic**:
- Validate required fields (name, email)
- Assign unique company ID (CUID)
- Initialize user limits based on subscription plan
- Soft-delete with `deletedAt` timestamp
- Cascade delete related data (users, orders, etc.)

### 3. Company Admin Management Module

**Purpose**: Manage company administrators and their permissions.

**Endpoints**:
- `GET /api/super-admin/admins` - List all company admins
- `POST /api/super-admin/admins` - Assign user as company admin
- `PUT /api/super-admin/admins/:id` - Update admin role/status
- `DELETE /api/super-admin/admins/:id` - Remove admin role

**Business Logic**:
- Create CompanyAdmin relationship between User and Company
- Validate that company has at least one active admin
- Prevent removal of last active admin
- Preserve user account when removing admin role
- Audit all admin changes

### 4. User Provisioning Module

**Purpose**: Enable company admins to manage users within their company.

**Endpoints**:
- `GET /api/company-admin/users` - List users in company (filtered by companyId)
- `POST /api/company-admin/users` - Create new user in company
- `PUT /api/company-admin/users/:id` - Update user role/status
- `DELETE /api/company-admin/users/:id` - Deactivate user

**Business Logic**:
- Enforce user limit based on subscription plan
- Validate email uniqueness across system
- Assign role from predefined list (user, admin, super_admin)
- Prevent company admins from creating super_admin users
- Decrement active user count when user is deactivated
- Send invitation email with temporary credentials (mocked)

### 5. Subscription Management Module

**Purpose**: Manage subscription plans and company subscriptions.

**Endpoints**:
- `GET /api/super-admin/plans` - List all subscription plans
- `POST /api/super-admin/plans` - Create new subscription plan
- `GET /api/super-admin/subscriptions` - List company subscriptions
- `PUT /api/super-admin/subscriptions/:id` - Update company subscription

**Business Logic**:
- Define plans with name, price, maxUsers, maxStorage, features
- Validate plan deletion (prevent if companies use it)
- Update user limits when plan is assigned
- Cascade plan updates to all companies using the plan
- Track subscription status (active, expired, cancelled)

### 6. Audit Logging Module

**Purpose**: Track all system actions for compliance and debugging.

**Endpoints**:
- `GET /api/super-admin/audit-logs` - Query audit logs with filtering
- `GET /api/company-admin/audit-logs` - Query company-specific audit logs

**Business Logic**:
- Create audit log entry for every action (create, update, delete, login)
- Capture user ID, action type, resource type, resource ID, timestamp, IP address
- Store before/after state for updates
- Log failed authorization attempts with error message
- Filter logs by company for company admins
- Return logs ordered by most recent first with pagination

### 7. Analytics Module

**Purpose**: Provide system-wide and company-specific analytics.

**Endpoints**:
- `GET /api/super-admin/analytics` - Get platform-wide analytics
- `GET /api/super-admin/companies/:id/stats` - Get company-specific statistics
- `GET /api/super-admin/analytics/export` - Export analytics as CSV/PDF

**Business Logic**:
- Calculate total companies, active companies, total users, total revenue
- Calculate company-specific metrics (user count, order count, sales count, expense count)
- Filter by date range
- Exclude deleted companies from active count but include in historical data
- Cache analytics for performance (2-second response time target)
- Generate CSV/PDF exports

### 8. Permission Boundary Enforcement

**Purpose**: Ensure strict isolation between super admins and company admins.

**Rules**:
- Company admins can only access their own company's data
- Company admins cannot create/modify super_admin users
- Company admins cannot modify company settings or subscription plans
- Company admins cannot view system-wide analytics or audit logs
- Super admins have unrestricted access to all companies and settings
- All cross-company access attempts are logged as failures

**Implementation**:
- Apply companyId filter to all queries for company admins
- Check user role before allowing sensitive operations
- Validate that requested resource belongs to user's company
- Log all unauthorized access attempts

## Data Models

### Core Models

#### Company
```prisma
model Company {
  id                String   @id @default(cuid())
  name              String
  email             String?  @unique
  phone             String?
  address           String?
  website           String?
  logo              String?
  subscriptionPlan  String   @default("starter")
  subscriptionStatus String  @default("active")
  maxUsers          Int      @default(10)
  maxStorage        Int      @default(1000) // in MB
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?

  // Relations
  admins            CompanyAdmin[]
  subscriptions     Subscription[]
  auditLogs         AuditLog[]
  supportTickets    SupportTicket[]
  users             User[]
  
  @@index([email])
  @@index([subscriptionStatus])
}
```

#### CompanyAdmin
```prisma
model CompanyAdmin {
  id        String   @id @default(cuid())
  companyId String
  userId    String
  role      String   @default("admin") // admin, super_admin
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([companyId, userId])
  @@index([companyId])
  @@index([userId])
}
```

#### SubscriptionPlan
```prisma
model SubscriptionPlan {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  billingCycle String  @default("monthly") // monthly, yearly
  maxUsers    Int
  maxStorage  Int      // in MB
  features    Json?    // Array of feature names
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  subscriptions Subscription[]

  @@index([status])
}
```

#### Subscription
```prisma
model Subscription {
  id        String   @id @default(cuid())
  companyId String
  planId    String
  startDate DateTime
  endDate   DateTime?
  status    String   @default("active") // active, expired, cancelled
  autoRenew Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  company   Company           @relation(fields: [companyId], references: [id], onDelete: Cascade)
  plan      SubscriptionPlan  @relation(fields: [planId], references: [id])

  @@index([companyId])
  @@index([status])
}
```

#### AuditLog
```prisma
model AuditLog {
  id            String   @id @default(cuid())
  companyId     String?
  userId        String?
  action        String   // create, update, delete, login, logout
  resourceType  String   // user, company, order, etc
  resourceId    String?
  changes       Json?    // What changed (before/after)
  ipAddress     String?
  userAgent     String?
  status        String   @default("success") // success, failure
  errorMessage  String?
  createdAt     DateTime @default(now())

  // Relations
  company       Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  user          User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([companyId])
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

#### User (Extended)
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  username  String?  @unique
  email     String?  @unique
  password  String?
  passwordHash String?
  role      String   @default("user") // user, admin, super_admin
  status    String   @default("active")
  companyId String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  company       Company?        @relation(fields: [companyId], references: [id], onDelete: SetNull)
  adminRoles    CompanyAdmin[]
  auditLogs     AuditLog[]
  supportTickets SupportTicket[]

  @@index([email])
  @@index([username])
  @@index([role])
  @@index([companyId])
}
```

## API Endpoints

### Company Management

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/super-admin/companies` | super_admin | List all companies with pagination |
| GET | `/api/super-admin/companies/:id` | super_admin | Get company details with admins and subscriptions |
| POST | `/api/super-admin/companies` | super_admin | Create new company |
| PUT | `/api/super-admin/companies/:id` | super_admin | Update company information |
| DELETE | `/api/super-admin/companies/:id` | super_admin | Soft-delete company |

### Company Admin Management

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/super-admin/admins` | super_admin | List all company admins |
| POST | `/api/super-admin/admins` | super_admin | Assign user as company admin |
| PUT | `/api/super-admin/admins/:id` | super_admin | Update admin role/status |
| DELETE | `/api/super-admin/admins/:id` | super_admin | Remove admin role |

### User Provisioning (Company Admin)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/company-admin/users` | admin | List users in company |
| POST | `/api/company-admin/users` | admin | Create new user in company |
| PUT | `/api/company-admin/users/:id` | admin | Update user role/status |
| DELETE | `/api/company-admin/users/:id` | admin | Deactivate user |

### Subscription Management

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/super-admin/plans` | super_admin | List all subscription plans |
| POST | `/api/super-admin/plans` | super_admin | Create new subscription plan |
| GET | `/api/super-admin/subscriptions` | super_admin | List company subscriptions |
| PUT | `/api/super-admin/subscriptions/:id` | super_admin | Update company subscription |

### Audit Logging

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/super-admin/audit-logs` | super_admin | Query all audit logs with filtering |
| GET | `/api/company-admin/audit-logs` | admin | Query company-specific audit logs |

### Analytics

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/super-admin/analytics` | super_admin | Get platform-wide analytics |
| GET | `/api/super-admin/companies/:id/stats` | super_admin | Get company-specific statistics |
| GET | `/api/super-admin/analytics/export` | super_admin | Export analytics as CSV/PDF |

### Company Admin Self-Service

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/company-admin/settings` | admin | Get company settings |
| PUT | `/api/company-admin/settings` | admin | Update company settings |
| GET | `/api/company-admin/subscription` | admin | Get subscription details |
| GET | `/api/company-admin/profile` | admin | Get admin profile |
| PUT | `/api/company-admin/profile` | admin | Update admin profile |
| POST | `/api/company-admin/password-change` | admin | Change password |
| POST | `/api/company-admin/password-reset` | public | Request password reset |

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "error message for field"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User lacks required permissions |
| NOT_FOUND | 404 | Requested resource not found |
| VALIDATION_ERROR | 400 | Invalid input data |
| DUPLICATE_RECORD | 409 | Duplicate record (e.g., duplicate email) |
| USER_LIMIT_EXCEEDED | 400 | Company has reached user limit |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Internal server error |

### Validation Rules

**Company Creation**:
- Name: Required, string, max 255 characters
- Email: Required, valid email format, unique across system
- Phone: Optional, valid phone format
- Address: Optional, string, max 500 characters
- Website: Optional, valid URL format
- Subscription Plan: Required, must exist in SubscriptionPlan table

**User Creation**:
- Name: Required, string, max 255 characters
- Email: Required, valid email format, unique across system
- Role: Required, must be one of: user, admin (not super_admin for company admins)
- Phone: Optional, valid phone format
- Department: Optional, string, max 100 characters
- Company: Required, must match requesting user's company (for company admins)

**Subscription Plan Creation**:
- Name: Required, string, unique, max 100 characters
- Price: Required, decimal, >= 0
- MaxUsers: Required, integer, > 0
- MaxStorage: Required, integer, > 0 (in MB)
- Features: Optional, array of strings

## Testing Strategy

### Unit Tests

**Company Management**:
- Test company creation with valid/invalid data
- Test company update with various field combinations
- Test soft-delete functionality
- Test company retrieval with pagination

**User Provisioning**:
- Test user creation within company
- Test user limit enforcement
- Test email uniqueness validation
- Test user deactivation and slot freeing

**Permission Boundaries**:
- Test company admin cannot access other companies' data
- Test company admin cannot create super_admin users
- Test company admin cannot modify company settings
- Test super admin has unrestricted access

**Audit Logging**:
- Test audit log creation for all actions
- Test before/after state capture
- Test failed action logging
- Test audit log filtering by company/user/action

**Subscription Management**:
- Test plan creation and assignment
- Test user limit updates on plan change
- Test plan deletion prevention when in use
- Test cascade updates to companies using plan

### Integration Tests

**Multi-Tenant Isolation**:
- Test that company admins only see their company's data
- Test that super admins see all companies
- Test cross-company access denial

**User Limit Enforcement**:
- Test user creation at capacity
- Test user deactivation freeing slots
- Test plan upgrade increasing limits
- Test plan downgrade preventing over-limit additions

**Audit Trail**:
- Test complete audit trail for company lifecycle
- Test audit trail for user management
- Test audit trail for subscription changes

**Analytics**:
- Test analytics calculation accuracy
- Test analytics filtering by date range
- Test analytics export generation

### Property-Based Testing

**Note**: This feature involves primarily CRUD operations, permission enforcement, and data isolation. While some aspects could benefit from property-based testing, the majority of requirements are better served by example-based and integration tests due to:

1. **Infrastructure/Configuration Focus**: Many requirements involve setting up relationships and enforcing business rules rather than testing pure functions
2. **External Dependencies**: Email sending, PDF generation, and external service integration
3. **Deterministic Behavior**: Permission checks and data isolation rules are deterministic and don't benefit from randomization

**Recommended Testing Approach**:
- Use example-based unit tests for validation logic
- Use integration tests for multi-tenant isolation and permission enforcement
- Use mock-based tests for external dependencies (email, PDF generation)
- Use snapshot tests for analytics output format

## Integration Points

### 1. Existing User Management System

**Integration**:
- Reuse existing User model and validation
- Extend User model with companyId field
- Apply company-level filters to all user queries
- Maintain role-based access control consistency

**Considerations**:
- Ensure password hashing is consistent
- Maintain email uniqueness across system
- Preserve existing user data during migration

### 2. Multi-Tenant Architecture

**Integration**:
- Leverage existing companyId filtering
- Extend Company model with subscription and admin relationships
- Apply company-level isolation to all new tables
- Cascade delete related data when company is deleted

**Considerations**:
- Ensure all queries include companyId filter
- Test data isolation thoroughly
- Handle soft-delete vs hard-delete consistently

### 3. Authentication System

**Integration**:
- Use existing JWT token validation
- Extend token payload with companyId
- Maintain 8-hour token expiration
- Preserve existing login/logout endpoints

**Considerations**:
- Update token generation to include companyId
- Ensure token validation checks company context
- Handle token refresh for long-running operations

### 4. Existing Modules

**Integration**:
- Extend existing Order, Sale, Purchase, Inventory models with companyId
- Apply company-level filters to all existing queries
- Maintain consistency with existing CRUD patterns
- Preserve existing API endpoints

**Considerations**:
- Ensure backward compatibility
- Test existing functionality with company filters
- Update existing tests to include company context

## Security Considerations

### Authentication & Authorization

- Use JWT tokens with 8-hour expiration
- Validate token signature on every request
- Check user role and company context
- Log all authentication failures

### Data Isolation

- Apply companyId filter to all queries
- Validate that requested resource belongs to user's company
- Prevent cross-company data access
- Log all unauthorized access attempts

### Input Validation

- Validate all input data against schema
- Sanitize email addresses and URLs
- Limit string lengths to prevent buffer overflows
- Validate numeric ranges

### Password Security

- Hash passwords using bcrypt with salt
- Enforce password complexity requirements
- Implement password reset with 24-hour expiration
- Log all password changes

### Audit Logging

- Log all system actions with user ID and timestamp
- Capture IP address and user agent
- Store before/after state for updates
- Preserve audit logs for compliance

## Performance Considerations

### Database Optimization

- Index frequently queried fields (email, companyId, status)
- Use pagination for large result sets
- Cache subscription plans and system settings
- Optimize audit log queries with date range filtering

### Query Optimization

- Use Prisma's `include` for relationship loading
- Avoid N+1 queries with proper relationship resolution
- Batch operations where possible
- Use database-level aggregations for analytics

### Caching Strategy

- Cache subscription plans (invalidate on update)
- Cache system settings (invalidate on update)
- Cache analytics results (invalidate hourly)
- Use Redis for session management

### Response Time Targets

- Company list: < 500ms
- User list: < 500ms
- Analytics: < 2 seconds
- Audit logs: < 1 second

## Deployment Considerations

### Database Migration

- Create new tables (Company, CompanyAdmin, SubscriptionPlan, Subscription, AuditLog)
- Add companyId field to existing tables
- Create indexes for performance
- Migrate existing data to new schema

### Backward Compatibility

- Maintain existing API endpoints
- Support existing authentication method
- Preserve existing user data
- Gradual rollout of new features

### Monitoring & Logging

- Monitor API response times
- Track error rates by endpoint
- Monitor database query performance
- Alert on unauthorized access attempts

## Future Enhancements

1. **Advanced Analytics**: Predictive analytics, trend analysis, custom reports
2. **Automated Workflows**: Automated user provisioning, subscription renewal
3. **Integration APIs**: Third-party integrations, webhook support
4. **Advanced Permissions**: Fine-grained permission control, custom roles
5. **Multi-Factor Authentication**: 2FA, biometric authentication
6. **Data Export**: Advanced export formats, scheduled exports
7. **Compliance Features**: GDPR compliance, data retention policies
8. **Performance Optimization**: Query optimization, caching strategies
