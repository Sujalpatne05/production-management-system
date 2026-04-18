# Quick Deployment - 5 Minutes

## FASTEST WAY: Vercel + Render

### Frontend Deployment (Vercel) - 2 minutes

1. Go to: https://vercel.com/new
2. Click "Continue with GitHub"
3. Select your repository
4. Click "Import"
5. Set Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (we'll get this next)
6. Click "Deploy"
7. Wait for deployment
8. **Your Frontend URL:** `https://your-app.vercel.app`

### Backend Deployment (Render) - 3 minutes

1. Go to: https://render.com/dashboard
2. Click "New +"
3. Select "Web Service"
4. Click "Connect account" (GitHub)
5. Select your repository
6. Fill in:
   - **Name:** `production-management-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm run start:prisma`
   - **Root Directory:** `./`

7. Click "Advanced" and add Environment Variables:
   ```
   PORT=5001
   NODE_ENV=production
   JWT_SECRET=your-secret-key-12345
   DATABASE_URL=postgresql://user:password@host/dbname
   CORS_ORIGIN=https://your-app.vercel.app
   ```

8. Click "Create Web Service"
9. Wait for deployment
10. **Your Backend URL:** `https://your-backend.onrender.com`

### Update Frontend with Backend URL

1. Go back to Vercel
2. Go to Settings → Environment Variables
3. Update `VITE_API_URL` to your Render backend URL
4. Redeploy frontend

---

## DATABASE SETUP

### Option A: Use Render PostgreSQL (Easiest)

1. In Render dashboard
2. Click "New +"
3. Select "PostgreSQL"
4. Fill in:
   - **Name:** `production-management-db`
   - **Database:** `erp_db`
   - **User:** `erp_user`
5. Click "Create Database"
6. Copy the connection string
7. Use as `DATABASE_URL` in backend

### Option B: Use Neon (Free PostgreSQL)

1. Go to: https://neon.tech
2. Sign up
3. Create project
4. Copy connection string
5. Use as `DATABASE_URL` in backend

---

## VERIFY DEPLOYMENT

### Test Frontend
1. Go to: `https://your-app.vercel.app`
2. Login with: `admin@example.com` / `password`
3. Check if modules load

### Test Backend
1. Open browser console
2. Check Network tab
3. Verify API calls to backend
4. Check for CORS errors

### Test Database
1. Login to admin panel
2. Add a product
3. Verify it saves
4. Refresh page
5. Verify data persists

---

## PRODUCTION URLS

After deployment, you'll have:

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-backend.onrender.com`
**Database:** PostgreSQL on Render/Neon

---

## NEXT STEPS

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ✅ Setup PostgreSQL database
4. ✅ Test all modules
5. ✅ Create production admin account
6. ✅ Setup monitoring
7. ✅ Configure backups
8. ✅ Go live!

---

## TROUBLESHOOTING

**Frontend shows blank page:**
- Check browser console for errors
- Verify VITE_API_URL is correct
- Clear cache and reload

**Backend API not responding:**
- Check Render logs
- Verify DATABASE_URL
- Check environment variables

**Login not working:**
- Check database connection
- Verify JWT_SECRET
- Check CORS settings

**Data not saving:**
- Check database connection
- Verify Prisma migrations ran
- Check backend logs

---

## SUPPORT LINKS

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Status:** Ready to Deploy ✅
**Time to Deploy:** ~5 minutes
**Cost:** Free tier available
