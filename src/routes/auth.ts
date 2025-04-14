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
      identifierFormat: null,
      acceptedClockSkewMs: 300000
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

authRoute.get(
  '/login',
  (req, res, next) => {
    const fromQR = req.query.fromQR;
    const eventKey = req.query.eventKey;
    const returnTo = req.query.returnTo;

    if (fromQR) {
      req.query.RelayState = JSON.stringify({
        fromQR,
        eventKey,
        returnTo
      });
    }
    next();
  },
  passport.authenticate('saml')
);

authRoute.post(
  '/callback',
  express.urlencoded({ extended: false }),
  passport.authenticate('saml'),
  function (req, res) {
    const relayState = req.body.RelayState
      ? JSON.parse(req.body.RelayState)
      : null;
    if (relayState && relayState.fromQR === 'true' && relayState.returnTo) {
      //log in flow from qr code scan
      return res.redirect(`${process.env.BASE_URL}${relayState.returnTo}`);
    } else {
      //regular login button flow
      return res.redirect(process.env.BASE_URL);
    }
  }
);

authRoute.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});
