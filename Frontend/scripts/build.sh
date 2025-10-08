#!/bin/bash

# Build script for production deployment
set -e

echo "🚀 Starting production build..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --silent

# Run type checking (if TypeScript is used)
if [ -f "tsconfig.json" ]; then
    echo "🔍 Running type checking..."
    npm run type-check || true
fi

# Run linting
echo "🔍 Running linting..."
npm run lint || true

# Run tests
echo "🧪 Running tests..."
npm run test:ci || true

# Build for production
echo "🏗️ Building for production..."
NODE_ENV=production npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - index.html not found"
    exit 1
fi

# Calculate build size
BUILD_SIZE=$(du -sh dist/ | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

# List generated files
echo "📁 Generated files:"
find dist/ -type f -name "*.js" -o -name "*.css" -o -name "*.html" | head -10

echo "✅ Production build completed successfully!"
echo "📂 Build output: ./dist/"
echo ""
echo "Next steps:"
echo "  1. Test the build: npm run preview"
echo "  2. Deploy to server: npm run deploy"
echo "  3. Or build Docker image: docker build -t clinic-frontend ."