import express from 'express';
import User from '../models/user';
import isAuthenticated from '../middlewares/isAuthenticated';
import isOfficer from '../middlewares/isOfficer';

export const vintageRoute = express.Router();

vintageRoute.patch(
  '/redeem',
  isAuthenticated,
  isOfficer,
  async (req, res, next) => {
    console.log('req.user:', req.user);
    const { targetNetId } = req.body;

    if (!targetNetId) {
      return res.status(400).send({ message: 'Missing targetNetId' });
    }

    try {
      const user = await User.findOneAndUpdate(
        { netId: targetNetId },
        { $inc: { n_checkpoints: 1 } },
        { new: true }
      );

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      return res
        .status(200)
        .send({ message: 'Checkpoint redeemed successfully', user });
    } catch (err) {
      return next(err);
    }
  }
);
