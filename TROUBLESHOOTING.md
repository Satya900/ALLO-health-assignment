# Troubleshooting Guide

This guide helps resolve common issues when running the Clinic Front Desk System.

## 🚀 Quick Start Issues

### Node.js Version Issues

**Problem**: "Node.js version 18 or higher is required"
**Solution**:

```bash
# Check current version
node --version

# Install Node.js 18+ from https://nodejs.org
# Or use nvm (Node Version Manager)
nvm install 18
nvm use 18
```

### MongoDB Connection Issues

**Problem**: "MongoDB connection failed"
**Solutions**:

1. **Local MongoDB**:

   ```bash
   # Start MongoDB service
   # Windows:
   net start MongoDB

   # macOS:
   brew services start mongodb-community

   # Linux:
   sudo systemctl start mongod
   ```

2. **Docker MongoDB**:

   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   ```

3. **Check connection string in Backend/.env**:
   ```env
   MONGO_URI=mongodb://localhost:27017/clinic_system
   ```

### Port Already in Use

**Problem**: "Port 3000/5173/8000 is already in use"
**Solutions**:

1. **Kill existing processes**:

   ```bash
   # Find process using port
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows

   # Kill process
   kill -9 <PID>  # macOS/Linux
   taskkill /PID <PID> /F  # Windows
   ```

2. **Change ports in configuration**:
   - Frontend: Edit `vite.config.js` server port
   - Backend: Edit `PORT` in Backend/.env

## 🔧 Development Issues

### Frontend Build Errors

**Problem**: "Module not found" or import errors
**Solutions**:

1. **Clear node_modules and reinstall**:

   ```bash
   cd Frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Backend API Errors

**Problem**: "Cannot connect to backend API"
**Solutions**:

1. **Check backend is running**:

   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify CORS configuration**:

   - Check `cors` settings in Backend/index.js
   - Ensure frontend URL is allowed

3. **Check environment variables**:
   ```bash
   # Backend/.env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/clinic_system
   JWT_SECRET=your-secret-key
   ```

### Authentication Issues

**Problem**: "Login fails" or "Token invalid"
**Solutions**:

1. **Check JWT secret**:

   - Ensure `JWT_SECRET` is set in Backend/.env
   - Use a strong, unique secret

2. **Clear browser storage**:

   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

3. **Check user exists in database**:
   ```bash
   # Connect to MongoDB
   mongosh
   use clinic_system
   db.users.find()
   ```

## 🐳 Docker Issues

### Docker Build Failures

**Problem**: Docker build fails
**Solutions**:

1. **Check Docker is running**:

   ```bash
   docker --version
   docker ps
   ```

2. **Build with verbose output**:

   ```bash
   docker-compose build --no-cache --progress=plain
   ```

3. **Check Dockerfile syntax**:
   - Ensure all COPY paths are correct
   - Verify base image exists

### Container Startup Issues

**Problem**: Containers exit immediately
**Solutions**:

1. **Check logs**:

   ```bash
   docker-compose logs frontend
   docker-compose logs backend
   docker-compose logs mongo
   ```

2. **Verify environment variables**:

   ```bash
   docker-compose config
   ```

3. **Check health checks**:
   ```bash
   docker-compose ps
   ```

## 🔍 Database Issues

### MongoDB Connection Refused

**Problem**: "Connection refused" to MongoDB
**Solutions**:

1. **Check MongoDB is running**:

   ```bash
   # Local installation
   mongosh --eval "db.adminCommand('ping')"

   # Docker
   docker ps | grep mongo
   ```

2. **Verify connection string**:

   ```env
   # For local MongoDB
   MONGO_URI=mongodb://localhost:27017/clinic_system

   # For Docker MongoDB
   MONGO_URI=mongodb://mongo:27017/clinic_system
   ```

3. **Check firewall/network**:
   - Ensure port 27017 is open
   - Check network connectivity

### Database Schema Issues

**Problem**: "Collection not found" or schema errors
**Solutions**:

1. **Initialize database**:

   ```bash
   # Connect to MongoDB
   mongosh clinic_system

   # Create collections
   db.createCollection("users")
   db.createCollection("patients")
   db.createCollection("doctors")
   db.createCollection("appointments")
   db.createCollection("queues")
   ```

