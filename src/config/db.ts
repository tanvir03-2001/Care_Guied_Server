import mongoose from 'mongoose';
import { env } from './env';

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected');
}
