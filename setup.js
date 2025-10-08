#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏥 Setting up Clinic Front Desk System...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    return false;
  }
};

const checkPrerequisites = () => {
  log('🔍 Checking prerequisites...', 'blue');
  
  try {
    execSync('node --version', { stdio: 'pipe' });
    log('✅ Node.js is installed', 'green');
  } catch {
    log('❌ Node.js is not installed. Please install Node.js 18+', 'red');
    process.exit(1);
  }

  try {
    execSync('npm --version', { stdio: 'pipe' });
    log('✅ npm is installed', 'green');
  } catch {
    log('❌ npm is not installed', 'red');
    process.exit(1);
  }
};

const installDependencies = () => {
  log('\n📦 Installing dependencies...', 'blue');
  
  // Backend dependencies
  if (fs.existsSync('Backend')) {
    log('Installing backend dependencies...', 'yellow');
    if (!runCommand('npm install', 'Backend')) {
      log('❌ Failed to install backend dependencies', 'red');
      process.exit(1);
    }
    log('✅ Backend dependencies installed', 'green');
  }

  // Frontend dependencies
  if (fs.existsSync('Frontend')) {
    log('Installing frontend dependencies...', 'yellow');
    if (!runCommand('npm install', 'Frontend')) {
      log('❌ Failed to install frontend dependencies', 'red');
      process.exit(1);
    }
    log('✅ Frontend dependencies installed', 'green');
  }
};

const setupEnvironment = () => {
  log('\n🔧 Setting up environment...', 'blue');
  
  // Check backend .env
  if (!fs.existsSync('Backend/.env')) {
    log('⚠️ Backend .env file not found', 'yellow');
    log('Please create Backend/.env with your MongoDB connection string', 'yellow');
  } else {
    log('✅ Backend .env file exists', 'green');
  }

  // Check frontend .env
  if (!fs.existsSync('Frontend/.env')) {
    if (fs.existsSync('Frontend/.env.example')) {
      fs.copyFileSync('Frontend/.env.example', 'Frontend/.env');
      log('✅ Created Frontend/.env from example', 'green');
    } else {
      // Create basic .env
      const envContent = `VITE_API_URL=http://localhost:8000\nVITE_APP_NAME=Clinic Front Desk System`;
      fs.writeFileSync('Frontend/.env', envContent);
      log('✅ Created basic Frontend/.env', 'green');
    }
  } else {
    log('✅ Frontend .env file exists', 'green');
  }
};

const seedDatabase = async () => {
  log('\n🌱 Setting up demo users...', 'blue');
  
  if (fs.existsSync('Backend/scripts/seedUsers.js')) {
    log('Creating demo users in database...', 'yellow');
    if (runCommand('npm run seed', 'Backend')) {
      log('✅ Demo users created successfully', 'green');
    } else {
      log('⚠️ Failed to seed users. You may need to run this manually later.', 'yellow');
      log('Run: cd Backend && npm run seed', 'yellow');
    }
  }
};

const showInstructions = () => {
  log('\n🎉 Setup completed!', 'green');
  log('\n📋 Next steps:', 'blue');
  log('1. Make sure MongoDB is running', 'yellow');
  log('2. Start the backend: cd Backend && npm run dev', 'yellow');
  log('3. Start the frontend: cd Frontend && npm run dev', 'yellow');
  log('4. Or use the startup script: ./start.sh (Unix) or start.bat (Windows)', 'yellow');
  
  log('\n🔑 Demo Credentials:', 'blue');
  log('Admin: admin@clinic.com / admin123', 'green');
  log('Front Desk: frontdesk@clinic.com / frontdesk123', 'green');
  log('Doctor: sarah.johnson@clinic.com / doctor123', 'green');
  
  log('\n🌐 URLs:', 'blue');
  log('Frontend: http://localhost:5173', 'green');
  log('Backend: http://localhost:8000', 'green');
  log('Health Check: http://localhost:8000/health', 'green');
};

// Main setup function
const main = async () => {
  try {
    checkPrerequisites();
    installDependencies();
    setupEnvironment();
    await seedDatabase();
    showInstructions();
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Run setup
main();