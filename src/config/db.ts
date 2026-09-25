import mongoose from 'mongoose';
import { ensureSeedAdmin } from '../shared/utils/seed-admin';
import { env } from './env';

let ready: Promise<void> | null = null;

export async function connectDb(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected');
}

export function ensureDatabase(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await connectDb();
      await ensureSeedAdmin();
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }

  return ready;
}
