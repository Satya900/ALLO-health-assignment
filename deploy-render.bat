@echo off
echo 🎨 Deploying ClinicDesk to Render...

REM Check if git repo is clean
git diff --quiet
if errorlevel 1 (
    echo ⚠️  You have uncommitted changes. Please commit them first.
    git status --short
    pause
    exit /b 1
)

REM Build the project locally to test
echo 🔨 Testing build locally...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed locally. Please fix errors before deploying.
    pause
    exit /b 1
)

echo ✅ Local build successful!

REM Push to GitHub (triggers Render deployment)
echo 📤 Pushing to GitHub...
git push origin main

echo 🎉 Deployment initiated!
echo.
echo 📋 Next Steps:
echo 1. Go to https://dashboard.render.com
echo 2. Check deployment status
echo 3. Set up MongoDB Atlas connection string
echo 4. Test your deployed application
echo.
echo 🔗 Your app will be available at:
echo    Frontend: https://clinicdesk-frontend.onrender.com
echo    Backend:  https://clinicdesk-backend.onrender.com
echo.
echo ⏱️  Deployment usually takes 5-10 minutes
pause