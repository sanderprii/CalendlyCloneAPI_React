const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new event type
router.post('/', (req, res) => {
  const { name, duration, description, color } = req.body;

  if (!name || !duration) {
    return res.status(400).json({ error: 'Name and duration are required' });
  }

  const id = Date.now().toString(); // Simple ID generation
  db.run(
    'INSERT INTO events (id, name, duration, description, color) VALUES (?, ?, ?, ?, ?)',
    [id, name, duration, description, color],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id, name, duration, description, color });
    }
  );
});

router.get('/:eventId', (req, res) => {
  const { eventId } = req.params;

  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(row);
  });
});

module.exports = router; 