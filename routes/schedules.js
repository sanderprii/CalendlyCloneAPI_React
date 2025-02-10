const express = require('express');
const router = express.Router();
const db = require('../db');

// Get user's schedule
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  db.get('SELECT * FROM schedules WHERE userId = ?', [userId], (err, row) => {
    if (err) {
      console.error('Database error:', err); // Log the error for debugging
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    try {
      // Parse availability from JSON string
      row.availability = JSON.parse(row.availability);
      res.json(row);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(500).json({ error: 'Failed to parse availability data' });
    }
  });
});

// Add this to routes/schedules.js
router.post('/', (req, res) => {
  const { userId, availability } = req.body;

  if (!userId || !availability) {
    return res.status(400).json({ error: 'userId and availability are required' });
  }

  const availabilityJson = JSON.stringify(availability);
  db.run(
    'INSERT INTO schedules (userId, availability) VALUES (?, ?)',
    [userId, availabilityJson],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ userId, availability });
    }
  );
});

module.exports = router; 