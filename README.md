# Calendly Clone API

A RESTful API for scheduling and managing appointments, built with Express.js and SQLite. This API allows users to manage events, schedules, and appointments, similar to Calendly.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [API Documentation](#api-documentation)
- [Why These API Stacks Exist](#why-these-api-stacks-exist)
- [Users API](#users-api)
- [Authentication API](#authentication-api)
- [Events API](#events-api)
- [Schedules API](#schedules-api)
- [Appointments API](#appointments-api)

## Features

- **User Management**: Create, update, and delete users.
- **Event Management**: Create, update, and delete event types.
- **Schedule Management**: Create, update, and delete user schedules.
- **Appointment Management**: Schedule, update, and delete appointments.
- **Authentication**: Secure endpoints with JWT-based authentication.
- **Swagger Documentation**: Interactive API documentation available at `/docs`.

## Getting Started

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

## API Documentation

The API is documented using Swagger. You can access the interactive documentation at: `http://localhost:3000/docs/`

## Why These API Stacks Exist

### 1. **Users API**
- **What it does**: Manages user accounts (create, update, delete).
- **Why it's needed**: To store user details and enable authentication.

### 2. **Authentication API**
- **What it does**: Handles login, logout, and session management.
- **Why it's needed**: To secure the system and ensure only authorized users can access it.

### 3. **Events API**
- **What it does**: Manages event types (e.g., meetings, calls).
- **Why it's needed**: To define the types of events users can schedule.

### 4. **Schedules API**
- **What it does**: Manages user availability.
- **Why it's needed**: To ensure appointments are only scheduled during free times.

### 5. **Appointments API**
- **What it does**: Manages the scheduling, updating, and deletion of appointments.
- **Why it's needed**: To handle the core functionality of booking appointments.

### Why This Design Works
- **Modular**: Each API focuses on one task, making the system easier to maintain.
- **Scalable**: Independent APIs can be scaled separately as needed.
- **Secure**: Centralized authentication keeps the system safe.


## Users API

The Users API allows you to manage user accounts in the system. It supports creating, retrieving, updating, and deleting users.

### Endpoints

#### 1. **Create a User**
Create a new user with a name, email, password, and optional timezone.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Users** section.
3. Click on the `POST /users` endpoint.
4. Click "Try it out".
5. Enter the following JSON in the request body:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "timezone": "UTC"
   }
   ```
6. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "timezone": "UTC"
}
```

#### 2. **Get All Users**
Retrieve a paginated list of all users.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Users** section.
3. Click on the `GET /users` endpoint.
4. Click "Try it out".
5. Enter `1` for `page` and `20` for `pageSize`.
6. Click "Execute" to send the request.

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "timezone": "UTC"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

#### 3. **Get User Details**
Retrieve details of a specific user by their ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Users** section.
3. Click on the `GET /users/{userId}` endpoint.
4. Click "Try it out".
5. Enter `1` for `userId`.
6. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "timezone": "UTC"
}
```

#### 4. **Update a User**
Partially update a user's information (e.g., name, email, password, or timezone).

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Users** section.
3. Click on the `PATCH /users/{userId}` endpoint.
4. Click "Try it out".
5. Enter `1` for `userId`.
6. Enter the following JSON in the request body:
   ```json
   {
     "name": "John Updated"
   }
   ```
7. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "1",
  "name": "John Updated",
  "email": "john@example.com",
  "timezone": "UTC"
}
```

#### 5. **Delete a User**
Delete a user by their ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Users** section.
3. Click on the `DELETE /users/{userId}` endpoint.
4. Click "Try it out".
5. Enter `1` for `userId`.
6. Click "Execute" to send the request.

**Response:**
`204 No Content`

## Authentication API

The Authentication API allows users to log in, log out, and check their session status. It uses JWT (JSON Web Tokens) for secure authentication.

### Endpoints

#### 1. **Login**
Authenticate a user and receive a JWT token.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Authentication** section.
3. Click on the `POST /sessions` endpoint.
4. Click "Try it out".
5. Enter the following JSON in the request body:
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
6. Click "Execute" to send the request.

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. **Logout**
End the current user session.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Authentication** section.
3. Click on the `DELETE /sessions` endpoint.
4. Click "Try it out".
5. Click "Execute" to send the request.

**Response:**
`200 OK`

#### 3. **Check Session**
Check if the user is authenticated and retrieve their session details.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Authentication** section.
3. Click on the `GET /sessions` endpoint.
4. Click "Try it out".
5. Click "Execute" to send the request.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "1",
    "email": "john@example.com"
  }
}
```

## Events API

The Events API allows you to manage event types in the system. It supports creating, retrieving, updating, and deleting events.

### Endpoints

#### 1. **Create an Event**
Create a new event type with a name, duration, and optional details.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Events** section.
3. Click on the `POST /events` endpoint.
4. Click "Try it out".
5. Enter the following JSON in the request body:
   ```json
   {
     "name": "Team Meeting",
     "duration": 30,
     "description": "Daily standup",
     "color": "#FF0000"
   }
   ```
6. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "101",
  "name": "Team Meeting",
  "duration": 30,
  "description": "Daily standup",
  "color": "#FF0000"
}
```

#### 2. **Get All Events**
Retrieve a list of all event types.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Events** section.
3. Click on the `GET /events` endpoint.
4. Click "Try it out".
5. Click "Execute" to send the request.

**Response:**
```json
[
  {
    "id": "101",
    "name": "Team Meeting",
    "duration": 30,
    "description": "Daily standup",
    "color": "#FF0000"
  }
]
```

#### 3. **Get Event Details**
Retrieve details of a specific event by its ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Events** section.
3. Click on the `GET /events/{eventId}` endpoint.
4. Click "Try it out".
5. Enter `101` for `eventId`.
6. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "101",
  "name": "Team Meeting",
  "duration": 30,
  "description": "Daily standup",
  "color": "#FF0000"
}
```

#### 4. **Update an Event**
Partially update an event's information (e.g., name, duration, description, or color).

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Events** section.
3. Click on the `PATCH /events/{eventId}` endpoint.
4. Click "Try it out".
5. Enter `101` for `eventId`.
6. Enter the following JSON in the request body:
   ```json
   {
     "name": "Updated Team Meeting"
   }
   ```
7. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "101",
  "name": "Updated Team Meeting",
  "duration": 30,
  "description": "Daily standup",
  "color": "#FF0000"
}
```

#### 5. **Delete an Event**
Delete an event by its ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Events** section.
3. Click on the `DELETE /events/{eventId}` endpoint.
4. Click "Try it out".
5. Enter `101` for `eventId`.
6. Click "Execute" to send the request.

**Response:**
`204 No Content`

## Schedules API

The Schedules API allows you to manage user schedules in the system. It supports creating, retrieving, updating, and deleting schedules.

### Endpoints

#### 1. **Create a Schedule**
Create a new schedule for a user with their availability.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Schedules** section.
3. Click on the `POST /schedules` endpoint.
4. Click "Try it out".
5. Enter the following JSON in the request body:
   ```json
   {
     "userId": "1",
     "availability": [
       {
         "day": "monday",
         "startTime": "09:00",
         "endTime": "17:00"
       }
     ]
   }
   ```
6. Click "Execute" to send the request.

**Response:**
```json
{
  "userId": "1",
  "availability": [
    {
      "day": "monday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

#### 2. **Get a Schedule**
Retrieve the schedule for a specific user by their ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Schedules** section.
3. Click on the `GET /schedules/{userId}` endpoint.
4. Click "Try it out".
5. Enter `1` for `userId`.
6. Click "Execute" to send the request.

**Response:**
```json
{
  "userId": "1",
  "availability": [
    {
      "day": "monday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

#### 3. **Update a Schedule**
Partially update a user's schedule (e.g., availability).

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Schedules** section.
3. Click on the `PATCH /schedules/{userId}` endpoint.
4. Click "Try it out".
5. Enter `1` for `userId`.
6. Enter the following JSON in the request body:
   ```json
   {
     "availability": [
       {
         "day": "tuesday",
         "startTime": "10:00",
         "endTime": "18:00"
       }
     ]
   }
   ```
7. Click "Execute" to send the request.

**Response:**
```json
{
  "userId": "1",
  "availability": [
    {
      "day": "tuesday",
      "startTime": "10:00",
      "endTime": "18:00"
    }
  ]
}
```

#### 4. **Delete a Schedule**
Delete a schedule for a specific user by their ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Schedules** section.
3. Click on the `DELETE /schedules/{userId}` endpoint.
4. Click "Try it out".
5. Enter `1` for `userId`.
6. Click "Execute" to send the request.

**Response:**
`204 No Content`

## Appointments API

The Appointments API allows you to manage appointments in the system. It supports scheduling, retrieving, updating, and deleting appointments.

### Endpoints

#### 1. **Schedule an Appointment**
Schedule a new appointment for an event with a user and invitee.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Appointments** section.
3. Click on the `POST /appointments` endpoint.
4. Click "Try it out".
5. Enter the following JSON in the request body:
   ```json
   {
     "eventId": "101",
     "userId": "1",
     "inviteeEmail": "invitee@example.com",
     "startTime": "2025-02-12T09:00:00Z",
     "endTime": "2025-02-12T09:30:00Z"
   }
   ```
6. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "201",
  "eventId": "101",
  "userId": "1",
  "inviteeEmail": "invitee@example.com",
  "startTime": "2025-02-12T09:00:00Z",
  "endTime": "2025-02-12T09:30:00Z"
}
```

#### 2. **Get All Appointments**
Retrieve a list of all appointments.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Appointments** section.
3. Click on the `GET /appointments` endpoint.
4. Click "Try it out".
5. Click "Execute" to send the request.

**Response:**
```json
[
  {
    "id": "201",
    "eventId": "101",
    "userId": "1",
    "inviteeEmail": "invitee@example.com",
    "startTime": "2025-02-12T09:00:00Z",
    "endTime": "2025-02-12T09:30:00Z"
  }
]
```

#### 3. **Get Appointment Details**
Retrieve details of a specific appointment by its ID.

**Swagger UI Example:**
1. Open the Swagger UI at `http://localhost:3000/docs`.
2. Navigate to the **Appointments** section.
3. Click on the `GET /appointments/{appointmentId}` endpoint.
4. Click "Try it out".
5. Enter `201` for `appointmentId`.
6. Click "Execute" to send the request.

**Response:**
```json
{
  "id": "201",
  "eventId": "101",
  "userId": "1",
  "inviteeEmail": "invitee@example.com",
  "startTime": "2025-02-12T09:00:00Z",
  "endTime": "2025-02-12T09:30:00Z"
}
```

## Authentication

The API uses **session-based Bearer Authentication**. After logging in, a session cookie (`connect.sid`) is set, which acts as a Bearer token for subsequent requests.

### How to Authenticate:
1. **Login**: Send a `POST` request to `/sessions` with your email and password.
2. **Session Cookie**: The server sets a session cookie (`connect.sid`) in the response.
3. **Bearer Token**: Include the session cookie in all subsequent requests to access protected endpoints.
4. **Logout**: Send a `DELETE` request to `/sessions` to destroy the session.
