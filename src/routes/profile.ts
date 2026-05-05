import express from 'express';
import User from '../models/user';
import Event from '../models/event';
import { verifyToken } from '../middlewares/jwtVerify';

export const profileRoute = express.Router();

profileRoute.get('/', async (req, res, next) => {
  const user = await User.findById(req.user._id).lean();
  if (!user) return res.sendStatus(404);

  const events = await Promise.all(
    user.events.map((id) => Event.findById(id).lean())
  );

  const filteredEvents = events.filter((e) => e !== null);

  return res.status(200).send({ ...user, events: filteredEvents });
});

profileRoute.patch('/', async (req, res, next) => {
  const event = await Event.findOne({ key: req.body.eventKey });

  if (!event) {
    return res.status(400).send({ message: 'Invalid event key' });
  }

  if (
    !event.isSystem &&
    new Date().getTime() - new Date(event.end).getTime() >
      parseInt(process.env.CHECK_IN_GRACE_PERIOD)
  ) {
    return res.status(400).send({ message: 'Event not active' });
  }

  const categoryCounterMap: Record<string, string> = {
    corporate: 'n_corporate_events',
    explorations: 'n_explorations_events',
    mentoring: 'n_mentoring_events',
    social: 'n_social_events'
  };

  const countersToIncrement: Record<string, number> = { n_total_events: 1 };
  const categoryCounter = categoryCounterMap[event.category];
  if (categoryCounter) {
    countersToIncrement[categoryCounter] = 1;
  }

  User.findOneAndUpdate(
    { _id: req.user._id, events: { $ne: event._id } },
    {
      $push: { events: event._id },
      $inc: { points: event.points, ...countersToIncrement }
    },
    function (err: NativeError, result: User) {
      if (err) return next(err);

      if (result) {
        res
          .status(200)
          .send({ message: 'Checked in successfully', event: event });
      } else {
        res.status(400).send({ message: 'Already checked in', event: event });
      }
    }
  );
});

profileRoute.patch('/submitQA', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: 'Not authenticated' });
    }

    const forumAnswerEvent = await Event.findOne({ key: 'forum-answer' });
    if (!forumAnswerEvent) {
      return res
        .status(500)
        .send({ message: 'Forum answer event not configured' });
    }

    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { events: forumAnswerEvent._id },
        $inc: { points: 0.5, n_total_events: 1 }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send({
      message: '0.5 points added successfully',
      points: result.points
    });
  } catch (err) {
    return next(err);
  }
});
