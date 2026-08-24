# Secure Event Booking API

A secure RESTful API for managing events and bookings with authentication, authorization, validation, and MongoDB.

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- User profile
- Event management
- Event browsing
- Booking management
- Seat availability management
- Joi request validation
- Centralized error handling
- Swagger API documentation
- MongoDB with Mongoose
- Password hashing with bcrypt

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Joi
- Swagger

## Installation

Clone the repository and install dependencies:

```bash
npm install
Environment Variables

Create a .env file in the project root directory:

PORT=3000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY

Do not commit the .env file to GitHub.

Make sure .env is included in .gitignore.

Running the Project
Development
npm run dev
Production
npm start

The server runs by default on:

http://localhost:3000
API Documentation

Swagger documentation is available at:

http://localhost:3000/api-docs

Swagger provides interactive API documentation and allows testing the API endpoints directly from the browser.

Authentication

The API uses JWT Bearer Token authentication.

After logging in successfully, copy the returned access token and use the Authorize button in Swagger.

Use the following format:

Bearer YOUR_TOKEN
User Roles

The API supports three roles:

user
organizer
admin

New users are always registered as user.

Users cannot assign themselves organizer or admin during registration.

Privileged roles must be assigned through authorized server-side operations.

API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
Users
GET /api/users/me
Events
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
Bookings
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
DELETE /api/bookings/:id
Events Authorization

Event browsing is public:

GET /api/events
GET /api/events/:id

Creating, updating, and deleting events require authentication and appropriate permissions.

POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id

Only organizer and admin roles can perform event management operations.

Organizers can manage their own events, while admins have broader management permissions.

Bookings Authorization

Users must be authenticated to create and manage bookings.

Each booking is associated with the authenticated user and an event.

Users can access their own bookings, while admins have additional access according to their permissions.

The API automatically manages event seat availability when bookings are created, updated, or cancelled.

Validation

Request data is validated using Joi.

Invalid requests return a consistent error response.

Example:

{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
Error Handling

The API uses centralized error handling middleware.

Common errors include:

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error

Example:

{
  "success": false,
  "message": "Resource not found"
}
Security

The API includes several security mechanisms:

Password hashing using bcrypt
JWT-based authentication
Protected routes
Role-based authorization
Joi input validation
Server-controlled user roles
Centralized error handling
Environment variables for sensitive configuration
MongoDB authentication

Users cannot assign themselves privileged roles during registration.

Project Structure
Secure Event Booking API/
│
├── config/
│   ├── db.js
│   └── swagger.js
│
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   └── eventController.js
│
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── protect.js
│   ├── restrictTo.js
│   └── validate.js
│
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Booking.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── event.routes.js
│   └── booking.routes.js
│
├── services/
│   ├── authService.js
│   ├── eventService.js
│   └── bookingService.js
│
├── validators/
│   ├── auth.validator.js
│   ├── event.validator.js
│   └── bookingValidator.js
│
├── utils/
│   └── generateToken.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
Database

The project uses MongoDB with Mongoose.

Main collections:

users
events
bookings

Each booking references the authenticated user and the related event.

Testing

The API can be tested using:

Swagger UI
Postman

Important test cases include:

Successful registration
Duplicate email registration
Invalid registration data
Successful login
Invalid login credentials
Missing JWT token
Invalid JWT token
Unauthorized role access
Event CRUD operations
Booking creation
Booking updates
Booking cancellation
Insufficient event seats
Accessing another user's booking
Invalid resource IDs
Non-existent resources
Future Improvements

Potential future improvements include:

Refresh token authentication
Database indexes and query optimization
API response caching
Load testing
Performance monitoring
Automated testing with Jest or Supertest
Advanced admin management
License

This project is developed for educational and training purposes.
