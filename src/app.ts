import cors from 'cors';
import express from 'express';
import { registerAuthModule } from './features/auth/auth.module';
import { registerNoteModule } from './features/note/note.module';
import { registerPostModule } from './features/post/post.module';
import { registerUserModule } from './features/user/user.module';
import { errorMiddleware } from './shared/middleware/error.middleware';
import { sendSuccess } from './shared/utils/api-response';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    sendSuccess(res, { status: 'ok' });
  });

  registerAuthModule(app);
  registerUserModule(app);
  registerNoteModule(app);
  registerPostModule(app);

  app.use(errorMiddleware);
  return app;
}
