# RBAC Quick Reference Card

## 🎯 What Each Role Sees

### Super Admin
```
✅ ALL MODULES - Full System Access
```

### Admin
```
✅ ALL MODULES (except Backup & Restore)
```

### Sales Manager
```
✅ Home, Dashboard, Sales, CRM, Orders, Inventory, Reports
❌ Procurement, Manufacturing, Accounting, etc.
```

### Purchase Manager
```
✅ Home, Dashboard, Procurement, Inventory, Store, Reports
❌ Sales, Manufacturing, Accounting, etc.
```

### Inventory Manager
```
✅ Home, Dashboard, Inventory, Store, Goods Receipt, Reports
❌ Sales, Procurement, Manufacturing, Accounting, etc.
```

### Production Manager
```
✅ Home, Dashboard, Manufacturing, MRP, Quality Control, Goods Receipt, Reports
❌ Sales, Procurement, Accounting, Inventory, etc.
```

### Accountant
```
✅ Home, Dashboard, Accounting, Accounting Periods, Reports
❌ Sales, Manufacturing, Inventory, etc.
```

### Finance Manager
```
✅ Home, Dashboard, Accounting, Accounting Periods, Budget Planning, Forecasting, Reports
❌ Sales, Manufacturing, Inventory, etc.
```

### HR Manager
```
✅ Home, Dashboard, Reports
❌ All operational modules
```

### Quality Manager
```
✅ Home, Dashboard, Quality Control, Manufacturing, Reports
❌ Sales, Procurement, Accounting, Inventory, etc.
```

### Store Manager
```
✅ Home, Dashboard, Store, Inventory, Goods Receipt, Reports
❌ Sales, Procurement, Manufacturing, Accounting, etc.
```

### Basic User
```
✅ Home, Dashboard
❌ All operational modules
```

---

## 🧪 Quick Test Steps

### For Each Role:
1. Logout
2. Login with role credentials
3. Check sidebar
4. Verify ONLY allowed modules visible
5. Verify restricted modules hidden

---

## 📊 Role Permissions Matrix

| Role | Sales | Procurement | Manufacturing | Accounting | Inventory | Reports |
|------|-------|-------------|----------------|-----------|-----------|---------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sales Manager | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Purchase Manager | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Inventory Manager | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Production Manager | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Accountant | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Finance Manager | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| HR Manager | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quality Manager | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Store Manager | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Basic User | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🔧 How RBAC Works

```
User Login
    ↓
Role stored in localStorage
    ↓
User navigates to dashboard
    ↓
AppSidebar loads
    ↓
filterMenuItemsByRole() called
    ↓
User role retrieved
    ↓
Menu items filtered
    ↓
Only allowed items displayed
```

---

## ✅ Verification Checklist

- [ ] Sales Manager sees only Sales modules
- [ ] Purchase Manager sees only Procurement modules
- [ ] Inventory Manager sees only Inventory modules
- [ ] Production Manager sees only Manufacturing modules
- [ ] Accountant sees only Accounting modules
- [ ] Finance Manager sees Accounting + Budget modules
- [ ] HR Manager sees only Dashboard + Reports
- [ ] Quality Manager sees Quality + Manufacturing modules
- [ ] Store Manager sees Store + Inventory modules
- [ ] Basic User sees only Home + Dashboard
- [ ] Super Admin sees all modules
- [ ] Admin sees all modules (except Backup)
- [ ] No console errors
- [ ] Sidebar renders correctly

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| All modules visible | Clear cache + localStorage + logout/login |
| Role not detected | Check localStorage for user data |
| Sidebar not updating | Refresh page (Ctrl+F5) |
| Console errors | Check DevTools Console tab |

---

## 📁 Files Involved

- `src/utils/rolePermissions.ts` - Role configuration
- `src/components/AppSidebar.tsx` - Menu filtering

---

## 🎯 Success = Each Role Sees Only Their Modules

**Status:** ✅ RBAC Fully Implemented for All Roles

---

**Last Updated:** April 17, 2026
