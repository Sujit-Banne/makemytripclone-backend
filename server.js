require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const flightRoutes = require('./routes/flightRoutes');
const visaRoutes = require('./routes/visaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visaApplicationRoutes = require('./routes/visaApplicationRoutes');
const hotelBookingRoutes = require('./routes/hotelBookingRoutes');
const flightBookingRoutes = require('./routes/flightBookingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visa-applications', visaApplicationRoutes);
app.use('/api/hotel-bookings', hotelBookingRoutes);
app.use('/api/flight-bookings', flightBookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    mongoose.set('strictQuery', false);

    const connectWithUri = async (uri) => {
      await mongoose.connect(uri);
      console.log(`Connected to MongoDB: ${uri.startsWith('mongodb://127.0.0.1') ? 'local' : 'remote'}`);
    };

    if (process.env.MONGO_URI) {
      try {
        await connectWithUri(process.env.MONGO_URI);
      } catch (err) {
        console.warn('Could not connect to provided MongoDB URI, falling back to in-memory MongoDB.');
        const mongod = await MongoMemoryServer.create();
        await connectWithUri(mongod.getUri());
      }
    } else {
      const mongod = await MongoMemoryServer.create();
      await connectWithUri(mongod.getUri());
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
