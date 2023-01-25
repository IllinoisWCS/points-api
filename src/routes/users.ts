import express from 'express';
import User from '../models/user';

export const usersRoute = express.Router();

usersRoute.get('/', async (_req, res, next) => {
  User.find({}, null, { sort: { points: -1 } })
    .populate({ path: 'events', options: { sort: { start: -1 } } })
    .exec(function (err, result) {
      if (err) return next(err);
      res.status(200).send(result);
    });
});

usersRoute.get('/:netId', async (req, res, next) => {
  User.find({ netId: req.params.netId })
    .populate({ path: 'events', options: { sort: { start: -1 } } })
    .exec(function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send(result);
      } else {
        res.sendStatus(404);
      }
    });
});

usersRoute.delete('/:netId', async (req, res, next) => {
  User.findOneAndDelete({ netId: req.params.netId }).exec(function (
    err,
    result
  ) {
    if (err) return next(err);

    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

usersRoute.patch('/:netId', async (req, res, next) => {
  User.findOneAndUpdate(
    { netId: req.params.netId },
    { ...req.body },
    function (err: NativeError, result: User) {
      if (err) return next(err);

      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    }
  );
});
