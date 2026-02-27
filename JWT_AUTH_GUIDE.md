# JWT Authentication System with MongoDB Integration

This MERN boilerplate includes a production-ready JWT authentication system with role-based access control (RBAC), secure password hashing, and MongoDB integration.

## System Overview

### Architecture

```
Client (React + Redux)
    ↓
Axios Interceptor (Token Management)
    ↓
Express API (Port 5000)
    ↓
MongoDB (Database)
```

## Backend Setup

### 1. MongoDB Configuration

**File:** `server/config/database.js`

The database connection is automatically initialized on server startup:

```javascript
import { connectDatabase } from './config/database.js';

// In server.js
connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
```

**MongoDB Connection String:**
- Development: `mongodb://localhost:27017/mern-boilerplate`
- Production: `mongodb+srv://user:password@cluster.mongodb.net/mern-boilerplate`

Set `MONGODB_URI` in `.env` file.

### 2. User Schema (MongoDB)

**File:** `server/models/User.js`

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isEmailVerified: Boolean,
  refreshTokens: Array (for token blacklisting),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. JWT Token System

**Access Token:**
- Duration: 7 days (configurable)
- Used for API requests
- Expires and requires refresh

**Refresh Token:**
- Duration: 30 days (configurable)
- Used to get new access token
- Stored securely in HTTP-only cookies

**Configuration:**
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRE=30d
```

## API Endpoints

### Authentication Routes

**File:** `server/routes/v1/authRoutes.js`

#### 1. Sign Up
```
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

#### 2. Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

#### 3. Refresh Token
```
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 4. Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "User logged out successfully"
}
```

## Frontend Implementation

### 1. Redux Store

**File:** `client/src/store/slices/authSlice.js`

Manages authentication state:
- `user`: Current user data
- `tokens`: Access and refresh tokens
- `isAuthenticated`: Boolean flag
- `isLoading`: Loading state
- `error`: Error messages

### 2. Axios Interceptor

**File:** `client/src/services/axiosInstance.js`

- Automatically adds `Authorization` header to requests
- Handles 401 responses by refreshing token
- Retries failed requests with new token
- Redirects to login on token refresh failure

```javascript
// Request Interceptor
axios.interceptors.request.use((config) => {
  const token = store.getState().auth.tokens?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token and retry
      const newToken = await refreshAccessToken();
      // Retry original request with new token
    }
  }
);
```

### 3. Protected Routes

**Files:**
- `client/src/routes/ProtectedRoute.jsx` - For authenticated users
- `client/src/routes/AdminRoute.jsx` - For admin users only

```javascript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>
  
  {/* Admin only routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminPage />} />
  </Route>
</Routes>
```

### 4. Login & Signup Forms

**Files:**
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/SignupPage.jsx`

**Features:**
- Clean, minimalist UI design
- Form validation with React Hook Form + Yup
- Real-time error messages
- Loading states
- Icon integration with Lucide React
- Responsive design

## Security Features

### Backend Security

1. **Password Hashing**
   - Uses bcrypt with 10 salt rounds
   - Passwords never stored in plain text

2. **JWT Tokens**
   - Signed with secret key
   - Contain user ID, email, and role
   - Time-limited with expiration

3. **Middleware Protection**
   - `authenticate.js`: Validates JWT token
   - `authorize.js`: Checks user role/permissions
   - CORS enabled for specified origins

4. **Additional Security**
   - Helmet.js for HTTP headers
   - XSS protection
   - HPP (HTTP Parameter Pollution) protection
   - Rate limiting on auth endpoints
   - Input validation with Joi

### Frontend Security

1. **Token Storage**
   - Access token in memory
   - Refresh token in HTTP-only cookie (if using cookies)

2. **Automatic Token Refresh**
   - Transparent token refresh on 401 responses
   - Prevents unauthorized access

3. **Route Protection**
   - Protected routes check authentication state
   - Admin routes verify user role
   - Unauthorized users redirected to login

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mern-boilerplate

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secrets
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### 3. Testing the Auth System

1. **Sign Up:**
   - Navigate to `http://localhost:5173/signup`
   - Fill in form and create account
   - User automatically logged in and redirected to dashboard

2. **Login:**
   - Navigate to `http://localhost:5173/login`
   - Enter credentials
   - Access token stored in Redux state
   - Redirected to dashboard

3. **Protected Routes:**
   - Attempt to access `/dashboard` without auth
   - Redirected to login page

4. **Token Refresh:**
   - Wait for access token to expire
   - Next API request automatically refreshes token
   - User stays logged in

## Common Issues

### 1. "Invalid Token"
- Check JWT_SECRET matches between signup/login
- Verify token hasn't expired
- Clear browser cache and try again

### 2. "Invalid Email or Password"
- Verify email is correct
- Check password is correct
- Ensure account exists

### 3. "CORS Error"
- Verify CORS_ORIGIN in backend .env
- Should match frontend URL (http://localhost:5173)
- Restart backend after changing

### 4. "MongoDB Connection Failed"
- Verify MongoDB is running
- Check MONGODB_URI is correct
- Verify firewall allows connection

## File Structure

```
server/
├── config/
│   ├── database.js
│   └── environment.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── authenticate.js
│   ├── authorize.js
│   └── errorHandler.js
├── models/
│   └── User.js
├── routes/v1/
│   ├── authRoutes.js
│   └── userRoutes.js
├── services/
│   ├── authService.js
│   └── userService.js
├── validators/
│   └── authValidator.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
├── app.js
└── server.js

client/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── services/
│   │   ├── axiosInstance.js
│   │   └── authApi.js
│   ├── store/
│   │   └── slices/
│   │       └── authSlice.js
│   ├── styles/
│   │   └── index.css
│   └── App.jsx
```

## Next Steps

1. **Password Reset:** Implement forgot password flow
2. **Email Verification:** Add email verification on signup
3. **Two-Factor Authentication:** Enhance security with 2FA
4. **OAuth Integration:** Add Google/GitHub login
5. **User Profile:** Implement profile editing and avatar upload

---

For more information, refer to the main README.md and individual component documentation.
