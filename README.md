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

## Local setup

1. **Node and yarn.** Use Node 18 or newer and yarn 1. Always use `yarn`, never `npm install`: this repo also has a stale `package-lock.json`, and npm would update that instead of `yarn.lock`. Don't add packages yourself; ask the infra chair.
2. **Start a local MongoDB.** Never point this at production. With Docker:
   ```
   docker run -d --name wcs-mongo -p 27017:27017 mongo:6
   ```
   If Mongo isn't running, the server still prints "Server is listening", then crashes about 30 seconds later.
3. **Copy the env file.** `cp .env.example .env`. Keep `PORT=3000`. Ask the infra chair for the Notion values.
4. **Generate a dummy Shibboleth key.** `src/routes/auth.ts` reads `shibboleth/sp-key.pem` on startup. The real key is secret and gitignored, so make a throwaway one from the repo root:
   ```
   openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out shibboleth/sp-key.pem
   ```
   The server will boot, but Shibboleth login won't work locally with this key. Never commit it.
5. **Install and run.**
   ```
   yarn
   yarn dev
   ```
   `yarn` also sets up a pre-commit hook that runs ESLint and Prettier on your staged files. Fix any errors it reports before committing.
6. **Check it works.** `curl http://127.0.0.1:3000/alumni-map/stories` should return `[]`.

### Alumni map

- Notion test data lives in the **TEST Alumni Map Data** database.
- `yarn sync:map` runs `src/scripts/syncMapStories.ts`.
- Branch off `alumni-map` and open your PR into `alumni-map`, not `master`.
- Don't commit anything in `dist/`. Run `yarn dev`, not `yarn build`. If `dist/` shows up in `git status`, run `git checkout -- dist`.
- To run the website alongside this API, start it on port 3001: `npx next dev -p 3001`.

## Environment Variables

- `PORT`: The port that Express will listen on (must be 3000 for Shibboleth to work).
- `NODE_ENV`: Not currently read by the code.
- `SESSION_SECRET`: The secret used by `express-session`. Can be set to anything.
- `MONGODB_URI`: The MongoDB connection URI.
- `BASE_URL`: The URL to the frontend. Redirected to here after authenticating.
- `CHECK_IN_GRACE_PERIOD`: The period that a member can check in after an event has ended. Stored in milliseconds.
- `CALLBACK_URL`: Shibboleth callback URL. Must be `http://127.0.0.1:3000/auth/callback` when developing locally.
- `JWT_SECRET`: The secret used to sign short-lived tokens for the Q&A forum login flow. Can be set to anything locally.
- `NOTION_MAP_TOKEN`: Notion integration token for the alumni map sync. Read-only, with access to the TEST database only.
- `NOTION_MAP_DATABASE_ID`: The ID of the alumni map Notion database.

## Contact

Feel free to reach out to [contact@illinoiswcs.org](mailto:contact@illinoiswcs.org) with any questions or feedback!
