import express from 'express';

export const badgesRoute = express.Router();

const badges = [
  // Corporate
  {
    id: 'corporate-1',
    titleText: 'Corporate Intern',
    descriptionText: '',
    image: '',
    section: 'corporate',
    tier: 1
  },
  {
    id: 'corporate-2',
    titleText: 'Corporate Consultant',
    descriptionText: '',
    image: '',
    section: 'corporate',
    tier: 2
  },
  {
    id: 'corporate-3',
    titleText: 'Corporate Insider',
    descriptionText: '',
    image: '',
    section: 'corporate',
    tier: 3
  },

  // Explorations
  {
    id: 'explorations-1',
    titleText: 'Explorations Rookie',
    descriptionText: '',
    image: '',
    section: 'explorations',
    tier: 1
  },
  {
    id: 'explorations-2',
    titleText: 'Explorations Navigator',
    descriptionText: '',
    image: '',
    section: 'explorations',
    tier: 2
  },
  {
    id: 'explorations-3',
    titleText: 'Explorations Pioneer',
    descriptionText: '',
    image: '',
    section: 'explorations',
    tier: 3
  },

  // Mentoring
  {
    id: 'mentoring-1',
    titleText: 'Mentoring Sprout',
    descriptionText: '',
    image: '',
    section: 'mentoring',
    tier: 1
  },
  {
    id: 'mentoring-2',
    titleText: 'Mentoring Guide',
    descriptionText: '',
    image: '',
    section: 'mentoring',
    tier: 2
  },
  {
    id: 'mentoring-3',
    titleText: 'Mentoring Beacon',
    descriptionText: '',
    image: '',
    section: 'mentoring',
    tier: 3
  },

  // Social
  {
    id: 'social-1',
    titleText: 'Social Caterpillar',
    descriptionText: '',
    image: '',
    section: 'social',
    tier: 1
  },
  {
    id: 'social-2',
    titleText: 'Social Chrysalis',
    descriptionText: '',
    image: '',
    section: 'social',
    tier: 2
  },
  {
    id: 'social-3',
    titleText: 'Social Butterfly',
    descriptionText: '',
    image: '',
    section: 'social',
    tier: 3
  },

  // Misc
  {
    id: 'all-rounder',
    titleText: 'All Rounder',
    descriptionText: '',
    image: '',
    section: 'misc'
  },
  {
    id: 'hello-world',
    titleText: 'Hello World',
    descriptionText: '',
    image: '',
    section: 'misc'
  }
];

badgesRoute.get('/', async (req, res) => {
  try {
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});
