import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import { authRoute } from './auth';
import { eventsRoute } from './events';
import { profileRoute } from './profile';
import { usersRoute } from './users';
import { checkpointsRoute } from './checkpoints';
import { vintageRoute } from './vintage';

export const routes = express.Router();

routes.use('/auth', authRoute);
routes.use('/events', eventsRoute);
routes.use('/profile', isAuthenticated, profileRoute);
routes.use('/users', isAuthenticated, usersRoute);
routes.use('/checkpoints', checkpointsRoute);
routes.use('/vintage', vintageRoute);

routes.use((_req, res) => {
  res.sendStatus(404);
});
