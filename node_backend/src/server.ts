import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from './config/auth';

// Import routes
import obfRoutes from './routes/obf';
import fileUploadRoutes from './routes/fileUpload';
import mastersRoutes from './routes/masters';
import costBreakupRoutes from './routes/costBreakup';
import obfTablesRoutes from './routes/obfTables';
import authRoutes from './routes/auth';
import obfAccessRoutes from './routes/obfAccess';
import finalOutputRouter from './routes/finalOutput';
import notificationsRouter from './routes/notifications';

// Import error handler
import { errorHandler } from './middleware/errorHandler';

// Import database
import { sequelize } from './config/database';

// Import config
import config from './config/config';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up CORS
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));

// Logging middleware
app.use(morgan('dev'));

// Session middleware
app.use(session({
  secret: config.jwt.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimit.perMinute,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/obf', notificationsRouter);
app.use('/api/obf', obfRoutes);
app.use('/api/upload', fileUploadRoutes);
app.use('/api/masters', mastersRoutes);
app.use('/api/cost-breakup', costBreakupRoutes);
app.use('/api/obf-tables', obfTablesRoutes);
app.use('/api/obf-access', obfAccessRoutes);
app.use('/api', finalOutputRouter);

// Route aliases for backward compatibility with Python backend
app.get('/obf/manpower-breakup/:obfId', (req: Request, res: Response) => {
  const newUrl = `/cost-breakup/${req.params.obfId}/manpower`;
  res.redirect(newUrl);
});

app.get('/obf/capex-breakup/:obfId', (req: Request, res: Response) => {
  const newUrl = `/cost-breakup/${req.params.obfId}/capex`;
  res.redirect(newUrl);
});

app.get('/obf/opex-breakup/:obfId', (req: Request, res: Response) => {
  const newUrl = `/cost-breakup/${req.params.obfId}/opex`;
  res.redirect(newUrl);
});

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to OBF Automation API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// API Documentation route
app.get('/api-docs', (_req: Request, res: Response) => {
  res.json({
    message: 'API Documentation',
    endpoints: [
      { path: '/obf', methods: ['GET', 'POST'], description: 'Get all OBFs or create a new OBF' },
      { path: '/obf/:id', methods: ['GET', 'PUT', 'DELETE'], description: 'Get, update, or delete a specific OBF' },
      { path: '/file-upload', methods: ['POST'], description: 'Upload and process an Excel file' },
      { path: '/file-upload/template/:type', methods: ['GET'], description: 'Download a template file based on type' },
      { path: '/masters/manpower', methods: ['GET'], description: 'Get all manpower master data' },
      { path: '/masters/capex', methods: ['GET'], description: 'Get all capex master data' },
      { path: '/masters/opex', methods: ['GET'], description: 'Get all opex master data' },
      { path: '/masters/rental', methods: ['GET'], description: 'Get all rental master data' },
      { path: '/cost-breakup/:obfId/manpower', methods: ['GET'], description: 'Get manpower cost breakup for an OBF' },
      { path: '/cost-breakup/:obfId/capex', methods: ['GET'], description: 'Get capex cost breakup for an OBF' },
      { path: '/cost-breakup/:obfId/opex', methods: ['GET'], description: 'Get opex cost breakup for an OBF' },
      { path: '/cost-breakup/:obfId/rental', methods: ['GET'], description: 'Get rental cost breakup for an OBF' },
      { path: '/obf-tables/:obfId/revenue', methods: ['GET'], description: 'Get OBF revenue data' },
      { path: '/obf-tables/:obfId/implementation-costs', methods: ['GET'], description: 'Get OBF implementation costs' },
      { path: '/obf/manpower-breakup/:obfId', methods: ['GET'], description: 'Alias for /cost-breakup/:obfId/manpower' },
      { path: '/obf/capex-breakup/:obfId', methods: ['GET'], description: 'Alias for /cost-breakup/:obfId/capex' },
      { path: '/obf/opex-breakup/:obfId', methods: ['GET'], description: 'Alias for /cost-breakup/:obfId/opex' },
      { path: '/obf-access/:obfId/users', methods: ['GET'], description: 'Get all users with access to an OBF' },
      { path: '/obf-access/:obfId/users/:userId', methods: ['POST'], description: 'Grant access to a user' },
      { path: '/obf-access/:obfId/users/:userId', methods: ['PUT'], description: 'Update user\'s access level' },
      { path: '/obf-access/:obfId/users/:userId', methods: ['DELETE'], description: 'Remove user\'s access' }
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT: number = config.port;

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

export default app; // For testing 