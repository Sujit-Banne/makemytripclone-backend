const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new destination
router.post('/', async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    await newDestination.save();
    res.status(201).json({
      message: 'Destination created successfully',
      destination: newDestination,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
