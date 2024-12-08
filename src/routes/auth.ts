import express from 'express';
import fs from 'fs';
import passport from 'passport';
import {
  Profile,
  Strategy as SamlStrategy,
  VerifiedCallback
} from 'passport-saml';
import User from '../models/user';

const DISPLAY_NAME_ATTRIBUTE = 'urn:oid:2.16.840.1.113730.3.1.241';
const UID_ATTRIBUTE = 'urn:oid:0.9.2342.19200300.100.1.1';

export const authRoute = express.Router();

const idpCertificate = fs.readFileSync('shibboleth/itrust.pem', 'utf8');
const samlPrivateKey = fs.readFileSync('shibboleth/sp-key.pem', 'utf8');

declare module 'express-session' {
  interface SessionData {
    authContext?: {
      fromQR: boolean;
      eventKey?: string;
      returnTo?: string;
    };
  }
}

passport.use(
  new SamlStrategy(
    {
      callbackUrl: process.env.CALLBACK_URL,
      entryPoint:
        'https://shibboleth.illinois.edu/idp/profile/SAML2/Redirect/SSO',
      issuer: 'https://points-api.illinoiswcs.org/shibboleth',
      cert: idpCertificate,
      privateKey: samlPrivateKey,
      decryptionPvk: samlPrivateKey,
      identifierFormat: null
    },
    function (profile: Profile | null | undefined, done: VerifiedCallback) {
      if (profile != null) {
        const displayName = profile.attributes[DISPLAY_NAME_ATTRIBUTE];
        const netId = profile.attributes[UID_ATTRIBUTE];

        User.findOneAndUpdate(
          { netId: netId },
          { $set: { name: displayName } },
          { upsert: true, new: true },
          function (err, result) {
            if (err) return done(err);
            return done(null, {
              _id: result._id,
              netId: result.netId,
              role: result.role
            });
          }
        );
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, { _id: user._id, netId: user.netId, role: user.role });
  });
});

passport.deserializeUser(function (user: Express.User, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

authRoute.get('/login', (req, res, next) => {
  //stores authentication context in session
  const fromQR = req.query.fromQR === 'true';
  const eventKey = req.query.eventKey as string | undefined;
  const returnTo = req.query.returnTo as string | undefined;

  const state = Buffer.from(
    JSON.stringify({
      fromQR,
      eventKey,
      returnTo: returnTo || '/points' //default to /points return unless specified
    })
  ).toString('base64');

  (req as any).query.RelayState = state;

  //standard authentication
  passport.authenticate('saml')(req, res, next);
});

authRoute.post(
  '/callback',
  express.urlencoded({ extended: false }),
  passport.authenticate('saml'),
  function (req, res) {
    let authContext;

    try {
      //get back to relaystate state prior to the shibboleth authentication
      const relayState = (req.body as any).RelayState;
      if (relayState) {
        const stateString = Buffer.from(relayState, 'base64').toString();
        authContext = JSON.parse(stateString);
        console.log('Recovered state:', authContext);
      } else {
        throw new Error('No RelayState found');
      }
    } catch (e) {
      console.error('Failed to parse RelayState:', e);
      authContext = {
        fromQR: false,
        returnTo: '/points'
      };
    }

    let redirectUrl;

    if (authContext.fromQR === true) {
      if (authContext.eventKey) {
        redirectUrl = `${process.env.BASE_URL}/loading/${authContext.eventKey}?postAuth=true`;
      } else {
        redirectUrl = `${process.env.BASE_URL}/points`;
      }
    } else {
      redirectUrl = `${process.env.BASE_URL}/points`;
    }

    return res.redirect(redirectUrl);
  }
);

authRoute.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});
