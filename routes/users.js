const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users with pagination
router.get('/', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const offset = (page - 1) * pageSize;

  db.all(
    'SELECT * FROM users LIMIT ? OFFSET ?',
    [pageSize, offset],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({
        data: rows,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: rows.length
        }
      });
    }
  );
});

// Get single user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

module.exports = router; 