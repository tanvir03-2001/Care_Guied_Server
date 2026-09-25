import mongoose from 'mongoose';
import { env } from './config/env';
import { Note } from './features/note/note.model';
import { Post } from './features/post/post.model';
import { User } from './features/user/user.model';

const USER_COUNT = 10;
const NOTE_COUNT = 50;
const POST_COUNT = 50;
const SEED_PASSWORD = 'password123';
const INTEREST_POOL = ['chess', 'reading', 'music', 'travel', 'coding', 'cooking'];

function seedEmail(index: number) {
  return `seed.user${index}@example.com`;
}

async function ensureSeedUsers() {
  const users = [];

  for (let i = 1; i <= USER_COUNT; i += 1) {
    const email = seedEmail(i);
    let user = await User.findOne({ email });

    if (!user) {
      const start = (i - 1) % INTEREST_POOL.length;
      user = await User.create({
        email,
        password: SEED_PASSWORD,
        role: 'user',
        interests: [INTEREST_POOL[start], INTEREST_POOL[(start + 1) % INTEREST_POOL.length]],
      });
      console.log(`Created user: ${email}`);
    }

    users.push(user);
  }

  return users;
}

async function seedNotes(ownerIds: mongoose.Types.ObjectId[]) {
  const existing = await Note.countDocuments({ title: /^Seed note \d+$/ });
  if (existing >= NOTE_COUNT) {
    console.log(`Seed notes already present (${existing})`);
    return;
  }

  const docs = [];
  for (let i = existing + 1; i <= NOTE_COUNT; i += 1) {
    docs.push({
      title: `Seed note ${i}`,
      content: `Sample note ${i} owned by a seed user.`,
      owner: ownerIds[(i - 1) % ownerIds.length],
    });
  }

  await Note.insertMany(docs);
  console.log(`Inserted ${docs.length} notes`);
}

async function seedPosts(authorIds: mongoose.Types.ObjectId[]) {
  const existing = await Post.countDocuments({ title: /^Seed post \d+$/ });
  if (existing >= POST_COUNT) {
    console.log(`Seed posts already present (${existing})`);
    return;
  }

  const docs = [];
  for (let i = existing + 1; i <= POST_COUNT; i += 1) {
    docs.push({
      title: `Seed post ${i}`,
      body: `Sample public post ${i} written by a seed user.`,
      author: authorIds[(i - 1) % authorIds.length],
    });
  }

  await Post.insertMany(docs);
  console.log(`Inserted ${docs.length} posts`);
}

async function seedData() {
  await mongoose.connect(env.mongodbUri);

  const users = await ensureSeedUsers();
  const ids = users.map((user) => user._id as mongoose.Types.ObjectId);

  await seedNotes(ids);
  await seedPosts(ids);

  console.log(
    `Done. ${USER_COUNT} users (${seedEmail(1)} … ${seedEmail(USER_COUNT)}), password: ${SEED_PASSWORD}`
  );

  await mongoose.disconnect();
}

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
