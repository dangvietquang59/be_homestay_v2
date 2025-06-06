import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@/utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const data = err.data || null;

  console.error(`[ERROR] ${req.method} ${req.originalUrl}: ${message}`);

  res.status(statusCode).json(
    errorResponse(message, statusCode, data)
  );
};
