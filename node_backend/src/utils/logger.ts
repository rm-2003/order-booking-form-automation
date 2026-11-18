import { createLogger, format, transports, Logger } from 'winston';
import config from '../config/config';

const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger
const logger: Logger = createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // File transport
    new transports.File({ 
      filename: config.logging.file,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Export logger
export default logger; 