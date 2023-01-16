const bodyParser = require("body-parser");
const fs = require("fs");
const router = require("express").Router();
const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;
const User = require("../models/user");

const DISPLAY_NAME_ATTRIBUTE = "urn:oid:2.16.840.1.113730.3.1.241";
const UID_ATTRIBUTE = "urn:oid:0.9.2342.19200300.100.1.1";

const idpCertificate = fs.readFileSync("shibboleth/itrust.pem", "utf8");
const samlPrivateKey = fs.readFileSync("shibboleth/sp-key.pem", "utf8");

passport.use(
  new SamlStrategy(
    {
      path: "/auth/callback",
      entryPoint:
        "https://shibboleth.illinois.edu/idp/profile/SAML2/Redirect/SSO",
      issuer: "https://points-api.illinoiswcs.org/shibboleth",
      idpIssuer: "urn:mace:incommon:uiuc.edu",
      cert: idpCertificate,
      privateKey: samlPrivateKey,
      decryptionPvk: samlPrivateKey,
      identifierFormat: null,
    },
    function (profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, { _id: user._id, netId: user.netId, isOfficer: user.isOfficer });
  });
});

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

router.get("/login", passport.authenticate("saml"));

router.post(
  "/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml"),
  function (req, res, next) {
    const displayName = req.user.attributes[DISPLAY_NAME_ATTRIBUTE];
    const netId = req.user.attributes[UID_ATTRIBUTE];

    User.findOneAndUpdate(
      { netId: netId },
      { $set: { name: displayName } },
      { upsert: true, new: true },
      function (err) {
        if (err) return next(err);
      }
    );

    return res.redirect(process.env.BASE_URL);
  }
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

module.exports = router;
