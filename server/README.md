# MERN Backend - Express Server

Production-ready Node.js/Express backend with JWT authentication, MongoDB, and comprehensive security features.

## Quick Start

### Installation
```bash
pnpm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your values
```

### Development
```bash
pnpm run dev
```

Server runs on `http://localhost:5000`

### Production
```bash
pnpm run start
```

## Project Structure

```
server/
├── config/                  # Configuration
│   ├── database.js         # MongoDB connection
│   └── environment.js      # Environment variables
├── controllers/            # Request handlers
│   ├── authController.js
│   └── userController.js
├── middleware/            # Custom middleware
│   ├── authenticate.js    # JWT verification
│   ├── authorize.js       # Role-based access
│   └── errorHandler.js    # Global error handling
├── models/               # Mongoose schemas
│   └── User.js
├── routes/              # API routes
│   └── v1/
│       ├── authRoutes.js
│       └── userRoutes.js
├── services/            # Business logic
│   ├── authService.js
│   └── userService.js
├── utils/              # Helper functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
├── validators/         # Request validation
│   ├── authValidator.js
│   └── userValidator.js
├── app.js             # Express app setup
├── server.js          # Server entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - Get all users (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/change-password` - Change password
- `PATCH /api/v1/users/:id/role` - Update user role (Admin)
- `DELETE /api/v1/users/:id` - Delete user (Admin)

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-boilerplate
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
```

## Authentication

### JWT Tokens
- **Access Token**: 7 days expiration
- **Refresh Token**: 30 days expiration
- **Refresh Strategy**: Automatic token refresh on 401 response

### Middleware
```javascript
// Use authenticate middleware to protect routes
import { authenticate } from './middleware/authenticate.js';

router.get('/protected-route', authenticate, controller);
```

### Role-Based Access
```javascript
// Use authorize middleware for role checking
import { authorize } from './middleware/authorize.js';

router.post('/admin-only', authenticate, authorize('admin'), controller);
```

## Error Handling

### Custom Error Class
```javascript
throw new ApiError('User not found', 404);
```

### Response Format
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

## Request Validation

### Using Joi Schemas
```javascript
import { authValidators } from './validators/authValidator.js';

// In controller
const validatedData = validate(authValidators.login, req.body);
```

## Database

### MongoDB Connection
- Local: `mongodb://localhost:27017/mern-boilerplate`
- Atlas: `mongodb+srv://user:password@cluster.mongodb.net/database`

### Mongoose Models
- **User** - User schema with password hashing and instance methods

## Security Features

- **Helmet.js** - HTTP headers security
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Prevent abuse
- **XSS Protection** - xss-clean middleware
- **HPP** - Parameter pollution protection
- **Input Validation** - Joi schemas
- **Password Hashing** - bcryptjs

## Development Tips

### Adding New Routes
1. Create controller in `controllers/`
2. Create validator in `validators/`
3. Create routes in `routes/v1/`
4. Mount routes in `app.js`

### Adding New Endpoints
```javascript
// In controllers/exampleController.js
export const getExample = asyncHandler(async (req, res) => {
  // Your code
  res.status(200).json(new ApiResponse(200, data, 'Success'));
});

// In routes/v1/exampleRoutes.js
router.get('/', authenticate, exampleController.getExample);
```

## Testing

### Health Check
```bash
curl http://localhost:5000/api/v1/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Database Connection Error
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Verify network access if using Atlas

### JWT Errors
- Token expired: Use refresh token to get new access token
- Invalid token: Check token format and secret key
- Missing token: Include Authorization header

### CORS Errors
- Check CORS_ORIGIN in .env matches frontend URL
- Ensure credentials option is set correctly

## Performance Tips

- Use MongoDB indexes on frequently queried fields
- Implement caching with Redis for frequently accessed data
- Batch database operations when possible
- Monitor API response times

## Next Steps

1. Add file upload functionality
2. Implement email verification
3. Add password reset flow
4. Integrate OAuth providers
5. Add comprehensive testing
6. Set up API documentation (Swagger)
7. Implement request logging
8. Add data export functionality

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Helmet.js](https://helmetjs.github.io/)
