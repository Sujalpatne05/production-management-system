# Production Management System - Enhancement Roadmap

## Implementation Priority

This roadmap focuses on control, trust, and user confidence features to be added to the existing system.

---

## 🥇 STEP 1 — CONTROL LAYERS (FIRST PRIORITY)

**Goal:** Control existing data and prevent unauthorized changes.

### 1. Approval Workflows

**Module: Approvals**

#### Purchase Orders
- ✅ PO creation (existing)
- 🔲 PO approval workflow
  - Draft → Pending Approval → Approved → Rejected
  - Configurable approval chains (e.g., Manager → Admin)
  - Approval delegation support
  - Email notifications on approval requests
- 🔲 Approval history tracking
- 🔲 Multi-level approvals (amount-based thresholds)

#### Sales Orders
- ✅ Sales order creation (existing)
- 🔲 Sales order approval workflow
  - Draft → Pending Approval → Approved → Rejected
  - Credit limit checks before approval
  - Discount approval workflow (if discount > X%)
  - Customer credit hold checks
- 🔲 Approval notifications
- 🔲 Bulk approval interface

#### Production Runs
- ✅ Production run creation (existing)
- 🔲 Production approval workflow
  - Planned → Pending Approval → Approved → In Progress → Completed
  - Material availability checks
  - Capacity checks before approval
  - BOM validation
- 🔲 Production schedule approval
- 🔲 Change order approvals (for in-progress productions)

**Backend Implementation:**
- New `Approval` model with polymorphic relations
- Approval controller & service
- Approval notification system (email/in-app)
- Approval dashboard endpoint

**Frontend Implementation:**
- Approval pending badge/counter
- Approval action buttons (approve/reject)
- Approval history timeline
- Bulk approval page

**API Endpoints:**
```
POST   /api/approvals/:entityType/:entityId/request
POST   /api/approvals/:approvalId/approve
POST   /api/approvals/:approvalId/reject
GET    /api/approvals/pending
GET    /api/approvals/history/:entityType/:entityId
```

---

### 2. Status Locking

**Goal:** Make approved/completed records read-only.

#### Implementation
- 🔲 Status-based permission guards
  - Draft/Pending = editable by creator
  - Approved = read-only (except by Admin with unlock permission)
  - Completed = fully locked (except Admin)
  - Rejected = editable by creator (for resubmission)

- 🔲 Lock indicators in UI
  - 🔒 icon for locked records
  - Tooltip explaining why locked
  - "Unlock" button for authorized users

- 🔲 Unlock audit trail
  - Who unlocked
  - When unlocked
  - Reason for unlock
  - Auto-relock after edit

**Affected Entities:**
- Purchase Orders
- Sales Orders
- Production Runs
- Accounting Transactions (see period lock below)
- Stock Adjustments

**Backend Implementation:**
- Status validation middleware
- `canEdit()` method on entities
- Unlock permission (`unlock_approved_records`)
- Unlock audit log

**Frontend Implementation:**
- Disabled form fields when locked
- Lock status badge
- Unlock confirmation dialog
- Lock reason display

---

### 3. Accounting Period Lock

**Goal:** Prevent changes to closed accounting periods.

#### Features
- 🔲 Accounting period management
  - Define periods (monthly, quarterly, yearly)
  - Period status: Open, Pending Close, Closed
  - Close period workflow
  - Reopen permission (Admin only)

- 🔲 Period lock enforcement
  - No transactions in closed periods
  - No edits to transactions in closed periods
  - Warning before closing period
  - Period-end checklist

- 🔲 Period-end reports
  - Auto-generate reports on period close
  - Lock reports to period
  - Period comparison reports

**Backend Implementation:**
- New `AccountingPeriod` model
- Period validation on all accounting transactions
- Period close API
- Period-end report generation job

**Frontend Implementation:**
- Accounting periods page
- Period close wizard
- Period status dashboard
- Closed period warning badges

**API Endpoints:**
```
GET    /api/accounting/periods
POST   /api/accounting/periods
POST   /api/accounting/periods/:id/close
POST   /api/accounting/periods/:id/reopen
GET    /api/accounting/periods/:id/status
```

---

## 🥈 STEP 2 — TRUST SIGNALS (SECOND PRIORITY)

