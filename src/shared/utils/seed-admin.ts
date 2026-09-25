import { env } from '../../config/env';
import { User } from '../../features/user/user.model';

/**
 * Ensures a seed admin exists. Creates only if missing — does not overwrite
 * an existing admin on every server start.
 */
export async function ensureSeedAdmin(): Promise<void> {
  const email = env.adminEmail.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Promoted existing user to admin: ${email}`);
    } else {
      console.log(`Seed admin already exists: ${email}`);
    }
    return;
  }

  await User.create({
    email,
    password: env.adminPassword,
    role: 'admin',
    interests: ['admin', 'management'],
  });
  console.log(`Seed admin created: ${email}`);
}
