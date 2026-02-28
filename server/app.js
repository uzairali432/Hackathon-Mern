import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import xss from 'xss-clean';

import { config } from './config/environment.js';
import authRoutes from './routes/v1/authRoutes.js';
import userRoutes from './routes/v1/userRoutes.js';
import doctorRoutes from './routes/v1/doctorRoutes.js';
import receptionistRoutes from './routes/v1/receptionistRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

// ========================
// Trust proxy - for production
// ========================
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// ========================
// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Protect against HTTP Parameter Pollution attacks

// ========================
// CORS Configuration
// ========================
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ========================
// Rate Limiting
// ========================
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ========================
// Request Logging
// ========================
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ========================
// Body Parser Middleware
// ========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ========================
// API Routes
// ========================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/receptionists', receptionistRoutes);

// ========================
// Health Check Route
// ========================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// 404 Route Handler
// ========================
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ========================
// Global Error Handler
// ========================
app.use(errorHandler);

export default app;
