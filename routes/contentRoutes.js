const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Get all content
router.get('/', async (req, res) => {
  try {
    const { category, featured, author } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (featured) {
      query.featured = featured === 'true';
    }
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    const contents = await Content.find(query).sort({ createdAt: -1 });
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured content
router.get('/featured', async (req, res) => {
  try {
    const featuredContent = await Content.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
    res.status(200).json(featuredContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const contentItem = await Content.findById(req.params.id);
    if (!contentItem) {
      return res.status(404).json({ message: 'Content not found' });
    }

    contentItem.reads = (contentItem.reads || 0) + 1;
    await contentItem.save();

    res.status(200).json(contentItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new content
router.post('/', async (req, res) => {
  try {
    const newContent = new Content({
      ...req.body,
      reads: 0,
      likes: 0,
      featured: req.body.featured || false,
    });
    await newContent.save();
    res.status(201).json({
      message: 'Content created successfully',
      content: newContent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update content (like)
router.put('/:id/like', async (req, res) => {
  try {
    const contentItem = await Content.findById(req.params.id);
    if (!contentItem) {
      return res.status(404).json({ message: 'Content not found' });
    }
    contentItem.likes = (contentItem.likes || 0) + 1;
    await contentItem.save();
    res.status(200).json({ message: 'Content liked', likes: contentItem.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
