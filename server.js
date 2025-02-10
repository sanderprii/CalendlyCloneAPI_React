const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const app = express();
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const scheduleRoutes = require('./routes/schedules');
const appointmentRoutes = require('./routes/appointments');

// Load OpenAPI spec
const swaggerDocument = YAML.load('./calendly-clone-api.yaml');

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/appointments', appointmentRoutes);

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database initialization
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    timezone TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    description TEXT,
    color TEXT
  )`);

  // Add other table creations here...
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/docs`);
});

module.exports = app; 