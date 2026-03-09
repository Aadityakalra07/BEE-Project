// =============================================
// SEED SCRIPT - Insert sample test data
// Run: node seed.js
// =============================================
// This script adds sample users to the database
// for testing purposes.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Interest = require('./models/Interest');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Interest.deleteMany({});
    console.log('Cleared old data');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@truematch.com',
      password,
      gender: 'Male',
      age: 30,
      role: 'admin',
      isApproved: true,
      isProfileComplete: true,
      religion: 'Hindu',
      city: 'Mumbai',
      profession: 'System Administrator',
      education: "Master's",
      bio: 'Platform administrator',
    });

    // Create Sample Users
    const users = await User.insertMany([
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password,
        gender: 'Female',
        age: 25,
        religion: 'Hindu',
        caste: 'Brahmin',
        profession: 'Software Engineer',
        education: "Bachelor's",
        city: 'Mumbai',
        bio: 'Love traveling and cooking. Looking for a kind and caring partner.',
        isApproved: true,
        isProfileComplete: true,
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        password,
        gender: 'Male',
        age: 28,
        religion: 'Hindu',
        caste: 'Vaishya',
        profession: 'Doctor',
        education: "Master's",
        city: 'Delhi',
        bio: 'MBBS, working at AIIMS. Family-oriented person.',
        isApproved: true,
        isProfileComplete: true,
      },
      {
        name: 'Ayesha Khan',
        email: 'ayesha@example.com',
        password,
        gender: 'Female',
        age: 24,
        religion: 'Muslim',
        caste: 'Syed',
        profession: 'Teacher',
        education: "Bachelor's",
        city: 'Hyderabad',
        bio: 'School teacher. Love reading and painting.',
        isApproved: true,
        isProfileComplete: true,
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password,
        gender: 'Male',
        age: 30,
        religion: 'Hindu',
        caste: 'Patel',
        profession: 'Business Owner',
        education: "Bachelor's",
        city: 'Ahmedabad',
        bio: 'Running a family business. Looking for a life partner.',
        isApproved: true,
        isProfileComplete: true,
      },
      {
        name: 'Sarah Thomas',
        email: 'sarah@example.com',
        password,
        gender: 'Female',
        age: 26,
        religion: 'Christian',
        caste: '',
        profession: 'Nurse',
        education: "Bachelor's",
        city: 'Bangalore',
        bio: 'Working at a hospital. Love music and nature.',
        isApproved: true,
        isProfileComplete: true,
      },
      {
        name: 'Gurpreet Singh',
        email: 'gurpreet@example.com',
        password,
        gender: 'Male',
        age: 27,
        religion: 'Sikh',
        caste: 'Jatt',
        profession: 'CA',
        education: "Master's",
        city: 'Chandigarh',
        bio: 'Chartered Accountant. Love sports and fitness.',
        isApproved: true,
        isProfileComplete: true,
      },
      {
        name: 'Neha Joshi',
        email: 'neha@example.com',
        password,
        gender: 'Female',
        age: 23,
        religion: 'Hindu',
        caste: 'Rajput',
        profession: 'Graphic Designer',
        education: "Bachelor's",
        city: 'Pune',
        bio: 'Creative professional. Looking for someone who values art.',
        isApproved: false,
        isProfileComplete: true,
      },
      {
        name: 'Mohammed Ali',
        email: 'ali@example.com',
        password,
        gender: 'Male',
        age: 29,
        religion: 'Muslim',
        caste: 'Pathan',
        profession: 'Lawyer',
        education: "Master's",
        city: 'Lucknow',
        bio: 'Practicing lawyer. Believes in justice and honesty.',
        isApproved: true,
        isProfileComplete: true,
      },
    ]);

    console.log(`Created ${users.length} sample users + 1 admin`);

    // Create sample interests
    await Interest.insertMany([
      { sender: users[1]._id, receiver: users[0]._id, status: 'pending' },
      { sender: users[3]._id, receiver: users[0]._id, status: 'accepted' },
      { sender: users[0]._id, receiver: users[5]._id, status: 'pending' },
    ]);

    console.log('Created sample interests');

    console.log('\n========================================');
    console.log('  SEED DATA INSERTED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nTest Login Credentials:');
    console.log('  Admin: admin@truematch.com / password123');
    console.log('  User:  priya@example.com / password123');
    console.log('  User:  rahul@example.com / password123');
    console.log('  (All users have password: password123)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedData();
