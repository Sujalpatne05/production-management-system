# 🔐 Super Admin Credentials

## Login Information

```
┌─────────────────────────────────────────┐
│         SUPER ADMIN LOGIN               │
├─────────────────────────────────────────┤
│ Username:  superadmin                   │
│ Password:  superadmin123                │
│ Email:     superadmin@example.com       │
│ Role:      super_admin                  │
└─────────────────────────────────────────┘
```

## Quick Access

### Login URL
```
http://localhost:8081/login
```

### Super Admin Dashboard
```
http://localhost:8081/super-admin
```

### Backend API
```
http://localhost:5000/api/super-admin
```

---

## Step-by-Step Login

### 1️⃣ Open Login Page
```
Go to: http://localhost:8081/login
```

### 2️⃣ Enter Credentials
```
Username: superadmin
Password: superadmin123
```

### 3️⃣ Click Sign In
```
You will be redirected to /super-admin
```

### 4️⃣ Access Dashboard
```
You should see the Super Admin Dashboard
```

---

## What You Can Do

✅ Manage Companies
✅ Manage Admins
✅ Manage Users
✅ Manage Billing
✅ View Analytics
✅ View Audit Logs
✅ Manage Settings
✅ Manage API Keys
✅ Manage Support Tickets
✅ Manage Security

---

## API Access

### Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "superadmin123"
  }'
```

### Use Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/super-admin/companies
```

---

## Important Notes

⚠️ **Security**:
- Change password in production
- Use strong passwords
- Enable 2FA when available
- Keep tokens secure
- Review audit logs regularly

---

## Troubleshooting

### Cannot Login?
- Check username: `superadmin` (lowercase)
- Check password: `superadmin123`
- Verify backend is running
- Clear browser cache

### Redirected to /dashboard?
- Clear cookies
- Try logging out and back in
- Check user role is `super_admin`

### Cannot access /super-admin?
- Verify you're logged in
- Check JWT token is valid
- Refresh the page
- Check browser console

---

## Next Steps

1. ✅ Login to Super Admin Dashboard
2. ✅ Explore the dashboard
3. ✅ Create a test company
4. ✅ Create a test admin
5. ✅ Test company isolation
6. ✅ Review audit logs
7. ✅ Test API endpoints

---

**Status**: ✅ Ready to Use
**Last Updated**: April 11, 2026
