// Quick test script to check if backend is accessible
const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend health check passed:', healthData);
    } else {
      console.log('❌ Backend health check failed:', healthResponse.status);
    }
    
    // Test basic endpoint
    const rootResponse = await fetch('http://localhost:8000/');
    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      console.log('✅ Backend root endpoint accessible:', rootData);
    } else {
      console.log('❌ Backend root endpoint failed:', rootResponse.status);
    }
    
    // Test login endpoint with invalid data (should return 400, not 500)
    const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty body should return 400
    });
    
    const loginData = await loginResponse.json();
    console.log('🔐 Login endpoint test:', loginResponse.status, loginData);
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure the backend server is running on port 8000');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify environment variables are set');
    console.log('4. Check backend console for errors');
  }
};

// Run the test
testBackend();