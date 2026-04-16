import express from 'express';
import Badge from '../models/badges';
export const badgesRoute = express.Router();

badgesRoute.get('/', async (req, res) => {
  try {
    const badges = await Badge.find({});
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});
