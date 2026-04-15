import mongoose from 'mongoose';
import Badge from '../models/badge';
import dotenv from 'dotenv';

//run this seed script with command: npx ts-node --files src/scripts/seedBadges.ts
dotenv.config();

const CORPORATE_TIERS = [1, 3, 5];
const EXPLORATIONS_TIERS = [1, 3, 5];
const MENTORING_TIERS = [1, 3, 5];
const SOCIAL_TIERS = [1, 3, 5];

const badges = [
  // Corporate
  {
    name: 'Corporate Intern',
    description: `Attended ${CORPORATE_TIERS[0]} corporate event. Welcome to the corporate world!`,
    tier: 1,
    shape: 'diamond',
    image: 'corporate_intern.png',
    isTiered: true,
    category: 'n_corporate_events',
    count: CORPORATE_TIERS[0]
  },
  {
    name: 'Corporate Consultant',
    description: `Attended ${CORPORATE_TIERS[1]} corporate events. You're climbing that corporate ladder!`,
    tier: 2,
    shape: 'hexagon',
    image: 'corporate_consultant.png',
    isTiered: true,
    category: 'n_corporate_events',
    count: CORPORATE_TIERS[1]
  },
  {
    name: 'Corporate Insider',
    description: `Attended ${CORPORATE_TIERS[2]} corporate events. Shhh! You know all the secrets now.`,
    tier: 3,
    shape: 'shield',
    image: 'corporate_insider.png',
    isTiered: true,
    category: 'n_corporate_events',
    count: CORPORATE_TIERS[2]
  },

  // Explorations
  {
    name: 'Explorations Rookie',
    description: `Attended ${EXPLORATIONS_TIERS[0]} explorations event. The adventure begins!`,
    tier: 1,
    shape: 'diamond',
    image: 'explorations_rookie.png',
    isTiered: true,
    category: 'n_explorations_events',
    count: EXPLORATIONS_TIERS[0]
  },
  {
    name: 'Explorations Navigator',
    description: `Attended ${EXPLORATIONS_TIERS[1]} explorations events. Charting new territory!`,
    tier: 2,
    shape: 'hexagon',
    image: 'explorations_navigator.png',
    isTiered: true,
    category: 'n_explorations_events',
    count: EXPLORATIONS_TIERS[1]
  },
  {
    name: 'Explorations Pioneer',
    description: `Attended ${EXPLORATIONS_TIERS[2]} explorations events. You're an iconic trailblazer!`,
    tier: 3,
    shape: 'shield',
    image: 'explorations_pioneer.png',
    isTiered: true,
    category: 'n_explorations_events',
    count: EXPLORATIONS_TIERS[2]
  },

  // Mentoring
  {
    name: 'Mentoring Sprout',
    description: `Attended ${MENTORING_TIERS[0]} mentoring event. Just starting to grow!`,
    tier: 1,
    shape: 'diamond',
    image: 'mentoring_sprout.png',
    isTiered: true,
    category: 'n_mentoring_events',
    count: MENTORING_TIERS[0]
  },
  {
    name: 'Mentoring Guide',
    description: `Attended ${MENTORING_TIERS[1]} mentoring events. Lead the way!`,
    tier: 2,
    shape: 'hexagon',
    image: 'mentoring_guide.png',
    isTiered: true,
    category: 'n_mentoring_events',
    count: MENTORING_TIERS[1]
  },
  {
    name: 'Mentoring Beacon',
    description: `Attended ${MENTORING_TIERS[2]} mentoring events. What a shining light!`,
    tier: 3,
    shape: 'shield',
    image: 'mentoring_beacon.png',
    isTiered: true,
    category: 'n_mentoring_events',
    count: MENTORING_TIERS[2]
  },

  // Social
  {
    name: 'Social Caterpillar',
    description: `Attended ${SOCIAL_TIERS[0]} social event. Keep crawling forward!`,
    tier: 1,
    shape: 'diamond',
    image: 'social_caterpillar.png',
    isTiered: true,
    category: 'n_social_events',
    count: SOCIAL_TIERS[0]
  },
  {
    name: 'Social Chrysalis',
    description: `Attended ${SOCIAL_TIERS[1]} social events. You're transforming!`,
    tier: 2,
    shape: 'hexagon',
    image: 'social_chrysalis.png',
    isTiered: true,
    category: 'n_social_events',
    count: SOCIAL_TIERS[1]
  },
  {
    name: 'Social Butterfly',
    description: `Attended ${SOCIAL_TIERS[2]} social events. Spreading your wings!`,
    tier: 3,
    shape: 'shield',
    image: 'social_butterfly.png',
    isTiered: true,
    category: 'n_social_events',
    count: SOCIAL_TIERS[2]
  },

  // Misc
  {
    name: 'All Rounder',
    description:
      'Attended at least 1 event from every committee. What a holistic individual!',
    shape: 'circle',
    image: 'all_rounder.png',
    isTiered: false
  },
  {
    name: 'Hello World',
    description: 'Attended your first WCS event. Welcome to the community!',
    shape: 'circle',
    image: 'hello_world.png',
    isTiered: false
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Badge.deleteMany({});
  await Badge.insertMany(badges);
  console.log('Badges seeded!');
  await mongoose.disconnect();
}

seed();
