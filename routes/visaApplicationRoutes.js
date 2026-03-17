const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const VisaApplication = require('../models/VisaApplication');
const Visa = require('../models/Visa');

// Apply for visa (user)
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { visaId, applicationData, documents } = req.body;

    // Check if visa exists
    const visa = await Visa.findById(visaId);
    if (!visa) {
      return res.status(404).json({ message: 'Visa not found' });
    }

    // Check if user already has a pending application for this visa
    const existingApplication = await VisaApplication.findOne({
      user: req.user.id,
      visa: visaId,
      status: 'pending'
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You already have a pending application for this visa' });
    }

    const newApplication = new VisaApplication({
      user: req.user.id,
      visa: visaId,
      applicationData,
      documents: documents || [],
    });

    await newApplication.save();
    await newApplication.populate('visa user', 'name email country visaType');

    res.status(201).json({
      message: 'Visa application submitted successfully',
      application: newApplication
    });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting application', error: error.message });
  }
});

// Get user's visa applications
router.get('/my-applications', authMiddleware, async (req, res) => {
  try {
    const applications = await VisaApplication.find({ user: req.user.id })
      .populate('visa', 'country visaType processingTime fee')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all visa applications (admin)
router.get('/', adminAuth, async (req, res) => {
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

// Update application status (admin)
router.put('/:id/status', adminAuth, async (req, res) => {
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

// Get application by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await VisaApplication.findById(req.params.id)
      .populate('visa')
      .populate('user', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the applicant or admin
    if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;