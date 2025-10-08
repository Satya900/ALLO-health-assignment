const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Queue = require('../models/Queue');
require('dotenv').config();

const seedDemoData = async () => {
  try {
    console.log('🌱 Starting demo data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Queue.deleteMany({});

    // Create demo users
    console.log('👥 Creating demo users...');
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
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    // Create demo doctors
    console.log('👨‍⚕️ Creating demo doctors...');
    const demoDoctors = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        gender: 'Female',
        location: 'Room 101, Cardiology Wing',
        availableSlots: ['09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'],
        isActive: true,
      },
      {
        name: 'Dr. Emily Davis',
        email: 'emily.davis@clinic.com',
        phone: '+1-555-0102',
        specialization: 'Pediatrics',
        gender: 'Female',
        location: 'Room 201, Pediatrics Wing',
        availableSlots: ['10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00', '16:30'],
        isActive: true,
      },
      {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@clinic.com',
        phone: '+1-555-0103',
        specialization: 'General Medicine',
        gender: 'Male',
        location: 'Room 301, General Medicine Wing',
        availableSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30'],
        isActive: true,
      },
      {
        name: 'Dr. Lisa Wilson',
        email: 'lisa.wilson@clinic.com',
        phone: '+1-555-0104',
        specialization: 'Dermatology',
        gender: 'Female',
        location: 'Room 401, Dermatology Wing',
        availableSlots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        isActive: false,
      },
    ];

    const createdDoctors = [];
    for (const doctorData of demoDoctors) {
      const doctor = new Doctor(doctorData);
      await doctor.save();
      createdDoctors.push(doctor);
      console.log(`✅ Created doctor: ${doctorData.name} - ${doctorData.specialization}`);
    }

    // Create demo patients
    console.log('🏥 Creating demo patients...');
    const demoPatients = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-1001',
        age: 39,
        gender: 'Male',
        address: '123 Main St, City, State 12345',
        emergencyContact: 'Jane Smith - +1-555-1002 (Spouse)',
        medicalHistory: 'Hypertension, no known allergies'
      },
      {
        name: 'Mary Johnson',
        email: 'mary.johnson@email.com',
        phone: '+1-555-1003',
        age: 34,
        gender: 'Female',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: 'Robert Johnson - +1-555-1004 (Father)',
        medicalHistory: 'Diabetes Type 2, allergic to penicillin'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1-555-1005',
        age: 46,
        gender: 'Male',
        address: '789 Pine St, City, State 12345',
        emergencyContact: 'Sarah Wilson - +1-555-1006 (Wife)',
        medicalHistory: 'No significant medical history'
      },
      {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1-555-1007',
        age: 29,
        gender: 'Female',
        address: '321 Elm St, City, State 12345',
        emergencyContact: 'Tom Davis - +1-555-1008 (Brother)',
        medicalHistory: 'Asthma, allergic to shellfish'
      },
      {
        name: 'James Brown',
        email: 'james.brown@email.com',
        phone: '+1-555-1009',
        age: 42,
        gender: 'Male',
        address: '654 Maple Ave, City, State 12345',
        emergencyContact: 'Lisa Brown - +1-555-1010 (Sister)',
        medicalHistory: 'High cholesterol, family history of heart disease'
      },
    ];

    const createdPatients = [];
    for (const patientData of demoPatients) {
      const patient = new Patient(patientData);
      await patient.save();
      createdPatients.push(patient);
      console.log(`✅ Created patient: ${patientData.name}`);
    }

    // Create demo appointments
    console.log('📅 Creating demo appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const demoAppointments = [
      // Today's appointments
      {
        doctor: createdDoctors[0]._id,
        patient: createdPatients[0]._id,
        date: formatDate(today),
        time: '09:00',
        duration: 30,
        reason: 'Regular checkup',
        notes: 'Annual physical examination',
        status: 'Booked'
      },
      {
        doctor: createdDoctors[1]._id,
        patient: createdPatients[1]._id,
        date: formatDate(today),
        time: '10:30',
        duration: 45,
        reason: 'Child vaccination',
        notes: 'MMR vaccine due',
        status: 'Completed'
      },
      {
        doctor: createdDoctors[0]._id,
        patient: createdPatients[2]._id,
        date: formatDate(today),
        time: '14:00',
        duration: 30,
        reason: 'Follow-up consultation',
        notes: 'Blood pressure monitoring',
        status: 'Booked'
      },
      
      // Tomorrow's appointments
      {
        doctor: createdDoctors[2]._id,
        patient: createdPatients[3]._id,
        date: formatDate(tomorrow),
        time: '09:30',
        duration: 30,
        reason: 'General consultation',
        notes: 'Flu symptoms',
        status: 'Booked'
      },
      {
        doctor: createdDoctors[1]._id,
        patient: createdPatients[4]._id,
        date: formatDate(tomorrow),
        time: '11:00',
        duration: 30,
        reason: 'Skin rash examination',
        notes: 'Allergic reaction suspected',
        status: 'Booked'
      },
      
      // Day after tomorrow
      {
        doctor: createdDoctors[0]._id,
        patient: createdPatients[0]._id,
        date: formatDate(dayAfter),
        time: '15:30',
        duration: 60,
        reason: 'Cardiac stress test',
        notes: 'Follow-up from previous consultation',
        status: 'Booked'
      },
      
      // Some canceled appointments
      {
        doctor: createdDoctors[2]._id,
        patient: createdPatients[2]._id,
        date: formatDate(today),
        time: '16:00',
        duration: 30,
        reason: 'Routine checkup',
        notes: 'Patient canceled due to emergency',
        status: 'Canceled'
      },
    ];

    const createdAppointments = [];
    for (const appointmentData of demoAppointments) {
      const appointment = new Appointment(appointmentData);
      await appointment.save();
      createdAppointments.push(appointment);
      console.log(`✅ Created appointment: ${appointmentData.reason} - ${appointmentData.date} ${appointmentData.time}`);
    }

    // Create demo queue entries
    console.log('🚶 Creating demo queue entries...');
    const demoQueueEntries = [
      {
        patient: createdPatients[0]._id,
        doctor: createdDoctors[0]._id,
        appointment: createdAppointments[0]._id,
        status: 'Waiting',
        priority: 'Normal',
        notes: 'Regular checkup appointment',
        queueNumber: 1,
      },
      {
        patient: createdPatients[2]._id,
        doctor: createdDoctors[0]._id,
        appointment: createdAppointments[2]._id,
        status: 'Waiting',
        priority: 'Normal',
        notes: 'Follow-up consultation',
        queueNumber: 2,
      },
      {
        patient: createdPatients[3]._id,
        doctor: createdDoctors[2]._id,
        status: 'Waiting',
        priority: 'Urgent',
        notes: 'Walk-in patient with flu symptoms',
        queueNumber: 3,
      },
    ];

    for (const queueData of demoQueueEntries) {
      const queueEntry = new Queue(queueData);
      await queueEntry.save();
      console.log(`✅ Created queue entry: Patient ${queueData.queueNumber} - ${queueData.status}`);
    }

    console.log('🎉 Demo data seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@clinic.com / admin123');
    console.log('Front Desk: frontdesk@clinic.com / frontdesk123');
    console.log('\n📊 Demo Data Created:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`👨‍⚕️ Doctors: ${createdDoctors.length}`);
    console.log(`🏥 Patients: ${createdPatients.length}`);
    console.log(`📅 Appointments: ${createdAppointments.length}`);
    console.log(`🚶 Queue Entries: ${demoQueueEntries.length}`);

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedDemoData();