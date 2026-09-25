import { Application } from 'express';
import noteRoutes from './note.routes';

export function registerNoteModule(app: Application): void {
  app.use('/api/notes', noteRoutes);
}
