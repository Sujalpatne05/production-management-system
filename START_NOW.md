# START NOW - Delete Email and Test Registration

## 🎯 One Command to Fix Everything

```bash
cd backend
npm run delete:user
```

That's it! This will delete the email `sujalpatne583@gmail.com` from the database.

---

## ⏱️ Total Time: 10 minutes

- Delete email: 1 minute
- Restart backend: 1 minute
- Test registration: 5 minutes
- Verify OTP: 2 minutes
- Done! ✅

---

## 📋 What to Do

### 1️⃣ Delete Email (1 min)

```bash
cd backend
npm run delete:user
```

You'll see:
```
✅ Deleted 1 user(s) with email: sujalpatne583@gmail.com
```

### 2️⃣ Restart Backend (1 min)

```bash
npm run dev:prisma
```

You'll see:
```
Server running on http://localhost:5000
```

### 3️⃣ Test Registration (5 min)

1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill in:
   - Full Name: `Pafne Sujal Jitendra`
   - Username: `sujalpatne`
   - Email: `sujalpatne583@gmail.com`
   - Password: `password123`
   - Confirm: `password123`
   - Role: Admin
4. Click "Register"
5. See "Registration Successful!" ✅

### 4️⃣ Verify OTP (2 min)

1. Check backend terminal for OTP code
2. Enter it on frontend
3. Click "Verify OTP"
4. Done! ✅

---

## ✅ Quick Checklist

- [ ] Ran `npm run delete:user`
- [ ] Backend restarted
- [ ] Registered with sujalpatne583@gmail.com
- [ ] OTP verified
- [ ] Logged in successfully

---

## 🚀 Commands

```bash
# Delete email
npm run delete:user

# Start backend
npm run dev:prisma

# Start frontend (new terminal)
npm run dev

# Access
http://localhost:5173
```

---

## 📚 Need More Details?

- `COMPLETE_SOLUTION.md` - Full guide
- `FINAL_FIX.md` - Step-by-step
- `BACKEND_COMMANDS.md` - All commands

---

## 🎉 Ready?

**Start with:** `cd backend && npm run delete:user`

Then follow the 4 steps above!

---

**Status:** ✅ Ready to Test - Start Now!
