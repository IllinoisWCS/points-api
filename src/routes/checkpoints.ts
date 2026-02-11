import express from 'express';
import User from '../models/user';
import isAuthenticated from '../middlewares/isAuthenticated';

export const checkpointsRoute = express.Router();

checkpointsRoute.post('/redeem', async (req, res) => {
  try {
    const { userId, checkpointValue } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { num_checkpoints: 1 },
        $push: { timestamps: new Date() }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      num_checkpoints: user.num_checkpoints,
      timestamps: user.timestamps
    });
  } catch (error) {
    console.error('Error redeeming checkpoint:', error);
    res.status(500).json({ error: 'Failed to redeem checkpoint' });
  }
});

checkpointsRoute.get('/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      'num_checkpoints timestamps'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      num_checkpoints: user.num_checkpoints,
      timestamps: user.timestamps
    });
  } catch (error) {
    console.error('Error fetching checkpoints:', error);
    res.status(500).json({ error: 'Failed to fetch checkpoints' });
  }
});
