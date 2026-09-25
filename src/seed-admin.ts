import mongoose from 'mongoose';
import { env } from './config/env';
import { ensureSeedAdmin } from './shared/utils/seed-admin';

async function run() {
  await mongoose.connect(env.mongodbUri);
  await ensureSeedAdmin();
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
