# 🎨 Render Deployment Guide - ClinicDesk

Complete step-by-step guide to deploy ClinicDesk on Render.

## 🚀 Quick Deploy (Recommended)

### Option 1: One-Click Deploy with render.yaml

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Deploy**
   - Click "Apply" to deploy all services
   - Render will create:
     - Backend web service
     - Frontend static site
     - MongoDB database
     - All environment variables

4. **Access Your App**
   - Frontend: `https://clinicdesk-frontend.onrender.com`
   - Backend API: `https://clinicdesk-backend.onrender.com`

---

## 🔧 Manual Setup (Alternative)

### Step 1: Create Database

1. **Go to Render Dashboard**
2. **Click "New" → "PostgreSQL"** (or use external MongoDB)
3. **Configure Database**:
   - Name: `clinicdesk-db`
   - Database: `clinicdesk`
   - User: `clinicdesk_user`
   - Region: Oregon (or closest to you)
   - Plan: Starter (Free)

4. **Note Connection Details** (you'll need these)

### Step 2: Deploy Backend

1. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Select your repo

2. **Configure Backend**:
   ```
   Name: clinicdesk-backend
   Region: Oregon
   Branch: main
   Root Directory: Backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clinicdesk
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   CORS_ORIGIN=*
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Deploy Backend** - Click "Create Web Service"

### Step 3: Deploy Frontend

1. **Create Static Site**
   - Click "New" → "Static Site"
   - Connect same GitHub repository

2. **Configure Frontend**:
   ```
   Name: clinicdesk-frontend
   Branch: main
   Root Directory: Frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**:
   ```env
   VITE_API_URL=https://clinicdesk-backend.onrender.com
   VITE_APP_NAME=ClinicDesk
   VITE_APP_VERSION=1.0.0
   ```

4. **Deploy Frontend** - Click "Create Static Site"

---

## 🗄️ Database Options

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account** at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create Cluster** (Free M0 tier available)
3. **Create Database User**
4. **Whitelist IPs**: Add `0.0.0.0/0` for Render
5. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/clinicdesk
   ```

### Option 2: Render PostgreSQL + Mongoose

1. **Use Render PostgreSQL** (created in manual setup)
2. **Install pg adapter** in Backend:
   ```bash
   npm install pg mongoose-legacy-pluralize
   ```

---

## 🔐 Environment Variables Setup

### Backend Environment Variables

Set these in Render Backend service:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clinicdesk
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
CORS_ORIGIN=*
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d
```

### Frontend Environment Variables

Set these in Render Frontend service:

```env
VITE_API_URL=https://clinicdesk-backend.onrender.com
VITE_APP_NAME=ClinicDesk
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Healthcare clinic management system
VITE_ENABLE_ANALYTICS=true
VITE_SESSION_TIMEOUT=3600000
```

---

## 🚀 Post-Deployment Setup

### 1. Seed Demo Data

After successful deployment:

1. **Access Backend Service**
2. **Go to Shell** (in Render dashboard)
3. **Run Seed Command**:
   ```bash
   cd Backend
   npm run seed-demo
   ```

### 2. Test the Application

1. **Visit Frontend URL**: `https://clinicdesk-frontend.onrender.com`
2. **Test Login** with demo credentials:
   - Admin: `admin@clinic.com` / `admin123`
   - Front Desk: `frontdesk@clinic.com` / `frontdesk123`

### 3. Verify API Endpoints

Test these endpoints:
- Health Check: `https://clinicdesk-backend.onrender.com/health`
- Login: `https://clinicdesk-backend.onrender.com/api/auth/login`

---

## 🔧 Custom Domain (Optional)

### For Frontend (Static Site):

1. **Go to Frontend Service Settings**
2. **Click "Custom Domains"**
3. **Add Domain**: `yourdomain.com`
4. **Update DNS**:
   ```
   Type: CNAME
   Name: www (or @)
   Value: clinicdesk-frontend.onrender.com
   ```

### For Backend API:

1. **Go to Backend Service Settings**
2. **Add Custom Domain**: `api.yourdomain.com`
3. **Update Frontend Environment**:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

---

## 📊 Monitoring & Logs

### View Logs:
1. **Go to Service Dashboard**
2. **Click "Logs" tab**
3. **Monitor real-time logs**

### Health Monitoring:
- Render automatically monitors `/health` endpoint
- Set up alerts in service settings
- Monitor response times and uptime

---

## 🔄 Auto-Deploy Setup

### Enable Auto-Deploy:
1. **Go to Service Settings**
2. **Enable "Auto-Deploy"**
3. **Select Branch**: `main`
4. **Save Settings**

Now every push to `main` branch will trigger automatic deployment!

---

## 💰 Pricing & Scaling

### Free Tier Limits:
- **Static Sites**: Unlimited (with Render branding)
- **Web Services**: 750 hours/month
- **Databases**: 1GB storage, 1 million rows

### Paid Plans:
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: $85/month per service

---

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**:
   ```bash
   # Check build logs in Render dashboard
   # Ensure all dependencies are in package.json
   # Verify Node.js version compatibility
   ```

2. **Database Connection Issues**:
   ```bash
   # Verify MONGO_URI format
   # Check MongoDB Atlas network access
   # Ensure database user has proper permissions
   ```

3. **CORS Errors**:
   ```bash
   # Set CORS_ORIGIN to frontend URL
   # Or use "*" for development
   ```

4. **Environment Variables**:
   ```bash
   # Double-check all required variables are set
   # Verify no typos in variable names
   # Restart services after changing variables
   ```

### Debug Steps:

1. **Check Service Logs**
2. **Verify Environment Variables**
3. **Test API Endpoints Manually**
4. **Check Database Connection**
5. **Verify Build Commands**

---

## 📞 Support

### Render Support:
- [Render Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Support Email](mailto:support@render.com)

### Project Support:
- Check GitHub Issues
- Review deployment logs
- Test locally first

---

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] MongoDB Atlas cluster created (or Render PostgreSQL)
- [ ] Backend service deployed and running
- [ ] Frontend static site deployed
- [ ] Environment variables configured
- [ ] Database seeded with demo data
- [ ] Login functionality tested
- [ ] API endpoints responding
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy enabled
- [ ] Monitoring set up

---

**🎉 Congratulations! Your ClinicDesk is now live on Render!**

**Frontend**: https://clinicdesk-frontend.onrender.com
**Backend**: https://clinicdesk-backend.onrender.com

---

*Need help? Check the logs, verify environment variables, and ensure your database is accessible.*