**Goal:** Make data traceable and professional.

### 4. Audit Logs

**Goal:** Track every change for accountability.

#### Features
- 🔲 Comprehensive audit trail
  - Who made the change (user ID, name, email)
  - What was changed (entity type, entity ID)
  - When it was changed (timestamp)
  - Old value → New value (JSON diff)
  - Action type (create, update, delete, approve, reject)
  - IP address & user agent
  - Tenant context

- 🔲 Audit log filtering & search
  - Filter by user
  - Filter by entity type
  - Filter by date range
  - Filter by action type
  - Search by entity ID

- 🔲 Audit log export
  - Export to CSV/Excel
  - Export to PDF
  - Compliance reports

- 🔲 Audit log retention policy
  - Configurable retention period
  - Archive old logs
  - Compliance with data regulations

**Backend Implementation:**
- New `AuditLog` model
- Audit interceptor/decorator
- Automatic logging on all entity changes
- Audit query service with filters
- Scheduled cleanup job

**Frontend Implementation:**
- System-wide audit log page
- Per-entity audit history
- Audit log timeline view
- Audit log export interface
- Audit dashboard (activity stats)

**API Endpoints:**
```
GET    /api/audit-logs
GET    /api/audit-logs/:entityType/:entityId
GET    /api/audit-logs/user/:userId
GET    /api/audit-logs/export
GET    /api/audit-logs/stats
```

**Logged Actions:**
- User login/logout
- Entity create/update/delete
- Approval/rejection
- Status changes
- Permission changes
- Settings changes
- Period close/reopen
- Record unlock

---

### 5. Professional PDFs

**Goal:** Generate professional, printable documents.

#### Features

##### Invoice PDF
- 🔲 Sales invoice generation
  - Company logo & details
  - Invoice number & date
  - Customer details
  - Itemized list (product, qty, rate, amount)
  - Subtotal, tax, discount, total
  - Payment terms
  - Bank details
  - Terms & conditions
  - Digital signature (optional)
  - QR code for payment (optional)

##### Purchase Order PDF
- 🔲 PO generation
  - Company details
  - PO number & date
  - Supplier details
  - Itemized list (product/material, qty, rate, amount)
  - Delivery address
  - Payment terms
  - Expected delivery date
  - Authorized signature
  - Terms & conditions

##### Delivery Challan PDF
- 🔲 Delivery note generation
  - Challan number & date
  - Order reference
  - Delivery address
  - Itemized list with quantities
  - Vehicle details (optional)
  - Driver details (optional)
  - Receiver signature field
  - Barcode for tracking

##### Additional PDFs
- 🔲 Production report PDF
- 🔲 Stock report PDF
- 🔲 Financial statements PDF (Trial Balance, P&L, Balance Sheet)
- 🔲 Payment receipt PDF

**Backend Implementation:**
- PDF generation library (e.g., Puppeteer, PDFKit, or jsPDF)
- PDF template engine
- PDF generation service
- PDF storage (local/S3)
- PDF email sending

**Frontend Implementation:**
- "Generate PDF" button on relevant pages
- PDF preview modal
- PDF download link
- Email PDF option
- Print PDF option

**API Endpoints:**
```
GET    /api/pdf/invoice/:saleId
GET    /api/pdf/purchase-order/:purchaseId
GET    /api/pdf/delivery-challan/:orderId
GET    /api/pdf/production-report/:productionId
POST   /api/pdf/email
```

**Template Customization:**
- 🔲 Tenant-specific templates
- 🔲 Custom header/footer
- 🔲 Custom fields
- 🔲 Multi-language support

---

## 🥉 STEP 3 — USER CONFIDENCE FEATURES (THIRD PRIORITY)

**Goal:** Make the system easy and safe to use.

### 6. Role-Based UI

**Goal:** Show only relevant features to each user role.

#### Features
- 🔲 Dynamic menu based on permissions
  - Hide menu items user cannot access
  - Show badges for pending approvals (if user can approve)
  - Contextual help based on role

- 🔲 Role-specific dashboards
  - Admin: system overview, approvals, audit logs
  - Manager: operations dashboard, pending tasks
  - Supervisor: team performance, daily tasks
  - User: personal tasks, data entry

