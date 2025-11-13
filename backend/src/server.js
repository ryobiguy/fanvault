import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import pool from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import messageRoutes from './routes/messages.js';
import subscriptionRoutes from './routes/subscriptions.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - required for Railway and other proxies
app.set('trust proxy', 1);

// Middleware
app.use(helmet());

// CORS - Allow all Vercel preview URLs and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  /\.vercel\.app$/, // Allow all Vercel preview URLs
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FanVault API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 FanVault API server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

startServer();

export default app;
