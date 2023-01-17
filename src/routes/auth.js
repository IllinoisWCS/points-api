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
      protocol: process.env.NODE_ENV === "development" ? "http" : "https",
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
      const displayName = profile.attributes[DISPLAY_NAME_ATTRIBUTE];
      const netId = profile.attributes[UID_ATTRIBUTE];

      User.findOneAndUpdate(
        { netId: netId },
        { $set: { name: displayName } },
        { upsert: true, new: true },
        function (err, result) {
          if (err) return done(err);
          return done(null, result);
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, { _id: user._id, netId: user.netId });
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
  function (_req, res) {
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
