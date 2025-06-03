const express = require('express');
const router = express.Router();
const School = require('../models/School');

// Add School
router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Please provide all required fields.' });
  }

  try {
    const newSchool = new School({ name, address, latitude, longitude });
    await newSchool.save();
    res.status(201).json({ message: 'School added successfully', school: newSchool });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// List Schools by proximity
router.get('/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLong = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLong)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude.' });
  }

  try {
    const schools = await School.find();

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = angle => (angle * Math.PI) / 180;
      const R = 6371; 

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const sortedSchools = schools
      .map(school => ({
        ...school.toObject(),
        distance: calculateDistance(userLat, userLong, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
