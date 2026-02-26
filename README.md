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

## Getting Started

### Prerequisites
- Node.js 16+ and pnpm (or npm/yarn)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mern-boilerplate
```

2. **Setup Backend**
```bash
cd server
pnpm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/mern-boilerplate
# JWT_SECRET=your_secret_key_here
# etc.

# Start backend (development)
pnpm run dev

# Start backend (production)
pnpm run start
```

3. **Setup Frontend**
```bash
cd ../client
pnpm install

# Create .env file
cp .env.example .env

# Start frontend (development)
pnpm run dev

# Build for production
pnpm run build
```

## Environment Variables

### Backend (.env)
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-boilerplate
MONGODB_USER=
MONGODB_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend (.env)
```
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=MERN Boilerplate
VITE_APP_ENV=development
```

## API Documentation

### Authentication Endpoints

#### Sign Up
```
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: { user, accessToken, refreshToken }
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: { user, accessToken, refreshToken }
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}

Response: { accessToken }
```

#### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer <accessToken>

Response: { user }
```

#### Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>

Response: { success: true }
```

### User Endpoints

#### Get User by ID
```
GET /api/v1/users/:id
```

#### Get All Users (Admin)
```
GET /api/v1/users?limit=10&skip=0&role=user
Authorization: Bearer <accessToken>
```

#### Update Profile
```
PUT /api/v1/users/profile
Authorization: Bearer <accessToken>

{
  "firstName": "Jane",
  "lastName": "Doe",
  "bio": "Updated bio"
}
```

#### Change Password
```
POST /api/v1/users/change-password
Authorization: Bearer <accessToken>

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456",
  "confirmPassword": "NewPassword456"
}
```

#### Update User Role (Admin)
```
PATCH /api/v1/users/:id/role
Authorization: Bearer <accessToken>

{
  "role": "admin"
}
```

#### Delete User (Admin)
```
DELETE /api/v1/users/:id
Authorization: Bearer <accessToken>
```

## Authentication Flow

1. User signs up with email and password
2. Password is hashed with bcryptjs
3. User is created in MongoDB
4. Access token (7 days) and refresh token (30 days) are generated
5. Frontend stores tokens in localStorage
6. Access token is sent in Authorization header for each request
7. When access token expires, refresh token is used to get a new access token
8. If refresh token expires, user is logged out

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Separate access and refresh tokens
- **HTTP Headers**: Helmet.js for security headers
- **CORS**: Strict CORS configuration
- **XSS Protection**: xss-clean middleware
- **NoSQL Injection Protection**: Joi validation and MongoDB sanitization
- **Parameter Pollution**: HPP middleware
- **Rate Limiting**: Express rate-limit middleware
- **Input Validation**: Comprehensive Joi schemas

## Development

### Backend Development
```bash
cd server
pnpm run dev
```

### Frontend Development
```bash
cd client
pnpm run dev
```

Both will run with hot reload enabled.

### Building for Production

Backend:
```bash
cd server
pnpm run build
pnpm start
```

Frontend:
```bash
cd client
pnpm run build
pnpm run preview
```

## Database Setup

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/cloud
2. Create a cluster
3. Get connection string
4. Add to .env as MONGODB_URI

### Local MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
mongod

# Linux
sudo systemctl start mongod
```

## Deployment

### Deploying Backend (Vercel, Heroku, Railway, etc.)
1. Push code to GitHub
2. Connect to deployment platform
3. Add environment variables
4. Deploy

### Deploying Frontend (Vercel, Netlify, etc.)
1. Build: `pnpm run build`
2. Deploy dist folder
3. Add environment variables for API URL

## Testing Authentication

### Test User Credentials
- Email: test@example.com
- Password: TestPassword123

## Troubleshooting

### "MONGODB_URI not found"
- Ensure .env file exists in server directory
- Check MONGODB_URI is set correctly

### "Cannot GET /api/v1/users"
- Verify backend is running on port 5000
- Check API proxy in vite.config.js

### CORS errors
- Check CORS_ORIGIN in server .env
- Ensure it matches frontend URL (http://localhost:5173)

### Token expired errors
- Refresh token should be automatically handled
- Check localStorage for tokens
- Try logging out and logging in again

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

## Next Steps

1. Customize the User model fields
2. Add additional API endpoints
3. Implement file upload functionality
4. Add email verification
5. Add password reset functionality
6. Add OAuth integration (Google, GitHub)
7. Add API documentation (Swagger/OpenAPI)
8. Add comprehensive testing (Jest, Supertest)
9. Set up CI/CD pipeline
10. Deploy to production

---

Built with ❤️ for production-ready applications.
# Hackathon-Mern
