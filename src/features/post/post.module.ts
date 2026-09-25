import { Application } from 'express';
import postRoutes from './post.routes';

export function registerPostModule(app: Application): void {
  app.use('/api/posts', postRoutes);
}
