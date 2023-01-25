import express from 'express';
import { customAlphabet } from 'nanoid';
import isOfficer from '../middlewares/isOfficer';
import User from '../models/user';
import Event from '../models/event';

export const eventsRoute = express.Router();
const nanoid = customAlphabet('123456789abcdefghijkmnopqrstuvwxyz', 6);

eventsRoute.get('/', async (req, res, next) => {
  let query = {};
  const projection = ['-__v'];

  if (!req.user || req.user.role !== 'officer') {
    query = { private: false };
    projection.push('-key');
  }

  Event.find(query, projection)
    .sort({ start: -1 })
    .exec(function (err, result) {
      if (err) return next(err);
      res.status(200).send(result);
    });
});

eventsRoute.post('/', isOfficer, async (req, res, next) => {
  const eventKey = nanoid();

  const event = new Event({
    ...req.body,
    key: eventKey
  });

  const err = event.validateSync();
  if (err) return next(err);

  event.save(function (err) {
    if (err) return next(err);
    res.status(200).send({
      message: 'Event created successfully',
      key: eventKey
    });
  });
});

eventsRoute.delete('/:id', isOfficer, async (req, res, next) => {
  Event.findOneAndDelete(
    { _id: req.params.id },
    async function (err: NativeError, result: Event) {
      if (err) return next(err);

      if (result) {
        await User.updateMany(
          { events: result._id },
          {
            $pull: {
              events: result._id
            },
            $inc: { points: -result.points }
          }
        );

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

eventsRoute.patch('/:id', isOfficer, async (req, res, next) => {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    async function (err: NativeError, result: Event) {
      if (err) return next(err);

      if (result) {
        if (req.body.points) {
          await User.updateMany(
            { events: result._id },
            {
              $inc: { points: req.body.points - result.points }
            }
          );
        }

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    }
  );
});
