import { createApp } from './app';
import { ensureDatabase } from './config/db';
import { env } from './config/env';

const app = createApp();

if (!process.env.VERCEL) {
  ensureDatabase()
    .then(() => {
      app.listen(env.port, () => {
        console.log(`Server running on http://localhost:${env.port}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server', err);
      process.exit(1);
    });
}

export default app;
