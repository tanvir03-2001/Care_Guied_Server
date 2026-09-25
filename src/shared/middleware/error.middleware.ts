import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/api-response';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    sendError(res, 'Duplicate key error', 409);
    return;
  }

  console.error(err);
  sendError(res, 'Internal server error', 500);
}
