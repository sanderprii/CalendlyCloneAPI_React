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

// Update an appointment
router.put('/:appointmentId', (req, res) => {
  const { appointmentId } = req.params;
  const { eventId, userId, inviteeEmail, startTime, endTime } = req.body;

  if (!eventId || !userId || !inviteeEmail || !startTime || !endTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'UPDATE appointments SET eventId = ?, userId = ?, inviteeEmail = ?, startTime = ?, endTime = ? WHERE id = ?',
    [eventId, userId, inviteeEmail, startTime, endTime, appointmentId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json({ id: appointmentId, eventId, userId, inviteeEmail, startTime, endTime });
    }
  );
});

// Delete an appointment
router.delete('/:appointmentId', (req, res) => {
  const { appointmentId } = req.params;

  db.run('DELETE FROM appointments WHERE id = ?', [appointmentId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(204).send(); // No content
  });
});

module.exports = router; 