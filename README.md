# MERN Stack Production-Ready Boilerplate

A comprehensive, enterprise-grade MERN (MongoDB, Express, React, Node.js) boilerplate with complete authentication, role-based access control, and modern tooling.

## Features

### Backend
- **Express.js** - Lightweight and flexible Node.js framework
- **MongoDB & Mongoose** - NoSQL database with strong schema validation
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Role-Based Access Control (RBAC)** - User and Admin roles with middleware
- **Security** - Helmet, CORS, rate limiting, XSS protection, HPP
- **Input Validation** - Joi schemas for request validation
- **Error Handling** - Centralized error handling middleware
- **Request Logging** - Morgan for HTTP request logging
- **Custom Utilities** - ApiResponse, ApiError, asyncHandler helpers

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Hook Form** - Efficient form handling
- **Yup** - Schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library

## Project Structure

```
MERN-Boilerplate/
├── server/                          # Node.js/Express backend
│   ├── config/                      # Configuration files
│   │   ├── database.js             # MongoDB connection
│   │   └── environment.js          # Environment config
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js       # Auth endpoints
│   │   └── userController.js       # User endpoints
│   ├── middleware/                  # Custom middleware
│   │   ├── authenticate.js         # JWT verification
│   │   ├── authorize.js            # Role checking
│   │   └── errorHandler.js         # Global error handler
│   ├── models/                      # Mongoose schemas
│   │   └── User.js                 # User schema
│   ├── routes/                      # API routes
│   │   └── v1/                     # API v1 routes
│   │       ├── authRoutes.js       # Auth routes
│   │       └── userRoutes.js       # User routes
│   ├── services/                    # Business logic
│   │   ├── authService.js          # Auth logic
│   │   └── userService.js          # User logic
│   ├── utils/                       # Helper functions
│   │   ├── ApiError.js             # Error class
│   │   ├── ApiResponse.js          # Response class
│   │   └── asyncHandler.js         # Async wrapper
│   ├── validators/                  # Joi validators
│   │   ├── authValidator.js        # Auth schemas
│   │   └── userValidator.js        # User schemas
│   ├── app.js                       # Express app config
│   ├── server.js                    # Server entry point
│   ├── package.json                 # Backend dependencies
│   └── .env.example                 # Environment variables template
│
├── client/                          # React/Vite frontend
│   ├── src/
│   │   ├── app/
│   │   │   └── App.jsx             # Main App component
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.jsx       # Login page
│   │   │   ├── SignupPage.jsx      # Signup page
│   │   │   ├── DashboardPage.jsx   # User dashboard
│   │   │   ├── ProfilePage.jsx     # User profile
│   │   │   ├── SettingsPage.jsx    # Settings page
│   │   │   ├── AdminPage.jsx       # Admin panel
│   │   │   └── NotFoundPage.jsx    # 404 page
│   │   ├── routes/                  # Route components
│   │   │   ├── ProtectedRoute.jsx  # Protected routes
│   │   │   └── AdminRoute.jsx      # Admin routes
│   │   ├── services/                # API services
│   │   │   ├── authApi.js          # Auth RTK Query
│   │   │   ├── userApi.js          # User RTK Query
│   │   │   └── axiosInstance.js    # Axios configuration
│   │   ├── store/                   # Redux store
│   │   │   ├── store.js            # Store configuration
│   │   │   └── slices/
│   │   │       ├── authSlice.js    # Auth state
│   │   │       └── userSlice.js    # User state
│   │   ├── styles/                  # Global styles
│   │   │   └── index.css           # Global CSS
│   │   └── main.jsx                 # React entry point
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind config
│   ├── postcss.config.js            # PostCSS config
│   ├── package.json                 # Frontend dependencies
│   └── .env.example                 # Environment variables template
│
└── README.md                        # This file
```


Built with ❤️ for production-ready applications.
# Hackathon-Mern
