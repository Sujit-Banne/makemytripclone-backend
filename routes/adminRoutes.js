const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const adminEvents = require('../utils/adminEvents');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');
const Visa = require('../models/Visa');
const User = require('../models/User');
const VisaApplication = require('../models/VisaApplication');
const HotelBooking = require('../models/HotelBooking');
const FlightBooking = require('../models/FlightBooking');

// Stream real-time admin updates (SSE)
router.get('/stream', async (req, res) => {
  // EventSource can't send custom headers, so accept token via query parameter.
  const token = req.query.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Set headers for Server-Sent Events
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send an initial ping so the client knows the connection is live
  sendEvent({ type: 'connected', timestamp: new Date().toISOString() });

  const onUpdate = (payload) => sendEvent({ type: 'update', payload });
  adminEvents.on('update', onUpdate);

  req.on('close', () => {
    adminEvents.off('update', onUpdate);
  });
});

// All routes require admin authentication
router.use(adminAuth);

// Get all hotels (admin view)
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new hotel
router.post('/hotels', async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
  } catch (error) {
    res.status(400).json({ message: 'Error creating hotel', error: error.message });
  }
});

// Update hotel
router.put('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel updated successfully', hotel });
  } catch (error) {
    res.status(400).json({ message: 'Error updating hotel', error: error.message });
  }
});

// Delete hotel
router.delete('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hotel', error: error.message });
  }
});

// Get all flights (admin view)
router.get('/flights', async (req, res) => {
  try {
    const flights = await Flight.find().sort({ createdAt: -1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new flight
router.post('/flights', async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    await newFlight.save();
    res.status(201).json({ message: 'Flight created successfully', flight: newFlight });
  } catch (error) {
    res.status(400).json({ message: 'Error creating flight', error: error.message });
  }
});

// Update flight
router.put('/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json({ message: 'Flight updated successfully', flight });
  } catch (error) {
    res.status(400).json({ message: 'Error updating flight', error: error.message });
  }
});

// Delete flight
router.delete('/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flight', error: error.message });
  }
});

// Get all visas (admin view)
router.get('/visas', async (req, res) => {
  try {
    const visas = await Visa.find().sort({ createdAt: -1 });
    res.json(visas);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new visa
router.post('/visas', async (req, res) => {
  try {
    const newVisa = new Visa(req.body);
    await newVisa.save();
    res.status(201).json({ message: 'Visa created successfully', visa: newVisa });
  } catch (error) {
    res.status(400).json({ message: 'Error creating visa', error: error.message });
  }
});

// Update visa
router.put('/visas/:id', async (req, res) => {
  try {
    const visa = await Visa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    res.json({ message: 'Visa updated successfully', visa });
  } catch (error) {
    res.status(400).json({ message: 'Error updating visa', error: error.message });
  }
});

// Delete visa
router.delete('/visas/:id', async (req, res) => {
  try {
    const visa = await Visa.findByIdAndDelete(req.params.id);
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    res.json({ message: 'Visa deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting visa', error: error.message });
  }
});

// Get all users (admin view)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user (admin view)
router.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user (admin view)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get all visa applications (admin)
router.get('/visa-applications', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const applications = await VisaApplication.find(query)
      .populate('visa', 'country visaType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update visa application status (admin)
router.put('/visa-applications/:id', async (req, res) => {
  try {
    const { status, adminComments } = req.body;

    const application = await VisaApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    if (adminComments) {
      application.adminComments = adminComments;
    }

    await application.save();
    await application.populate('visa user', 'name email country visaType');

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating application', error: error.message });
  }
});

// Get all hotel bookings (admin)
router.get('/hotel-bookings', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await HotelBooking.find(query)
      .populate('hotel', 'name location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update hotel booking status (admin)
router.put('/hotel-bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await HotelBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();
    await booking.populate('hotel user', 'name email name location');

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
});

// Get all flight bookings (admin)
router.get('/flight-bookings', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await FlightBooking.find(query)
      .populate('flight', 'flightNumber airline')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update flight booking status (admin)
router.put('/flight-bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await FlightBooking.findById(req.params.id).populate('flight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If cancelling, restore seats
    if (status === 'cancelled' && booking.status === 'confirmed') {
      booking.flight.seats[booking.seatClass].available += booking.seats;
      await booking.flight.save();
    }

    booking.status = status;
    await booking.save();
    await booking.populate('flight user', 'name email flightNumber airline');

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const hotelCount = await Hotel.countDocuments();
    const flightCount = await Flight.countDocuments();
    const visaCount = await Visa.countDocuments();
    const userCount = await User.countDocuments({ role: 'user' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    const pendingVisaApplications = await VisaApplication.countDocuments({ status: 'pending' });
    const pendingHotelBookings = await HotelBooking.countDocuments({ status: 'pending' });
    const pendingFlightBookings = await FlightBooking.countDocuments({ status: 'pending' });

    const totalHotelBookings = await HotelBooking.countDocuments();
    const totalFlightBookings = await FlightBooking.countDocuments();
    const totalVisaApplications = await VisaApplication.countDocuments();
    const totalBookings = totalHotelBookings + totalFlightBookings + totalVisaApplications;

    // Calculate revenue from confirmed/completed bookings
    const hotelRevenue = await HotelBooking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const flightRevenue = await FlightBooking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = (hotelRevenue[0]?.total || 0) + (flightRevenue[0]?.total || 0);

    res.json({
      hotels: hotelCount,
      flights: flightCount,
      visas: visaCount,
      users: userCount,
      admins: adminCount,
      pendingVisaApplications,
      pendingHotelBookings,
      pendingFlightBookings,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent activities for admin dashboard
router.get('/recent-activities', async (req, res) => {
  try {
    const activities = [];

    // Recent hotel bookings
    const recentHotelBookings = await HotelBooking.find()
      .populate('user', 'name')
      .populate('hotel', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    recentHotelBookings.forEach(booking => {
      activities.push({
        type: 'hotel_booking',
        message: `Hotel booking: ${booking.hotel.name} by ${booking.user.name}`,
        timestamp: booking.createdAt,
        status: booking.status
      });
    });

    // Recent flight bookings
    const recentFlightBookings = await FlightBooking.find()
      .populate('user', 'name')
      .populate('flight', 'flightNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    recentFlightBookings.forEach(booking => {
      activities.push({
        type: 'flight_booking',
        message: `Flight booking: ${booking.flight.flightNumber} by ${booking.user.name}`,
        timestamp: booking.createdAt,
        status: booking.status
      });
    });

    // Recent visa applications
    const recentVisaApplications = await VisaApplication.find()
      .populate('user', 'name')
      .populate('visa', 'country')
      .sort({ createdAt: -1 })
      .limit(5);

    recentVisaApplications.forEach(app => {
      activities.push({
        type: 'visa_application',
        message: `Visa application: ${app.visa.country} by ${app.user.name}`,
        timestamp: app.createdAt,
        status: app.status
      });
    });

    // Recent user registrations
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5);

    recentUsers.forEach(user => {
      activities.push({
        type: 'user_registration',
        message: `New user registration: ${user.name}`,
        timestamp: user.createdAt,
        status: 'new'
      });
    });

    // Sort all activities by timestamp descending and take top 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const topActivities = activities.slice(0, 10);

    res.json(topActivities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;