import { Response } from 'express';

export function successResponse(
  res: Response,
  status: number,
  message?: string,
  data?: any,
) {
  return res.status(status).json({ success: true, message, data });
}

// Error response
export function errorResponse(res: Response, status: number, error: any) {
  return res.status(status).json({ success: false, error: error || error });
}
