import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { env } from '../config/env';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed';
    errors = {};
    for (const key in err.errors) {
      errors[key] = [err.errors[key].message];
    }
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Handle JSON parsing errors and payload size limits from serverless gateway
  if (
    err instanceof SyntaxError &&
    ('body' in err || (err as any).type === 'entity.parse.failed' || err.message?.includes('JSON'))
  ) {
    statusCode = 400;
    message = 'File payload was too large or truncated. Please attach a file under 3.2 MB.';
  } else if (err.status === 413 || err.statusCode === 413 || (err as any).type === 'entity.too.large') {
    statusCode = 413;
    message = 'File size exceeds server upload limit. Please attach a file under 3.2 MB.';
  }

  if (statusCode >= 500) {
    logger.error({ err }, `[Unhandled Error] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    errors,
    ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}
