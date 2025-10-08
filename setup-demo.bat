@echo off
echo 🏥 Setting up Clinic Front Desk System Demo...

echo 📦 Installing dependencies...
cd Backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 🌱 Seeding demo data...
call npm run seed-demo
if errorlevel 1 (
    echo ❌ Failed to seed demo data
    pause
    exit /b 1
)

cd ..\Frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Setup completed!
echo.
echo 📋 Demo Credentials:
echo Admin: admin@clinic.com / admin123
echo Front Desk: frontdesk@clinic.com / frontdesk123
echo Doctor 1: sarah.johnson@clinic.com / doctor123
echo Doctor 2: emily.davis@clinic.com / doctor123
echo.
echo 🚀 Now run start.bat to launch the application
pause