- 🔲 Field-level permissions
  - Hide sensitive fields (cost price) from non-privileged users
  - Read-only fields based on role
  - Conditional field display

- 🔲 Action button visibility
  - Show "Approve" only to approvers
  - Show "Delete" only to admins
  - Show "Unlock" only to authorized users

**Frontend Implementation:**
- Permission-based route guards (existing ✅)
- Component-level permission checks
- Conditional rendering utilities
- Role-based layout components

**Example:**
```tsx
<PermissionGuard permission="delete_users">
  <DeleteButton />
</PermissionGuard>
```

---

### 7. Confirmation Dialogs & Soft Delete

**Goal:** Prevent accidental data loss.

#### Confirmation Dialogs
- 🔲 Confirm before delete
  - Show what will be deleted
  - Show impact (e.g., "This will delete 5 related transactions")
  - Require typing confirmation for critical actions

- 🔲 Confirm before approve/reject
  - Show summary of what's being approved
  - Optional comment field
  - Cannot undo warning

- 🔲 Confirm before status changes
  - "Mark as completed" confirmation
  - Impact warning (e.g., "This will lock the record")

- 🔲 Confirm before closing period
  - Checklist before close
  - Warning about irreversibility
  - Final confirmation

#### Soft Delete
- 🔲 Soft delete implementation
  - Add `deletedAt` timestamp to all entities
  - Filter out deleted records by default
  - "Restore" action for soft-deleted records
  - Hard delete permission (Admin only)
  - Auto-purge after X days (configurable)

- 🔲 Deleted items view
  - "Trash" or "Deleted Items" page
  - Filter by entity type
  - Bulk restore/permanent delete
  - Deleted by user & timestamp

**Backend Implementation:**
- Soft delete on all models (`deletedAt` field)
- Prisma soft delete middleware
- Restore endpoint for each entity
- Purge job for old deleted records

**Frontend Implementation:**
- Confirmation dialog component
- Soft delete trash page
- Restore button
- Permanent delete warning

**API Endpoints:**
```
DELETE /api/:entity/:id           (soft delete)
POST   /api/:entity/:id/restore   (restore)
DELETE /api/:entity/:id/permanent (hard delete - admin only)
GET    /api/trash                 (all deleted items)
```

---

### 8. Error Prevention

**Goal:** Stop errors before they happen.

#### Negative Stock Prevention
- 🔲 Real-time stock validation
  - Check available stock before allowing sale
  - Warning if stock will go below minimum
  - Block sale if insufficient stock (configurable)

- 🔲 Stock reservation
  - Reserve stock on order creation
  - Release on order cancellation
  - Auto-allocation based on FIFO/LIFO

- 🔲 Low stock warnings
  - Dashboard alert for low stock items ✅ (existing)
  - Email alert when stock < minimum
  - Auto-generate purchase suggestions

**Backend Implementation:**
- Stock validation middleware
- Transaction-based stock updates (atomic)
- Stock reservation table
- Real-time stock calculation endpoint

**Frontend Implementation:**
- Stock availability indicator on order form
- Real-time stock check on quantity change
- "Insufficient stock" error message
- Suggested alternatives (if stock unavailable)

---

#### Duplicate Invoice Prevention
- 🔲 Duplicate detection
  - Check for existing invoice with same:
    - Customer + Date + Amount
    - Order reference
    - Invoice number
  - Warning dialog if potential duplicate found
  - Option to proceed or cancel

- 🔲 Auto-increment invoice numbers
  - Prevent manual invoice number entry (optional)
  - Auto-generate based on format (e.g., INV-2025-001)
  - Gap detection in invoice sequence

**Backend Implementation:**
- Duplicate check service
- Auto-increment invoice number generator
- Unique constraint on invoice number
- Invoice sequence validation

**Frontend Implementation:**
- Duplicate warning dialog
- Invoice preview before saving
- Invoice number auto-fill
- Gap warning in invoice list

---

#### Additional Error Prevention
- 🔲 Date validation
  - Cannot enter future dates (where not allowed)
  - Cannot enter dates in closed periods
  - Delivery date must be after order date

- 🔲 Amount validation
  - Positive amounts only (where applicable)
  - Maximum amount limits
  - Discount cannot exceed 100%

- 🔲 Dependency checks
  - Cannot delete customer with active orders
  - Cannot delete product with stock
  - Cannot delete account with transactions

