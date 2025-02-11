const db = require('../db');

const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE token = ?', [token], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = auth; 