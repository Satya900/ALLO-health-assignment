const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('🧹 Cleared existing users');

    // Demo users to create
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@clinic.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Front Desk Staff',
        email: 'frontdesk@clinic.com',
        password: 'frontdesk123',
        role: 'frontdesk',
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@clinic.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'Cardiology',
      },
      {
        name: 'Dr. Emily Davis',
        email: 'emily.davis@clinic.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'Pediatrics',
      },
    ];

    // Create users
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️ User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      console.log(`✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
    }

    console.log('🎉 User seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@clinic.com / admin123');
    console.log('Front Desk: frontdesk@clinic.com / frontdesk123');
    console.log('Doctor 1: sarah.johnson@clinic.com / doctor123');
    console.log('Doctor 2: emily.davis@clinic.com / doctor123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedUsers();