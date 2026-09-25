import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../shared/utils/api-response';
import { authService } from './auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 'Registered successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Logged in successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
