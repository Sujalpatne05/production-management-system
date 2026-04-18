# Super Admin Login Guide

## Quick Start

### Login Credentials
```
Username: superadmin
Password: superadmin123
Email: superadmin@example.com
Role: super_admin
```

### Steps to Login

1. **Open Login Page**
   - Go to: `http://localhost:8081/login`
   - Or: `http://localhost:8081`

2. **Select Sign In Mode**
   - Click the "Sign In" tab (should be selected by default)

3. **Enter Credentials**
   - Username: `superadmin`
   - Password: `superadmin123`

4. **Click Sign In**
   - The system will verify your credentials
   - You will be automatically redirected to `/super-admin`

5. **Access Super Admin Dashboard**
   - You should now see the Super Admin Dashboard
   - URL: `http://localhost:8081/super-admin`

---

## Super Admin Dashboard Features

### Main Navigation Sections

1. **Dashboard**
   - Overview with analytics
   - Platform statistics
   - Quick actions

2. **Companies**
   - List all companies
   - Add new company
   - Edit company details
   - Delete company
   - View company statistics

3. **Admins**
   - List all company admins
   - Add new admin
   - Edit admin details
   - Remove admin

4. **Users**
   - View all users across companies
   - Filter by company
   - View user activity

5. **Billing**
   - Subscription plans
   - Company subscriptions
   - Invoices
   - Payments

6. **Settings**
   - Global configuration
   - Email settings
   - SMS settings

7. **Analytics**
   - Platform analytics
   - Revenue reports
   - User reports

8. **Audit Logs**
   - System logs
   - Admin activity
   - Company activity

9. **Support**
   - Support tickets
   - Knowledge base

10. **API Keys**
    - Manage API keys
    - Create new keys
    - Revoke keys

11. **Security**
    - Permissions
    - Roles
    - 2FA settings

---

## What You Can Do

### Company Management
- ✅ View all companies on the platform
- ✅ Create new company accounts
- ✅ Edit company information
- ✅ Delete companies
- ✅ View company statistics
- ✅ Manage company subscriptions

### Admin Management
- ✅ View all company admins
- ✅ Add new admins to companies
- ✅ Edit admin details
- ✅ Remove admins
- ✅ View admin activity logs

### User Management
- ✅ View all users across all companies
- ✅ Filter users by company
- ✅ View user activity
- ✅ Deactivate/activate users

### Billing & Subscriptions
- ✅ Manage subscription plans
- ✅ View company subscriptions
- ✅ Generate invoices
- ✅ Track payments

### System Settings
- ✅ Configure global settings
- ✅ Email settings
- ✅ SMS settings
- ✅ API key management

### Analytics & Reports
- ✅ View platform analytics
- ✅ Revenue reports
- ✅ User reports
- ✅ Performance metrics

### Audit & Logging
- ✅ View system audit logs
- ✅ Admin activity logs
- ✅ Company activity logs
- ✅ Error logs

---

## API Access

### Using Super Admin Token

1. **Get Token**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "superadmin",
       "password": "superadmin123"
     }'
   ```

2. **Response**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "user_id",
       "role": "super_admin",
       "name": "Super Administrator",
       "email": "superadmin@example.com",
       "username": "superadmin"
     }
   }
   ```

3. **Use Token in Requests**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/super-admin/companies
   ```

---

## API Endpoints Available

### Companies
```
GET    /api/super-admin/companies
GET    /api/super-admin/companies/:id
POST   /api/super-admin/companies
PUT    /api/super-admin/companies/:id
DELETE /api/super-admin/companies/:id
```

### Admins
```
GET    /api/super-admin/admins
POST   /api/super-admin/admins
PUT    /api/super-admin/admins/:id
DELETE /api/super-admin/admins/:id
```

### Subscriptions
```
GET    /api/super-admin/plans
POST   /api/super-admin/plans
GET    /api/super-admin/subscriptions
PUT    /api/super-admin/subscriptions/:id
```

### Analytics
```
GET /api/super-admin/analytics
GET /api/super-admin/companies/:id/stats
```

### Audit Logs
```
GET /api/super-admin/audit-logs
```

### Settings
```
GET /api/super-admin/settings
PUT /api/super-admin/settings/:key
```

### Support
```
GET /api/super-admin/tickets
PUT /api/super-admin/tickets/:id
```

### API Keys
```
GET    /api/super-admin/api-keys
POST   /api/super-admin/api-keys
DELETE /api/super-admin/api-keys/:id
```

---

## Example: Create a New Company

### Using Frontend
1. Login as super admin
2. Navigate to Companies
3. Click "Add Company"
4. Fill in company details:
   - Company Name
   - Email
   - Phone (optional)
   - Address (optional)
   - Website (optional)
   - Subscription Plan
5. Click "Create Company"

### Using API
```bash
curl -X POST http://localhost:5000/api/super-admin/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "email": "admin@acme.com",
    "phone": "+1-555-0123",
    "address": "123 Business St, City, State",
    "website": "https://acme.com",
    "subscriptionPlan": "professional"
  }'
```

---

## Troubleshooting

### Issue: Cannot Login
**Solution**:
- Verify username is `superadmin` (lowercase)
- Verify password is `superadmin123`
- Check if backend is running on port 5000
- Check browser console for errors

### Issue: Redirected to /dashboard instead of /super-admin
**Solution**:
- Clear browser cache and cookies
- Try logging out and logging back in
- Check if user role is set to `super_admin`

### Issue: Cannot access /super-admin
**Solution**:
- Verify you're logged in as super admin
- Check if JWT token is valid
- Check browser console for errors
- Try refreshing the page

### Issue: API endpoints returning 401
**Solution**:
- Verify JWT token is included in Authorization header
- Check if token is expired (tokens expire after 8 hours)
- Verify user has `super_admin` role
- Get a new token by logging in again

### Issue: Cannot create company
**Solution**:
- Verify all required fields are filled
- Check if email is unique
- Verify you have super_admin role
- Check browser console for error details

---

## Security Notes

⚠️ **Important**:
- Change the default password immediately in production
- Use strong passwords for all super admin accounts
- Enable 2FA when available
- Regularly review audit logs
- Limit super admin access to authorized personnel only
- Use HTTPS in production
- Keep JWT tokens secure
- Never share credentials

---

## Next Steps

### After Login
1. **Review Dashboard**
   - Check platform analytics
   - View company statistics

2. **Create Test Company**
   - Add a test company
   - Create admin for test company
   - Test company isolation

3. **Explore Features**
   - Create subscription plans
   - Manage admins
   - View audit logs
   - Test API endpoints

4. **Set Up Monitoring**
   - Configure email settings
   - Set up SMS settings
   - Configure API keys
   - Enable audit logging

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `backend/server-prisma.js`
3. Check browser console for errors
4. Review API response messages
5. Check documentation files

---

## Additional Resources

- `MULTI_TENANT_IMPLEMENTATION.md` - Complete implementation details
- `SUPER_ADMIN_SETUP_COMPLETE.md` - Setup guide
- `QUICK_REFERENCE.md` - Quick reference
- `FINAL_STATUS_REPORT.md` - Status report

---

**Last Updated**: April 11, 2026
**Status**: ✅ Ready for Use
