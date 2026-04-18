# Backend Commands Reference

## 🎯 Most Important Commands

### Delete Specific Email
```bash
cd backend
npm run delete:user
```
Deletes the email `sujalpatne583@gmail.com` from database.

### Reset Entire Database
```bash
cd backend
npm run reset:db
```
Deletes all users and reseeds default users (superadmin, admin, user).

### Start Backend (Development)
```bash
cd backend
npm run dev:prisma
```
Starts backend with auto-reload on file changes.

---

## 📋 All Available Commands

### Development
```bash
npm run dev:prisma          # Start backend with watch mode
npm run start:prisma        # Start backend (no watch)
npm run start               # Start backend (default)
```

### Database Management
```bash
npm run delete:user         # Delete sujalpatne583@gmail.com
npm run reset:db            # Reset all users to defaults
npm run prisma:seed         # Seed database with initial data
npm run prisma:migrate      # Run migrations
npm run prisma:migrate:deploy  # Deploy migrations
npm run prisma:studio       # Open Prisma Studio (GUI)
npm run prisma:generate     # Generate Prisma client
```

### Build
```bash
npm run build               # Generate Prisma client
```

### Utilities
```bash
npm run kill-port           # Kill process on port 5000
npm run start:clean         # Kill port and start server
```

---

## 🚀 Common Workflows

### Workflow 1: Delete Email and Test Registration
```bash
cd backend
npm run delete:user         # Delete the email
npm run dev:prisma          # Start backend
# Then test registration in frontend
```

### Workflow 2: Reset Database and Start Fresh
```bash
cd backend
npm run reset:db            # Reset all users
npm run dev:prisma          # Start backend
# Then test with default credentials
```

### Workflow 3: Full Setup from Scratch
```bash
cd backend
npm install                 # Install dependencies
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Seed initial data
npm run dev:prisma          # Start backend
```

---

## 📝 Default Credentials (After Reset)

| Username | Password | Role |
|----------|----------|------|
| superadmin | password | Super Admin |
| admin | password | Admin |
| user | password | User |

---

## 🔍 Debugging

### Check Database Status
```bash
npm run prisma:studio      # Open Prisma Studio to view database
```

### View Logs
Backend logs appear in terminal where you ran `npm run dev:prisma`

### Common Issues

**Port 5000 already in use:**
```bash
npm run kill-port          # Kill process on port 5000
npm run dev:prisma         # Start backend again
```

**Database connection error:**
- Check `.env` file for correct DATABASE_URL
- Verify Neon PostgreSQL connection is active

**Prisma client not generated:**
```bash
npm run prisma:generate    # Regenerate Prisma client
```

---

## 📊 Script Details

### delete-user.js
- Deletes user with email `sujalpatne583@gmail.com`
- Shows remaining users
- Useful for testing registration

### reset-db.js
- Deletes all users
- Reseeds 3 default users
- Useful for starting fresh

### server-prisma.js
- Main backend server
- Uses Prisma ORM
- Connects to Neon PostgreSQL

---

## 🎯 Quick Reference

```bash
# Most used commands
npm run delete:user         # Delete specific email
npm run reset:db            # Reset database
npm run dev:prisma          # Start backend
npm run prisma:studio       # View database GUI
```

---

**Need help? Check FINAL_FIX.md for step-by-step instructions.**
