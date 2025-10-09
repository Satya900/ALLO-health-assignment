#!/bin/bash

echo "🏗️  Building ClinicDesk for Production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd Frontend
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Go back to root
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd Backend
npm install

echo "✅ Build completed successfully!"
echo "🚀 Ready for deployment!"