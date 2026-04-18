# Production Deployment Guide

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - RECOMMENDED
### Option 2: Docker + AWS/DigitalOcean
### Option 3: Traditional VPS

---

## OPTION 1: VERCEL + RENDER (EASIEST)

### Step 1: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./`

4. **Set Environment Variables**
   - VITE_API_URL: `https://your-backend.onrender.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend URL: `https://your-app.vercel.app`

### Step 2: Deploy Backend to Render

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo

3. **Configure Service**
   - Name: `production-management-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm run start:prisma`
   - Root Directory: `./`

4. **Set Environment Variables**
   ```
   PORT=5001
   JWT_SECRET=your-secret-key-here
   DATABASE_URL=your-postgresql-url
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Your backend URL: `https://your-backend.onrender.com`

### Step 3: Update Frontend API URL

1. Update `.env.production`:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

2. Redeploy frontend on Vercel

---

## OPTION 2: DOCKER + AWS/DIGITALOCEAN

### Step 1: Create Docker Files

**Dockerfile (Frontend)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8081
CMD ["npm", "run", "preview"]
```

**Dockerfile (Backend)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend . .
EXPOSE 5001
CMD ["npm", "run", "start:prisma"]
```

### Step 2: Deploy to DigitalOcean App Platform

1. Create DigitalOcean Account
2. Create App
3. Connect GitHub repo
4. Configure services:
   - Frontend service
   - Backend service
5. Set environment variables
6. Deploy

---

## OPTION 3: TRADITIONAL VPS (AWS EC2 / DigitalOcean Droplet)

### Step 1: Setup VPS

1. Create Ubuntu 22.04 server
2. SSH into server
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Install PostgreSQL:
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   ```

5. Install Nginx:
   ```bash
   sudo apt-get install nginx
   ```

### Step 2: Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/your-repo.git
cd production-management-system
```

### Step 3: Setup Backend

```bash
cd backend
npm install
npx prisma migrate deploy
npm run seed
```

### Step 4: Setup Frontend

```bash
cd ../
npm install
npm run build
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/erp`:

```nginx
upstream backend {
    server localhost:5001;
}

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/production-management-system/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Step 7: Start Services

**Backend (using PM2)**
```bash
sudo npm install -g pm2
cd /var/www/production-management-system/backend
pm2 start "npm run start:prisma" --name "erp-backend"
pm2 startup
pm2 save
```

---

## PRODUCTION CHECKLIST

### Security
- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Setup firewall rules
- [ ] Enable 2FA for admin accounts
- [ ] Regular backups enabled

### Performance
- [ ] Enable caching headers
- [ ] Setup CDN for static files
- [ ] Database indexes created
- [ ] Query optimization done
- [ ] Monitoring setup

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alert setup

### Database
- [ ] PostgreSQL backup strategy
- [ ] Connection pooling configured
- [ ] Migrations tested
- [ ] Data validation rules

### Deployment
- [ ] CI/CD pipeline setup
- [ ] Automated tests passing
- [ ] Build process verified
- [ ] Rollback plan ready

---

## ENVIRONMENT VARIABLES

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=IProduction
```

### Backend (.env.production)
```
PORT=5001
NODE_ENV=production
JWT_SECRET=your-very-secure-secret-key-here
DATABASE_URL=postgresql://user:password@host:5432/dbname
CORS_ORIGIN=https://your-frontend-url.com
```

---

## DEPLOYMENT COMMANDS

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Render
```bash
# Push to GitHub, Render auto-deploys
git push origin main
```

### Docker
```bash
docker build -t erp-frontend .
docker build -t erp-backend ./backend
docker run -p 8081:8081 erp-frontend
docker run -p 5001:5001 erp-backend
```

---

## POST-DEPLOYMENT

1. **Test All Modules**
   - Login with admin account
   - Test each module
   - Verify data persistence

2. **Monitor Performance**
   - Check response times
   - Monitor CPU/Memory
   - Check error logs

3. **Backup Database**
   - Setup automated backups
   - Test restore process
   - Document backup location

4. **Setup Monitoring**
   - Error tracking
   - Performance monitoring
   - Uptime monitoring

5. **Create Admin Users**
   - Create production admin account
   - Setup backup admin
   - Document credentials securely

---

## TROUBLESHOOTING

### Frontend not loading
- Check VITE_API_URL is correct
- Check CORS settings
- Clear browser cache

### Backend not responding
- Check database connection
- Check environment variables
- Check firewall rules
- Check logs

### Database connection failed
- Verify DATABASE_URL
- Check PostgreSQL is running
- Check network connectivity
- Verify credentials

### SSL certificate issues
- Renew certificate: `sudo certbot renew`
- Check certificate expiry
- Update Nginx config

---

## SUPPORT

For issues:
1. Check logs: `pm2 logs`
2. Check Nginx: `sudo nginx -t`
3. Check database: `psql -U user -d dbname`
4. Check firewall: `sudo ufw status`

---

**Deployment Status:** Ready for Production ✅
