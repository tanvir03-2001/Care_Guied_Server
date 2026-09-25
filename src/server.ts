import { createApp } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';
import { ensureSeedAdmin } from './shared/utils/seed-admin';

async function bootstrap() {
  await connectDb();
  await ensureSeedAdmin();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