2. **Seed initial data**:
   ```bash
   cd Backend
   node scripts/seed.js  # If seed script exists
   ```

## 🌐 Network Issues

### CORS Errors

**Problem**: "CORS policy" errors in browser
**Solutions**:

1. **Update CORS configuration**:

   ```javascript
   // Backend/index.js
   app.use(
     cors({
       origin: ["http://localhost:5173", "http://localhost:3000"],
       credentials: true,
     })
   );
   ```

2. **Check request headers**:
   - Ensure Content-Type is set correctly
   - Verify authentication headers

### API Request Failures

**Problem**: "Network Error" or "Failed to fetch"
**Solutions**:

1. **Check API URL**:

   ```env
   # Frontend/.env
   VITE_API_URL=http://localhost:8000
   ```

2. **Verify backend routes**:

   ```bash
   curl -X GET http://localhost:8000/api/patients
   ```

3. **Check request format**:
   - Ensure JSON content-type
   - Verify request body structure

## 🔐 Security Issues

### JWT Token Problems

**Problem**: "Invalid token" or "Token expired"
**Solutions**:

1. **Check token expiration**:

   ```javascript
   // Decode JWT to check expiry
   const payload = JSON.parse(atob(token.split(".")[1]));
   console.log(new Date(payload.exp * 1000));
   ```

2. **Refresh token logic**:
   - Implement token refresh
   - Handle expired tokens gracefully

### Permission Denied

**Problem**: "Access denied" or "Insufficient permissions"
**Solutions**:

1. **Check user roles**:

   ```bash
   # In MongoDB
   db.users.find({}, {name: 1, role: 1})
   ```

2. **Verify route protection**:
   - Check middleware implementation
   - Ensure role-based access control

## 📱 Frontend Issues

### Styling Problems

**Problem**: "Styles not loading" or layout issues
**Solutions**:

1. **Check Tailwind CSS**:

   ```bash
   # Verify Tailwind is installed
   npm list tailwindcss

   # Rebuild styles
   npm run build
   ```

2. **Clear browser cache**:
   - Hard refresh (Ctrl+F5)
   - Clear browser cache
   - Disable browser extensions

### Component Errors

**Problem**: "Component not found" or render errors
**Solutions**:

1. **Check import paths**:

   ```javascript
   // Verify relative paths
   import Component from "./components/Component";
   ```

2. **Check component exports**:
   ```javascript
   // Ensure proper export
   export default Component;
   ```

## 🛠️ Performance Issues

### Slow Loading

**Problem**: Application loads slowly
**Solutions**:

1. **Enable production build**:

   ```bash
   cd Frontend
   npm run build
   npm run preview
   ```

2. **Check bundle size**:

   ```bash
   npm run analyze  # If configured
   ```

3. **Optimize images and assets**:
   - Compress images
   - Use appropriate formats (WebP, AVIF)

### Memory Issues

**Problem**: High memory usage or crashes
**Solutions**:

1. **Check for memory leaks**:

   - Use browser dev tools
   - Monitor component unmounting

2. **Optimize queries**:
   - Add database indexes
   - Limit query results
   - Use pagination

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the logs**:

   - Browser console (F12)
   - Backend server logs
   - Docker container logs

2. **Create an issue**:

   - Include error messages
   - Provide steps to reproduce
   - Share relevant configuration

3. **Common commands for debugging**:

   ```bash
   # Check system info
   node --version
   npm --version
   docker --version

   # Check running processes
   ps aux | grep node  # macOS/Linux
   tasklist | findstr node  # Windows

   # Check network connections
   netstat -tulpn | grep :8000  # Linux
   netstat -an | findstr :8000  # Windows
   ```

## 🔄 Reset Everything

If all else fails, complete reset:

```bash
# Stop all services
docker-compose down
pkill -f node  # Kill all Node processes

# Clean everything
rm -rf Frontend/node_modules Frontend/dist
rm -rf Backend/node_modules
docker system prune -a

# Reinstall
npm install  # In both Frontend and Backend
docker-compose build --no-cache

# Restart
./start.sh  # or start.bat on Windows
```

---

**Remember**: Always backup your data before making significant changes!
