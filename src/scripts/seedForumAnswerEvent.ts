import mongoose from 'mongoose';
import Event from '../models/event';
import dotenv from 'dotenv';

// run with: npx ts-node --files src/scripts/seedForumAnswerEvent.ts
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Event.deleteOne({ key: 'forum-answer' });

  await Event.create({
    key: 'forum-answer',
    name: 'Anonymous Q&A Forum Answer',
    category: 'other',
    points: 0.5,
    private: true,
    isSystem: true
  });

  console.log('Forum answer event seeded!');
  await mongoose.disconnect();
}

seed();
