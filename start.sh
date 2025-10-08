#!/bin/bash

# Clinic Front Desk System Startup Script
set -e

echo "🏥 Starting Clinic Front Desk System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "npm $(npm -v) detected"

# Function to install dependencies
install_dependencies() {
    local dir=$1
    local name=$2
    
    print_status "Installing $name dependencies..."
    cd "$dir"
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "$name dependencies installed"
    else
        print_warning "$name dependencies already installed"
    fi
    
    cd ..
}

# Install backend dependencies
if [ -d "Backend" ]; then
    install_dependencies "Backend" "Backend"
else
    print_error "Backend directory not found"
    exit 1
fi

# Install frontend dependencies
if [ -d "Frontend" ]; then
    install_dependencies "Frontend" "Frontend"
else
    print_error "Frontend directory not found"
    exit 1
fi

# Check if MongoDB is running (optional)
print_status "Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB is not running. Please start MongoDB or use Docker."
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB is not running. Please start MongoDB or use Docker."
    fi
else
    print_warning "MongoDB client not found. Make sure MongoDB is running."
fi

# Create environment files if they don't exist
print_status "Checking environment configuration..."

if [ ! -f "Backend/.env" ]; then
    print_warning "Backend .env file not found. Please create one based on .env.example"
fi

if [ ! -f "Frontend/.env" ]; then
    print_warning "Frontend .env file not found. Creating default one..."
    cp Frontend/.env.example Frontend/.env 2>/dev/null || echo "# Default environment file created" > Frontend/.env
fi

print_success "Environment check completed"

# Start the application
print_status "Starting the application..."

# Function to start services
start_backend() {
    print_status "Starting Backend server..."
    cd Backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    print_success "Backend started (PID: $BACKEND_PID)"
}

start_frontend() {
    print_status "Starting Frontend development server..."
    cd Frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend started (PID: $FRONTEND_PID)"
}

# Cleanup function
cleanup() {
    print_status "Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_success "Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Frontend stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
start_backend
sleep 3
start_frontend

print_success "🎉 Clinic Front Desk System is starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "💾 Health:   http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for services
wait