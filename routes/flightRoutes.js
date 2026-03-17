const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Flight = require('../models/Flight');

// Get all flights
router.get('/', async (req, res) => {
  try {
    const { from, to, category } = req.query;
    const query = {};

    if (from) {
      query['departure.city'] = { $regex: from, $options: 'i' };
    }
    if (to) {
      query['arrival.city'] = { $regex: to, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const flights = await Flight.find(query).sort({ createdAt: -1 });
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new flight (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    await newFlight.save();
    res.status(201).json({ message: 'Flight created successfully', flight: newFlight });
  } catch (error) {
    res.status(400).json({ message: 'Error creating flight', error: error.message });
  }
});

// Update flight (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.status(200).json({ message: 'Flight updated successfully', flight });
  } catch (error) {
    res.status(400).json({ message: 'Error updating flight', error: error.message });
  }
});

// Delete flight (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flight', error: error.message });
  }
});

module.exports = router;
