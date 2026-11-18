import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Error response class
export class ErrorResponse extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface SequelizeError extends Error {
  name: string;
  errors?: Array<{ message: string }>;
  value?: string;
  code?: number;
}

// Error handler middleware
export const errorHandler = (
  err: SequelizeError, 
  req: Request, 
  res: Response, 
  _next: NextFunction
): void => {
  let error = { ...err } as SequelizeError;
  error.message = err.message;

  // Log error for debugging
  logger.error(`${(err as ErrorResponse).statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' && err.errors) {
    const message = err.errors.map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400) as SequelizeError;
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError' && err.errors) {
    const message = err.errors.map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400) as SequelizeError;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404) as SequelizeError;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400) as SequelizeError;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const message = err.errors.map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400) as SequelizeError;
  }

  res.status((error as ErrorResponse).statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
}; 