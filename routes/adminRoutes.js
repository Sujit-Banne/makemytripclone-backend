const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');
const Visa = require('../models/Visa');
const User = require('../models/User');
const VisaApplication = require('../models/VisaApplication');
const HotelBooking = require('../models/HotelBooking');
const FlightBooking = require('../models/FlightBooking');

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

    res.json({
      hotels: hotelCount,
      flights: flightCount,
      visas: visaCount,
      users: userCount,
      admins: adminCount,
      pendingVisaApplications,
      pendingHotelBookings,
      pendingFlightBookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;