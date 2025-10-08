# Clinic Front Desk System

A comprehensive healthcare clinic management system built with React, Redux Toolkit, and Node.js.

## 🏥 Features

- **Patient Management**: Complete patient registration, search, and medical records
- **Doctor Management**: Doctor profiles, specializations, and availability tracking
- **Appointment Booking**: Intelligent scheduling with conflict detection
- **Queue Management**: Real-time patient queue with priority handling
- **Admin Dashboard**: User management, system settings, and analytics
- **Role-based Access**: Secure authentication with role-based permissions
- **Responsive Design**: Mobile-friendly interface with accessibility features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 6.0+
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clinic-front-desk-system
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd Frontend
   npm install

   # Backend
   cd ../Backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Frontend
   cd Frontend
   cp .env.example .env
   # Edit .env with your configuration

   # Backend
   cd ../Backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0

   # Or use local MongoDB installation
   mongod
   ```

5. **Start the application**
   ```bash
   # Backend (Terminal 1)
   cd Backend
   npm run dev

   # Frontend (Terminal 2)
   cd Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📦 Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Deployment

1. **Build the frontend**
   ```bash
   cd Frontend
   npm run build:prod
   ```

2. **Deploy backend**
   ```bash
   cd Backend
   npm install --production
   npm start
   ```

3. **Serve frontend**
   ```bash
   # Using nginx, Apache, or any static file server
   # Point to Frontend/dist directory
   ```

### Option 3: Cloud Deployment

#### AWS S3 + CloudFront
```bash
cd Frontend
npm run build:prod
aws s3 sync dist/ s3://your-bucket-name
```

#### Netlify
```bash
cd Frontend
npm run build:prod
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
cd Frontend
vercel --prod
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Clinic Front Desk System
VITE_SESSION_TIMEOUT=3600000
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb://localhost:27017/clinic_system
JWT_SECRET=your-super-secret-jwt-key
```

### Build Optimization

The application includes several optimization features:

- **Code Splitting**: Automatic route-based and vendor code splitting
- **Tree Shaking**: Removes unused code from bundles
- **Compression**: Gzip compression for all assets
- **Caching**: Optimized cache headers for static assets
- **Minification**: JavaScript and CSS minification
- **Source Maps**: Optional source maps for debugging

## 🏗️ Architecture

### Frontend Stack
- **React 18**: UI framework with hooks and concurrent features
- **Redux Toolkit**: State management with RTK Query
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and development server

### Backend Stack
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### Key Features
- **Error Boundaries**: Graceful error handling
- **Loading States**: Comprehensive loading indicators
- **Form Validation**: Client and server-side validation
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized rendering and caching
- **Security**: XSS protection, CSRF tokens, secure headers

## 🧪 Testing

```bash
# Frontend tests
cd Frontend
npm run test

# Backend tests
cd Backend
npm run test

# E2E tests
npm run test:e2e
```

## 📊 Monitoring

### Health Checks
- Frontend: `GET /health`
- Backend: `GET /api/health`

### Metrics
- Application performance metrics
- Error tracking and logging
- User analytics (optional)

## 🔒 Security

### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Session management
- Password policies

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 🚀 Performance

### Frontend Optimizations
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

### Backend Optimizations
- Database indexing
- Query optimization
- Response compression
- Rate limiting

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

Built with ❤️ for healthcare professionals