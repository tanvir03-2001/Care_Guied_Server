import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/express.d';
import { sendSuccess } from '../../shared/utils/api-response';
import { noteService } from './note.service';

export class NoteController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const note = await noteService.create(req.user!.id, req.body);
      sendSuccess(res, note, 'Note created', 201);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await noteService.list(req.user!, {
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
      const note = await noteService.getById(req.user!, req.params.id as string);
      sendSuccess(res, note);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const note = await noteService.update(
        req.user!,
        req.params.id as string,
        req.body
      );
      sendSuccess(res, note, 'Note updated');
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await noteService.remove(req.user!, req.params.id as string);
      sendSuccess(res, result, 'Note deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const noteController = new NoteController();
