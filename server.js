const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const auth = require('./middleware/auth');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000' // lubab ainult päringuid sellest päritolust
}));


app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const scheduleRoutes = require('./routes/schedules');
const appointmentRoutes = require('./routes/appointments');
const sessionsRoutes = require('./routes/sessions');

// Load OpenAPI spec
const swaggerDocument = YAML.load('./calendly-clone-api.yaml');

// Routes
app.use('/users', userRoutes);
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
    timezone TEXT,
    token TEXT
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    userId TEXT NOT NULL,
    inviteeEmail TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    FOREIGN KEY (eventId) REFERENCES events(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/docs`);
});

module.exports = app; 