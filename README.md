# Calendly Clone API

A RESTful API for scheduling and managing appointments, built with Express.js and SQLite. This API allows users to manage events, schedules, and appointments, similar to Calendly.

## Features

- **User Management**: Create, update, and delete users.
- **Event Management**: Create, update, and delete event types.
- **Schedule Management**: Create, update, and delete user schedules.
- **Appointment Management**: Schedule, update, and delete appointments.
- **Swagger Documentation**: Interactive API documentation available at `/docs`.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EeroVallistu/CalendlyCloneAPI.git
   cd CalendlyCloneAPI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the database with example data:
   ```bash
   node seed.js
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the API at `http://localhost:3000`.

### API Documentation

The API is documented using Swagger. You can access the interactive documentation at:
