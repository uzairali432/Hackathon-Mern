# Quick Setup Guide

Get your MERN boilerplate running in 5 minutes!

## Prerequisites
- Node.js 16+ 
- pnpm (or npm/yarn)
- MongoDB instance (local or MongoDB Atlas)

## Step 1: Backend Setup (5 minutes)

### 1.1 Install Dependencies
```bash
cd server
pnpm install
```

### 1.2 Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-boilerplate
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
CORS_ORIGIN=http://localhost:5173
```

### 1.3 Start Backend
```bash
pnpm run dev
```

Expected output:
```
[Server] Connected to MongoDB
[Server] Running on port 5000 in development mode
```

## Step 2: Frontend Setup (5 minutes)

### 2.1 Install Dependencies
In a new terminal:
```bash
cd client
pnpm install
```

### 2.2 Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=MERN Boilerplate
VITE_APP_ENV=development
```

### 2.3 Start Frontend
```bash
pnpm run dev
```

Expected output:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## Step 3: Test the Application

1. **Open browser**: http://localhost:5173
2. **Sign up** with a test account
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: TestPassword123

3. **Login** with the credentials
4. **Explore Dashboard** - Click around to test
5. **Edit Profile** - Try updating your information
6. **Change Password** - Update your password

## Troubleshooting

### Backend Won't Start

**Error**: `MONGODB_URI not found`
- Solution: Check `.env` file exists in `/server` directory
- Verify MONGODB_URI is set correctly

**Error**: `Port 5000 already in use`
- Solution: Change PORT in `.env` to 5001
- Or kill existing process: `lsof -ti:5000 | xargs kill -9`

### Frontend Won't Start

**Error**: `Cannot find module`
- Solution: Delete node_modules and reinstall
  ```bash
  rm -rf node_modules pnpm-lock.yaml
  pnpm install
  ```

**Error**: `VITE_API_URL is undefined`
- Solution: Create `.env` file in `/client` with VITE_API_URL set

### Cannot Connect to API

**Error**: CORS error in browser console
- Solution: Check CORS_ORIGIN in server `.env` matches frontend URL
- Ensure backend is running on correct port

**Error**: Network error when logging in
- Solution: Check backend is running on http://localhost:5000
- Check firewall settings

### Database Connection Error

**Error**: `MongoDB connection failed`
- Solutions:
  1. If local MongoDB:
     - macOS: `brew services start mongodb-community`
     - Windows: Start MongoDB from Services
     - Linux: `sudo systemctl start mongod`
  
  2. If MongoDB Atlas:
     - Use connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
     - Whitelist your IP in MongoDB Atlas

## Directory Structure Reference

```
mern-boilerplate/
├── server/              # Backend (Express + MongoDB)
│   ├── .env            # Environment variables
│   └── ...
├── client/             # Frontend (React + Vite)
│   ├── .env           # Environment variables
│   └── ...
├── README.md           # Main documentation
└── SETUP_GUIDE.md     # This file
```

## Common Commands

### Backend
```bash
cd server
pnpm install        # Install dependencies
pnpm run dev        # Development mode
pnpm run start      # Production mode
pnpm run lint       # Run linter
```

### Frontend
```bash
cd client
pnpm install        # Install dependencies
pnpm run dev        # Development mode
pnpm run build      # Build for production
pnpm run preview    # Preview production build
pnpm run lint       # Run linter
```

## Environment Variables Quick Reference

### Backend (.env)
| Variable | Default | Purpose |
|----------|---------|---------|
| PORT | 5000 | Server port |
| MONGODB_URI | - | MongoDB connection string |
| JWT_SECRET | - | JWT signing secret |
| CORS_ORIGIN | http://localhost:5173 | Frontend URL |

### Frontend (.env)
| Variable | Default | Purpose |
|----------|---------|---------|
| VITE_API_URL | http://localhost:5000/api/v1 | Backend API URL |

## Feature Checklist

- [x] User authentication (signup/login)
- [x] JWT token management
- [x] Protected routes
- [x] Admin role and admin panel
- [x] User profile editing
- [x] Password change functionality
- [x] User management (admin)
- [x] Error handling
- [x] Input validation
- [x] Security middleware
- [x] Database models and schemas
- [x] API documentation

## Next Steps After Setup

1. **Customize User Model**
   - Add more fields to `server/models/User.js`
   - Update validators accordingly

2. **Add More Features**
   - File uploads (image profiles)
   - Email notifications
   - Two-factor authentication
   - OAuth integration

3. **Prepare for Production**
   - Change JWT secrets
   - Set NODE_ENV=production
   - Use MongoDB Atlas
   - Deploy to Vercel/Heroku/Railway

4. **Testing**
   - Set up Jest for testing
   - Add API tests with Supertest
   - Add React component tests

5. **Documentation**
   - Generate API docs with Swagger
   - Create deployment guide
   - Add architecture documentation

## Deployment Quick Links

- **Backend Hosting**: [Vercel](https://vercel.com), [Heroku](https://heroku.com), [Railway](https://railway.app)
- **Frontend Hosting**: [Vercel](https://vercel.com), [Netlify](https://netlify.com), [GitHub Pages](https://pages.github.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud)
- **File Storage**: [Cloudinary](https://cloudinary.com)

## Support & Resources

- **Main Docs**: See `README.md`
- **Backend Docs**: See `server/README.md`
- **Frontend Docs**: See `client/README.md`
- **Issues**: Create an issue in the repository

## Architecture Overview

```
┌─────────────────┐
│   React App     │
│   (localhost    │
│    :5173)       │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express Server │
│  (localhost     │
│    :5000)       │
└────────┬────────┘
         │ Query
         │
┌────────▼────────┐
│    MongoDB      │
│   (local or     │
│    Atlas)       │
└─────────────────┘
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change JWT_REFRESH_SECRET
- [ ] Set NODE_ENV=production for deployment
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Use environment variables for all secrets
- [ ] Implement HTTPS only
- [ ] Set up CORS properly
- [ ] Validate all user inputs

## Performance Tips

1. Enable compression in Express
2. Use MongoDB indexes on frequently queried fields
3. Implement caching with Redis
4. Lazy load React routes
5. Optimize bundle size
6. Enable database query optimization
7. Use connection pooling for MongoDB
8. Implement API response caching

---

Happy coding! If you encounter any issues, refer to the main `README.md` or specific documentation in `server/README.md` and `client/README.md`.