- 🔲 Form validation
  - Required fields highlighted
  - Format validation (email, phone, etc.)
  - Real-time validation feedback
  - Field-level error messages

**Frontend Implementation:**
- Comprehensive form validation
- Real-time validation feedback
- Field-level error display
- Pre-submit validation summary

---

## Implementation Timeline

### Phase 1: Control (Weeks 1-4)
- Week 1-2: Approval workflows (PO, Sales, Production)
- Week 3: Status locking
- Week 4: Accounting period lock

### Phase 2: Trust (Weeks 5-7)
- Week 5-6: Audit logging system
- Week 7: Professional PDF generation

### Phase 3: Confidence (Weeks 8-10)
- Week 8: Role-based UI enhancements
- Week 9: Confirmation dialogs & soft delete
- Week 10: Error prevention features

---

## Priority Summary

| Feature | Priority | Impact | Effort |
|---------|----------|--------|--------|
| Approval Workflows | 🥇 Critical | High | High |
| Status Locking | 🥇 Critical | High | Medium |
| Accounting Period Lock | 🥇 Critical | High | Medium |
| Audit Logs | 🥈 Important | High | High |
| Professional PDFs | 🥈 Important | Medium | Medium |
| Role-Based UI | 🥉 Nice to Have | Medium | Low |
| Confirmation Dialogs | 🥉 Nice to Have | Medium | Low |
| Soft Delete | 🥉 Nice to Have | Medium | Medium |
| Error Prevention | 🥉 Nice to Have | High | Medium |

---

## Database Changes Required

### New Models
```prisma
model Approval {
  id            String   @id @default(uuid())
  entityType    String   // 'PurchaseOrder', 'SaleOrder', 'Production'
  entityId      String
  requesterId   String
  approverId    String?
  status        String   // 'pending', 'approved', 'rejected'
  comments      String?
  requestedAt   DateTime @default(now())
  respondedAt   DateTime?
  tenantId      String
}

model AuditLog {
  id            String   @id @default(uuid())
  userId        String
  entityType    String
  entityId      String
  action        String   // 'create', 'update', 'delete', 'approve', etc.
  oldValue      Json?
  newValue      Json?
  ipAddress     String?
  userAgent     String?
  timestamp     DateTime @default(now())
  tenantId      String
}

model AccountingPeriod {
  id            String   @id @default(uuid())
  name          String   // 'January 2026'
  startDate     DateTime
  endDate       DateTime
  status        String   // 'open', 'pending_close', 'closed'
  closedBy      String?
  closedAt      DateTime?
  tenantId      String
}
```

### Model Updates
```prisma
// Add to all entities
deletedAt     DateTime?
deletedBy     String?

// Add to transactional entities
approvalStatus String?  // 'draft', 'pending', 'approved', 'rejected'
approvalId     String?
lockedAt       DateTime?
lockedBy       String?
```

---

## Configuration Settings

### Tenant-Level Settings
```json
{
  "approvals": {
    "purchaseOrderThreshold": 10000,
    "salesOrderThreshold": 5000,
    "requireProductionApproval": true,
    "multiLevelApprovals": true
  },
  "accounting": {
    "periodType": "monthly",
    "autoClosePeriod": false,
    "allowReopenPeriod": false
  },
  "stock": {
    "allowNegativeStock": false,
    "reserveStockOnOrder": true,
    "lowStockThreshold": 10
  },
  "audit": {
    "retentionDays": 365,
    "detailedLogging": true
  },
  "pdf": {
    "logo": "path/to/logo.png",
    "companyName": "Company Name",
    "companyAddress": "123 Main St",
    "template": "default"
  }
}
```

---

## Success Metrics

### Control Layer Success
- 95% of POs/Sales/Production go through approval
- 0 unauthorized edits to approved records
- 0 transactions in closed periods

### Trust Signal Success
- 100% of changes logged in audit trail
- 90% of invoices/POs sent as professional PDFs
- Audit log retention compliance

### User Confidence Success
- 50% reduction in user errors
- 80% reduction in accidental deletions
- 90% reduction in duplicate invoices
- 100% reduction in negative stock incidents

---

**Next Step:** Review and prioritize based on business needs, then begin Phase 1 implementation.
