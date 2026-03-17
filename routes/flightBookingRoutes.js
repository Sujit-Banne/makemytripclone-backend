const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const FlightBooking = require('../models/FlightBooking');
const Flight = require('../models/Flight');

// Book flight (user)
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { flightId, passengers, seatClass, seats, specialRequests } = req.body;

    // Check if flight exists
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Check seat availability
    if (flight.seats[seatClass].available < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Calculate total price
    const totalPrice = flight.seats[seatClass].price * seats;

    const newBooking = new FlightBooking({
      user: req.user.id,
      flight: flightId,
      passengers,
      seatClass,
      seats,
      totalPrice,
      specialRequests,
    });

    // Update available seats
    flight.seats[seatClass].available -= seats;
    await flight.save();

    await newBooking.save();
    await newBooking.populate('flight user', 'name email flightNumber airline departure arrival');

    res.status(201).json({
      message: 'Flight booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get user's flight bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await FlightBooking.find({ user: req.user.id })
      .populate('flight', 'flightNumber airline departure arrival seats')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all flight bookings (admin)
router.get('/', adminAuth, async (req, res) => {
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

// Update booking status (admin)
router.put('/:id/status', adminAuth, async (req, res) => {
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

// Get booking by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await FlightBooking.findById(req.params.id)
      .populate('flight')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the booker or admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking (user)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await FlightBooking.findById(req.params.id).populate('flight');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }

    // Restore seats
    booking.flight.seats[booking.seatClass].available += booking.seats;
    await booking.flight.save();

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(400).json({ message: 'Error cancelling booking', error: error.message });
  }
});

module.exports = router;