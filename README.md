# WCS Points API

The WCS Points API is used to manage WCS members' points and facilitate sign-in for events, office hours, and more.

## Installation

- Clone or download this repository
- Install `node` and `yarn`
- Copy the `.env.example` file to `.env` and modify the variables as needed

```
yarn
yarn dev
```

It will start up on [127.0.0.1:3000](127.0.0.1:3000). You can then make API calls through an application like [Postman](https://getpostman.com).

## Environment Variables

- `PORT`: The port that Express will listen on (must be 3000 for Shibboleth to work).
- `NODE_ENV`: Setting this to `development` will make Shibboleth work locally and serve stacktraces.
- `SESSION_SECRET`: The secret used by `express-session`. Can be set to anything.
- `MONGODB_URI`: The MongoDB connection URI.
- `BASE_URL`: The URL to the frontend. Redirected to here after authenticating.
- `CHECK_IN_GRACE_PERIOD`: The period that a member can check in after an event has ended. Stored in milliseconds.
- `CALLBACK_URL`: Shibboleth callback URL. Must be `http://127.0.0.1:3000/auth/callback` when developing locally.

## Contact

Feel free to reach out to [contact@illinoiswcs.org](mailto:contact@illinoiswcs.org) with any questions or feedback!
