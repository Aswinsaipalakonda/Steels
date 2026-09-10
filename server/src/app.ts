import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { ApiResponse } from './utils/apiResponse';

// Routers
import authRoutes from './modules/auth/auth.routes';
import mediaRoutes from './modules/media/media.routes';
import categoryRoutes from './modules/categories/category.routes';
import brandRoutes from './modules/brands/brand.routes';
import productRoutes from './modules/products/product.routes';
import heroSlideRoutes from './modules/hero-slides/heroSlide.routes';
import settingsRoutes from './modules/settings/settings.routes';
import enquiryRoutes from './modules/enquiries/enquiry.routes';
import customerRoutes from './modules/customers/customer.routes';
import contactRoutes from './modules/contact/contact.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import path from 'path';

const app: Express = express();

// Serve local static uploaded media files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parsers & logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting for public enquiry and contact endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes',
  },
});

app.use('/api/v1/enquiries', publicLimiter);
app.use('/api/v1/contact', publicLimiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json(
    ApiResponse.success(
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'steel-platform-api',
      },
      'Steel Platform API service is healthy'
    )
  );
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/hero-slides', heroSlideRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 handler for unknown routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json(ApiResponse.error(`Route not found: ${req.originalUrl}`));
});

// Global Central Error Handler
app.use(errorHandler);

export default app;
