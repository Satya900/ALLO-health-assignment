#!/bin/bash

echo "🎨 Deploying ClinicDesk to Render..."

# Check if git repo is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    git status --short
    exit 1
fi

# Build the project locally to test
echo "🔨 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed locally. Please fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Push to GitHub (triggers Render deployment)
echo "📤 Pushing to GitHub..."
git push origin main

echo "🎉 Deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Check deployment status"
echo "3. Set up MongoDB Atlas connection string"
echo "4. Test your deployed application"
echo ""
echo "🔗 Your app will be available at:"
echo "   Frontend: https://clinicdesk-frontend.onrender.com"
echo "   Backend:  https://clinicdesk-backend.onrender.com"
echo ""
echo "⏱️  Deployment usually takes 5-10 minutes"