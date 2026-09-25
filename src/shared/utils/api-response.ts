import { Response } from 'express';

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta: ApiMeta | null;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
  meta: ApiMeta | null = null
): void {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  meta: ApiMeta | null = null
): void {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    meta,
  };
  res.status(statusCode).json(body);
}
