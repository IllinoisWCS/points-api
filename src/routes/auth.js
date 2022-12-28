const router = require("express").Router();
const passport = require("passport");
const CustomStrategy = require("passport-custom").Strategy;
const User = require("../models/user");

passport.use(
  new CustomStrategy(function (req, done) {
    let netId, displayName;

    if (process.env.NODE_ENV === "development") {
      netId = "dev";
      displayName = "Dev User";
    } else {
      netId = req.header("uid");
      displayName = req.header("displayName");
    }

    User.findOneAndUpdate(
      { netId: netId },
      { $set: { name: displayName } },
      { upsert: true, new: true },
      function (err, result) {
        if (err) return done(err);

        return done(null, result);
      }
    );
  })
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

router.get("/login", passport.authenticate("custom"), function (req, res) {
  return res.redirect(process.env.BASE_URL);
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

module.exports = router;
