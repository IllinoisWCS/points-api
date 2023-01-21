import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import { routes } from './routes';

const app = express();
const port = parseInt(process.env.PORT);

mongoose.connect(process.env.MONGODB_URI);

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ client: mongoose.connection.getClient() })
  })
);
app.use(passport.session());

app.use('/', routes);

app.listen(port, '0.0.0.0', () =>
  console.log(`Server is listening on port ${port}`)
);
