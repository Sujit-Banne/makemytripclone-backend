const express = require('express');
const router = express.Router();
const Visa = require('../models/Visa');

// Get all visas
router.get('/', async (req, res) => {
  try {
    const { category, country } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    const visas = await Visa.find(query).sort({ createdAt: -1 });
    res.status(200).json(visas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get visa by ID
router.get('/:id', async (req, res) => {
  try {
    const visa = await Visa.findById(req.params.id);
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }
    res.status(200).json(visa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
