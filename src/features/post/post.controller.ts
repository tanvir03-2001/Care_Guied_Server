import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.d';
import { sendSuccess } from '../../shared/utils/api-response';
import { postService } from './post.service';

export class PostController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const post = await postService.create(req.user!.id, req.body);
      sendSuccess(res, post, 'Post created', 201);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await postService.list({
        page: req.query.page as string | undefined,
      });
      sendSuccess(res, result.data, 'OK', 200, result.meta);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const post = await postService.getById(req.params.id as string);
      sendSuccess(res, post);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const post = await postService.update(
        req.user!,
        req.params.id as string,
        req.body
      );
      sendSuccess(res, post, 'Post updated');
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await postService.remove(req.user!, req.params.id as string);
      sendSuccess(res, result, 'Post deleted');
    } catch (err) {
      next(err);
    }
  }

  async byUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await postService.getPostsByUser(req.params.userId as string);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export const postController = new PostController();
