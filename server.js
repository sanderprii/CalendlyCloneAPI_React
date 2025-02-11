const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

// Add this after express.json() middleware
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    concurrentDB: true
  }),
  secret: 'your-secret-key', // Change this to a secure random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Import routes
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const scheduleRoutes = require('./routes/schedules');
const appointmentRoutes = require('./routes/appointments');
const sessionsRoutes = require('./routes/sessions');

// Load OpenAPI spec
const swaggerDocument = YAML.load('./calendly-clone-api.yaml');

// Routes
app.use('/users', auth, userRoutes);
app.use('/events', auth, eventRoutes);
app.use('/schedules', auth, scheduleRoutes);
app.use('/appointments', auth, appointmentRoutes);
app.use('/sessions', sessionsRoutes);

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database initialization
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    timezone TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    description TEXT,
    color TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    availability TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating schedules table:', err);
    } else {
      console.log('Schedules table created or already exists');
    }
  });

  // Add other table creations here...
});

// Log database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/docs`);
});

module.exports = app; 