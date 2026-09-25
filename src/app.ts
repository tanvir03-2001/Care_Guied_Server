import cors from 'cors';
import express from 'express';
import { registerAuthModule } from './features/auth/auth.module';
import { registerNoteModule } from './features/note/note.module';
import { registerPostModule } from './features/post/post.module';
import { registerUserModule } from './features/user/user.module';
import { ensureDatabase } from './config/db';
import { errorMiddleware } from './shared/middleware/error.middleware';
import { sendError, sendSuccess } from './shared/utils/api-response';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    sendSuccess(res, { name: 'Care Guide API' }, 'Server is running');
  });

  app.get('/api/health', (_req, res) => {
    sendSuccess(res, { status: 'ok' });
  });

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    sendError(res, 'Not found', 404);
  });

  app.use(async (_req, _res, next) => {
    try {
      await ensureDatabase();
      next();
    } catch (error) {
      next(error);
    }
  });

  registerAuthModule(app);
  registerUserModule(app);
  registerNoteModule(app);
  registerPostModule(app);

  app.use(errorMiddleware);
  return app;
}

const app = createApp();

export default app;
