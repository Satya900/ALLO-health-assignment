# 🏥 ClinicDesk - Front Desk Management System

A modern, full-stack clinic front desk management system built with React, Node.js, and MongoDB. Streamline patient management, appointment scheduling, and queue operations with real-time updates and intuitive design.

![ClinicDesk Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 📊 **Dashboard & Analytics**
- Real-time statistics and metrics
- Today's appointments overview
- Queue length monitoring
- Doctor availability tracking
- Interactive data visualization

### 👥 **Patient Management**
- Complete patient profiles with medical history
- Contact information and emergency contacts
- Search and filter capabilities
- Patient registration and updates
- Secure data handling

### 👨‍⚕️ **Doctor Management**
- Doctor profiles and specializations
- Availability and schedule management
- On Duty/Off Duty status tracking
- Contact information management
- Performance metrics

### 📅 **Appointment Scheduling**
- Intuitive appointment booking interface
- Calendar view with time slots
- Appointment status tracking (Booked/Completed/Canceled)
- Conflict detection and prevention
- Automated reminders (planned feature)

### 🚶 **Queue Management**
- Real-time patient queue tracking
- Priority-based queue ordering (Normal/Urgent)
- Status updates (Waiting/With Doctor/Completed)
- Wait time calculations
- Doctor-specific queue views

### 🔐 **Authentication & Security**
- Role-based access control (Admin/Front Desk)
- JWT-based authentication
- Secure API endpoints
- Protected routes and components

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **Redux Toolkit** - State management with RTK Query
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) or MongoDB Atlas account
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Satya900/ALLO-health-assignment.git
   cd ALLO-health-assignment
   ```

2. **Set up demo data (Recommended)**
   ```bash
   # Windows
   setup-demo.bat
   
   # Linux/Mac
   chmod +x setup-demo.sh && ./setup-demo.sh
   ```

### 🎨 Deploy to Render (Production)

**One-Click Deploy:**
1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your forked repository
5. Click "Apply" - Render will deploy everything automatically!

**Manual Deploy:**
```bash
# Windows
deploy-render.bat

# Linux/Mac
chmod +x deploy-render.sh && ./deploy-render.sh
```

**Live Demo**: [https://clinicdesk-frontend.onrender.com](https://clinicdesk-frontend.onrender.com)

3. **Manual setup (Alternative)**
   
   **Backend Setup:**
   ```bash
   cd Backend
   npm install
   
   # Create .env file with your MongoDB connection
   echo "PORT=8000" > .env
   echo "MONGO_URI=your_mongodb_connection_string" >> .env
   echo "JWT_SECRET=your_jwt_secret_key" >> .env
   
   # Seed demo data
   npm run seed-demo
   
   # Start backend server
   npm start
   ```
   
   **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | admin123 |
| Front Desk | frontdesk@clinic.com | frontdesk123 |

## 📁 Project Structure

```
ALLO-health-assignment/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Redux store and slices
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── Backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Database seeding scripts
│   └── package.json       # Backend dependencies
├── docker-compose.yml      # Docker configuration
├── setup-demo.bat         # Windows setup script
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/clinicdesk
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=ClinicDesk
```

## 🐳 Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - MongoDB: localhost:27017

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctor Endpoints
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointment Endpoints
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/complete` - Complete appointment

### Queue Endpoints
- `GET /api/queue` - Get current queue
- `POST /api/queue` - Add patient to queue
- `PUT /api/queue/:id/status` - Update queue status
- `DELETE /api/queue/:id` - Remove from queue

## 🧪 Testing

```bash
# Run frontend tests
cd Frontend
npm test

# Run backend tests
cd Backend
npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Production Build

1. **Build frontend**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export MONGO_URI=your_production_mongodb_uri
   ```

3. **Start production server**
   ```bash
   cd Backend
   npm start
   ```

### Deployment Platforms
- **Vercel/Netlify** - Frontend deployment
- **Heroku/Railway** - Backend deployment
- **MongoDB Atlas** - Database hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Satyabrata Mohapatra**
- GitHub: [@Satya900](https://github.com/Satya900)
- Email: satya@example.com

## 🙏 Acknowledgments

- Built for ALLO Health assignment
- Inspired by modern healthcare management systems
- Thanks to the open-source community for amazing tools and libraries

## 📞 Support

If you have any questions or need help with setup, please:
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Open an issue on GitHub
3. Contact the development team

---

**Made with ❤️ for better healthcare management**