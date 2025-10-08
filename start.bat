@echo off
setlocal enabledelayedexpansion

echo 🏥 Starting Clinic Front Desk System...

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm detected:
npm --version

:: Install backend dependencies
echo 📦 Installing Backend dependencies...
if exist "Backend" (
    cd Backend
    if not exist "node_modules" (
        npm install
        if errorlevel 1 (
            echo ❌ Failed to install backend dependencies
            pause
            exit /b 1
        )
        echo ✅ Backend dependencies installed
    ) else (
        echo ⚠️ Backend dependencies already installed
    )
    cd ..
) else (
    echo ❌ Backend directory not found
    pause
    exit /b 1
)

:: Install frontend dependencies
echo 📦 Installing Frontend dependencies...
if exist "Frontend" (
    cd Frontend
    if not exist "node_modules" (
        npm install
        if errorlevel 1 (
            echo ❌ Failed to install frontend dependencies
            pause
            exit /b 1
        )
        echo ✅ Frontend dependencies installed
    ) else (
        echo ⚠️ Frontend dependencies already installed
    )
    cd ..
) else (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

:: Check environment files
echo 🔧 Checking environment configuration...
if not exist "Backend\.env" (
    echo ⚠️ Backend .env file not found. Please create one based on .env.example
)

if not exist "Frontend\.env" (
    echo ⚠️ Frontend .env file not found. Creating default one...
    if exist "Frontend\.env.example" (
        copy "Frontend\.env.example" "Frontend\.env" >nul
    ) else (
        echo # Default environment file > "Frontend\.env"
    )
)

echo ✅ Environment check completed

:: Start the application
echo 🚀 Starting the application...

:: Start backend in new window
echo 🔧 Starting Backend server...
start "Backend Server" cmd /k "cd Backend && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in new window
echo 📱 Starting Frontend development server...
start "Frontend Server" cmd /k "cd Frontend && npm run dev"

echo ✅ 🎉 Clinic Front Desk System is starting up!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:8000
echo 💾 Health:   http://localhost:8000/health
echo.
echo Both servers are running in separate windows.
echo Close the command windows to stop the servers.
echo.
pause