# 🚀 Deployment Guide - ClinicDesk

This guide covers deploying the ClinicDesk monorepo to various platforms.

## 📋 Prerequisites

1. **Database Setup**: Set up MongoDB Atlas (recommended for production)
2. **Environment Variables**: Prepare your production environment variables
3. **Domain**: Optional custom domain for your application

## 🌐 Deployment Platforms

### 1. 🚂 Railway (Recommended for Full-Stack)

Railway is perfect for monorepo deployments with automatic database provisioning.

#### Steps:

1. **Connect Repository**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Environment Variables**
   Set these in Railway dashboard:

   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your-secure-secret
   CORS_ORIGIN=https://your-app.railway.app
   ```

3. **Database**
   - Railway will auto-provision MongoDB
   - Or connect to MongoDB Atlas

#### Pros:

- ✅ Easy monorepo deployment
- ✅ Automatic database provisioning
- ✅ Built-in monitoring
- ✅ Custom domains

---

### 2. 🎨 Render

Great for full-stack applications with managed databases.

#### Steps:

1. **Connect Repository** to Render
2. **Use render.yaml** (already configured)
3. **Set Environment Variables** in Render dashboard
4. **Deploy** automatically on git push

#### Environment Variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secure-secret
```

#### Pros:

- ✅ Free tier available
- ✅ Managed PostgreSQL/MongoDB
- ✅ Auto-deploy on git push
- ✅ SSL certificates

---

### 3. ▲ Vercel (Frontend) + Railway/Render (Backend)

Best for high-performance frontend with separate backend.

#### Frontend (Vercel):

1. **Connect Repository** to Vercel
2. **Set Build Settings**:

   - Framework: Vite
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_APP_NAME=ClinicDesk
   ```

#### Backend (Railway/Render):

Deploy backend separately using Railway or Render instructions above.

#### Pros:

- ✅ Blazing fast frontend (CDN)
- ✅ Serverless functions
- ✅ Automatic scaling
- ✅ Perfect for React apps

---

### 4. 🌊 Netlify (Frontend Only)

For static frontend deployment with serverless functions.

#### Steps:

1. **Connect Repository** to Netlify
2. **Build Settings**:

   - Base directory: `Frontend`
   - Build command: `npm run build`
   - Publish directory: `Frontend/dist`

3. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-api.com
   ```

#### Note: You'll need separate backend hosting (Railway, Render, etc.)

---

### 5. 🐳 Docker + Any Cloud Provider

For containerized deployment on AWS, GCP, Azure, etc.

#### Steps:

1. **Build Docker Image**:

   ```bash
   docker-compose build
   docker-compose up
   ```

2. **Deploy to Cloud**:
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

## 🔧 Environment Variables Setup

### Production Environment Variables

#### Backend (.env):

```env
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clinicdesk
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env):

```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=ClinicDesk
VITE_APP_VERSION=1.0.0
```

## 📊 Database Setup (MongoDB Atlas)

1. **Create Cluster** at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create Database User**
3. **Whitelist IP Addresses** (0.0.0.0/0 for cloud deployment)
4. **Get Connection String**
5. **Seed Data** (optional):
   ```bash
   # After deployment, run seed command
   npm run seed
   ```

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] HTTPS enabled
- [ ] Rate limiting configured

## 🚀 Quick Deploy Commands

### Railway:

```bash
railway login
railway link
railway up
```

### Vercel:

```bash
npx vercel --prod
```

### Render:

```bash
# Push to main branch - auto-deploys
git push origin main
```

## 📈 Post-Deployment

1. **Test All Features**:

   - Login/Authentication
   - Patient Management
   - Appointment Booking
   - Queue Management

2. **Monitor Performance**:

   - Check response times
   - Monitor error rates
   - Verify database connections

3. **Set Up Monitoring**:
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**:

   - Check CORS_ORIGIN environment variable
   - Ensure frontend URL is whitelisted

2. **Database Connection**:

   - Verify MONGO_URI format
   - Check network access in MongoDB Atlas

3. **Build Failures**:

   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names

## 📞 Support

If you encounter issues:

1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally first
4. Open an issue on GitHub

---

**Happy Deploying! 🎉**
