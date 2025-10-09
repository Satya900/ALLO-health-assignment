# Vercel Deployment Guide for ClinicDesk Monorepo

## Overview
This guide covers deploying the ClinicDesk monorepo to Vercel, which includes both the React frontend and Node.js backend as serverless functions.

## Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- MongoDB Atlas database (for production)

## Project Structure
```
ClinicDesk/
├── Frontend/          # React + Vite frontend
├── Backend/           # Node.js + Express backend
├── vercel.json        # Vercel configuration
└── .vercelignore      # Files to ignore during deployment
```

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

### 2. Configure Environment Variables
In your Vercel dashboard, add these environment variables:

#### Backend Environment Variables
```
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-vercel-domain.vercel.app
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRES_IN=7d
```

#### Frontend Environment Variables (Auto-configured)
The frontend uses the production environment file automatically:
- `VITE_API_URL=/api` (routes to backend functions)
- Other variables from `Frontend/.env.production`

### 3. Database Setup
1. Create a MongoDB Atlas cluster
2. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)
3. Create a database user with read/write permissions
4. Get the connection string and add it to `MONGO_URI` in Vercel

### 4. Deploy
1. Push your code to the main branch
2. Vercel will automatically build and deploy
3. Frontend will be served from the root domain
4. Backend API will be available at `/api/*` endpoints

## Configuration Details

### vercel.json Configuration
- **Frontend**: Built as a static site using Vite
- **Backend**: Deployed as serverless functions
- **Routing**: API requests go to `/api/*`, everything else to frontend

### Build Process
1. Install dependencies for both Frontend and Backend
2. Build Frontend using `npm run build`
3. Deploy Backend as serverless functions
4. Serve Frontend from CDN

## API Endpoints
After deployment, your API will be available at:
- `https://your-domain.vercel.app/api/auth/login`
- `https://your-domain.vercel.app/api/patients`
- `https://your-domain.vercel.app/api/appointments`
- etc.

## Monitoring and Logs
- View deployment logs in Vercel dashboard
- Monitor function performance and errors
- Set up alerts for failed deployments

## Troubleshooting

### Common Issues
1. **Build Failures**: Check build logs in Vercel dashboard
2. **API Errors**: Verify environment variables are set correctly
3. **Database Connection**: Ensure MongoDB Atlas allows Vercel IPs
4. **CORS Issues**: Update `CORS_ORIGIN` to match your Vercel domain

### Debug Steps
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas network access

## Performance Optimization
- Frontend is automatically optimized by Vercel's CDN
- Backend functions have cold start optimization
- Static assets are cached globally
- Automatic compression and optimization

## Security Considerations
- Environment variables are encrypted
- HTTPS is enforced by default
- JWT secrets should be strong and unique
- Database credentials should use least privilege access

## Scaling
- Vercel automatically scales based on traffic
- Serverless functions scale to zero when not in use
- No server management required
- Pay only for actual usage

## Custom Domain (Optional)
1. Add your custom domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL certificates are automatically provisioned
4. Update `CORS_ORIGIN` environment variable

## Rollback
- Use Vercel dashboard to rollback to previous deployments
- Each deployment is immutable and can be restored
- Preview deployments for testing before production

## Support
- Vercel documentation: https://vercel.com/docs
- Community support: https://github.com/vercel/vercel/discussions
- Contact Vercel support for enterprise needs