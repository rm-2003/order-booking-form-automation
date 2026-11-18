import dotenv from 'dotenv';
import { AppConfig } from '../types';

// Load environment variables
dotenv.config();

const config: AppConfig = {
  // Server Configuration
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'obf_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/obf_db'
  },
  
  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expire: '7d' as const
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:8000']
  },
  
  // File Upload Configuration
  fileUpload: {
    maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '10485760', 10),
    allowedExtensions: process.env.ALLOWED_EXTENSIONS 
      ? process.env.ALLOWED_EXTENSIONS.split(',') 
      : ['xlsx', 'xls', 'csv']
  },
  
  // Rate Limiting
  rateLimit: {
    perMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '6000', 10)
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'app.log'
  }
};

export default config; 