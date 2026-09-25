import { Application } from 'express';
import userRoutes from './user.routes';

export function registerUserModule(app: Application): void {
  app.use('/api/users', userRoutes);
}
