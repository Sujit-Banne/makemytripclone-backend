const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const HotelBooking = require('../models/HotelBooking');
const Hotel = require('../models/Hotel');

// Book hotel (user)
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, guests, roomType, specialRequests } = req.body;

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Calculate total price (simplified - in real app, consider room type pricing)
    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price * nights * guests.adults;

    const newBooking = new HotelBooking({
      user: req.user.id,
      hotel: hotelId,
      checkInDate,
      checkOutDate,
      guests,
      roomType,
      totalPrice,
      specialRequests,
    });

    await newBooking.save();
    await newBooking.populate('hotel user', 'name email name location price');

    res.status(201).json({
      message: 'Hotel booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get user's hotel bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await HotelBooking.find({ user: req.user.id })
      .populate('hotel', 'name location price rating')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all hotel bookings (admin)
router.get('/', adminAuth, async (req, res) => {
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

// Update booking status (admin)
router.put('/:id/status', adminAuth, async (req, res) => {
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

// Get booking by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id)
      .populate('hotel')
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
    const booking = await HotelBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(400).json({ message: 'Error cancelling booking', error: error.message });
  }
});

module.exports = router;