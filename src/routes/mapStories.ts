import express from 'express';
import MapStory from '../models/mapStory';
export const mapStoriesRoute = express.Router();

// TODO: only return approved stories, and hide name, linkedinUrl and
// headshotUrl when displayPublicly is false.
mapStoriesRoute.get('/stories', async (req, res) => {
  try {
    const stories = await MapStory.find({});
    res.json(stories);
  } catch (error) {
    console.error('Error fetching map stories:', error);
    res.status(500).json({ error: 'Failed to fetch map stories' });
  }
});
