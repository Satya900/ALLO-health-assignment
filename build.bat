@echo off
echo 🏗️  Building ClinicDesk for Production...

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd Frontend
call npm install

REM Build frontend
echo 🔨 Building frontend...
call npm run build

REM Go back to root
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd Backend
call npm install

echo ✅ Build completed successfully!
echo 🚀 Ready for deployment!