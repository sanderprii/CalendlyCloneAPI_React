const express = require('express');
const router = express.Router();
const db = require('../db');

// Schedule an appointment
router.post('/', (req, res) => {
  const { eventId, userId, inviteeEmail, startTime, endTime } = req.body;

  if (!eventId || !userId || !inviteeEmail || !startTime || !endTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const id = Date.now().toString(); // Simple ID generation
  db.run(
    'INSERT INTO appointments (id, eventId, userId, inviteeEmail, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)',
    [id, eventId, userId, inviteeEmail, startTime, endTime],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id, eventId, userId, inviteeEmail, startTime, endTime });
    }
  );
});

module.exports = router; 