# Delete Email from Database

## 🎯 Quick Fix

The email `sujalpatne583@gmail.com` is already in the database. Delete it with one command:

```bash
cd backend
npm run delete:user
```

## ✅ Expected Output

```
🔄 Deleting user with email: sujalpatne583@gmail.com
✅ Deleted 1 user(s) with email: sujalpatne583@gmail.com

📝 Remaining users in database:
  - superadmin@example.com (superadmin) - super_admin
  - admin@example.com (admin) - admin
  - user@example.com (user) - user

✅ Done!
```

## 🚀 Then Test Registration

After deleting the email:

1. **Restart backend** (if running):
   ```bash
   npm run dev:prisma
   ```

2. **Go to frontend**: `http://localhost:5173`

3. **Register with the same email**:
   - Full Name: `Pafne Sujal Jitendra`
   - Username: `sujalpatne`
   - Email: `sujalpatne583@gmail.com` ← Now it's deleted, so this will work!
   - Password: `password123`
   - Confirm: `password123`
   - Role: Admin

4. **Click Register** - Should succeed now! ✅

5. **Check backend logs for OTP code**

6. **Enter OTP to complete registration**

---

## 📝 What This Does

- Deletes the user with email `sujalpatne583@gmail.com`
- Shows remaining users in database
- Allows you to register with that email again

---

## 🔧 Available Commands

```bash
# Delete specific email
npm run delete:user

# Reset entire database (all users)
npm run reset:db

# Start backend
npm run dev:prisma

# Start frontend
npm run dev
```

---

**Ready? Run `npm run delete:user` now!** 🚀
