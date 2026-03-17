require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin User';

if (!email || !password) {
  console.log('Usage: node create-admin.js <email> <password> [name]');
  process.exit(1);
}

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log('Password: (hidden)');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();