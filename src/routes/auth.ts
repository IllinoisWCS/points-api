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
  res.cookie('returnTo', req.query.returnTo, {
    maxAge: 5 * 60 * 1000
  });

  passport.authenticate('saml')(req, res, next);
});

authRoute.post(
  '/callback',
  express.urlencoded({ extended: false }),
  passport.authenticate('saml'),
  (req, res) => {
    const redirectUrl =
      req.cookies.returnTo === 'undefined'
        ? `${process.env.BASE_URL}`
        : `${process.env.BASE_URL}${req.cookies.returnTo}`;

    res.clearCookie('returnTo');

    return res.redirect(redirectUrl);
  }
);

authRoute.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});
