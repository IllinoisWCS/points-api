import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import isOfficer from '../middlewares/isAuthenticated';
import { authRoute } from './auth';
import { eventsRoute } from './events';
import { profileRoute } from './profile';
import { usersRoute } from './users';

export const routes = express.Router();

routes.use('/auth', authRoute);
routes.use('/events', eventsRoute);
routes.use('/profile', isAuthenticated, profileRoute);
routes.use('/users', isOfficer, usersRoute);

routes.use((_req, res) => {
  res.sendStatus(404);
});
