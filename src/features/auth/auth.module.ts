import { Application } from 'express';
import authRoutes from './auth.routes';

export function registerAuthModule(app: Application): void {
  app.use('/api/auth', authRoutes);
}
