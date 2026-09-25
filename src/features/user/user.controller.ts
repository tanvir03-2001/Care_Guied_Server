import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.d';
import { sendSuccess } from '../../shared/utils/api-response';
import { userService } from './user.service';

export class UserController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.list({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
      });
      sendSuccess(res, result.data, 'OK', 200, result.meta);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.params.id as string);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.create(req.body);
      sendSuccess(res, user, 'User created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(req.params.id as string, req.body);
      sendSuccess(res, user, 'User updated');
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.remove(req.params.id as string);
      sendSuccess(res, result, 'User deleted');
    } catch (err) {
      next(err);
    }
  }

  async byInterests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.groupByInterests();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
