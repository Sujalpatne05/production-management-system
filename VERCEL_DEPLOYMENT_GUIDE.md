# Vercel Deployment Guide - Login Fix

## Problem
Login is not working on Vercel because the frontend is trying to reach `localhost:3000/api` which doesn't exist on the Vercel server.

## Solution: Set Environment Variables on Vercel

### Step 1: Deploy Your Backend
First, you need to deploy the NestJS backend to a publicly accessible URL. Options:

**A) Deploy to Render.com (FREE)**
```bash
cd server
# 1. Create account at https://render.com
# 2. Connect GitHub repo
# 3. Create New Web Service
# 4. Select your repo
# 5. Settings:
#    - Name: production-management-backend
#    - Environment: Node
#    - Build Command: npm install --legacy-peer-deps && npm run build
#    - Start Command: npm run start:prod
#    - Add Environment Variables from .env
# 6. Deploy
# 7. Copy the URL (e.g., https://production-management-backend.onrender.com)
```

**B) Deploy to Railway.app (FREE tier)**
```bash
# 1. Create account at https://railway.app
# 2. Connect GitHub
# 3. Create new project
# 4. Add PostgreSQL service
# 5. Add your repo
# 6. Set environment variables
# 7. Railway auto-deploys
```

**C) Deploy to AWS, Azure, DigitalOcean, etc.**

### Step 2: Update Vercel Environment Variables

Once you have your backend deployed, go to:
1. **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Add the following variables:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_BASE_URL=https://your-backend-url.com
VITE_WS_URL=wss://your-backend-url.com
```

**Example for Render deployment:**
```env
VITE_API_URL=https://production-management-backend.onrender.com/api
VITE_BASE_URL=https://production-management-backend.onrender.com
VITE_WS_URL=wss://production-management-backend.onrender.com
```

### Step 3: Redeploy on Vercel

After setting environment variables:
1. Go to **Vercel Dashboard** → **Deployments**
2. Click the three dots on the last deployment
3. Click **Redeploy**
4. Or push a new commit to trigger auto-redeploy

### Step 4: Test the Login

```bash
# On your Vercel deployed site:
# 1. Go to your Vercel app URL
# 2. Try logging in with:
#    Email: admin@demo.com
#    Password: 123456
# 3. Check browser console (F12 → Console tab) for any errors
```

## Troubleshooting Login Issues

### Check 1: Verify API URL
Open browser console (F12 → Console) and run:
```javascript
console.log(import.meta.env.VITE_API_URL);
// Should show: https://your-backend-url.com/api
```

### Check 2: Test API Connection
```javascript
fetch(import.meta.env.VITE_API_URL + '/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@demo.com', 
    password: '123456' 
  })
})
.then(r => r.json())
.then(d => console.log('Login response:', d))
.catch(e => console.error('Error:', e));
```

### Check 3: CORS Issues
If you see CORS error in console:
- Go to backend NestJS code
- Update `src/main.ts`:
```typescript
app.enableCors({
  origin: ['https://your-vercel-url.vercel.app', 'http://localhost:8081'],
  credentials: true,
});
```

### Check 4: Verify Backend is Running
```bash
curl https://your-backend-url.com/api/auth/health
# Should return 200 OK or similar
```

## Local Testing Before Vercel

Test locally first:
```bash
# Terminal 1: Backend
cd server
npm run start:dev
# Runs on http://localhost:3000

# Terminal 2: Frontend
cd production-management-system
npm run dev
# Runs on http://localhost:8081

# Should work with demo credentials:
# admin@demo.com / 123456
```

## Database Setup on Deployed Backend

Make sure your deployed backend has:
1. PostgreSQL database running
2. Migrations applied: `npm run prisma:migrate`
3. Database seeded: `npm run prisma:seed`
4. Environment variables set correctly

## Environment Variables Needed on Backend

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
NODE_ENV=production
```

## Quick Deployment Checklist

- [ ] Backend deployed to public URL
- [ ] PostgreSQL database configured on backend
- [ ] Backend environment variables set
- [ ] CORS enabled on backend for your Vercel domain
- [ ] Vercel environment variables updated
- [ ] Vercel redeployed
- [ ] Login tested on Vercel domain
- [ ] API calls working (check console)

## Support Commands

If backend won't start:
```bash
cd server
npm install --legacy-peer-deps
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run build
npm run start:prod
```

---

**Need Help?**
1. Check Vercel logs: Dashboard → Logs → Runtime logs
2. Check backend logs on deployment platform
3. Check browser console (F12) for errors
4. Verify network requests (F12 → Network tab)
