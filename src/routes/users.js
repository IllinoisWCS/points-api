const router = require("express").Router();
const User = require("../models/user");

router.get("/", async (req, res, next) => {
  User.find({})
    .populate("events")
    .exec(function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send(result);
      } else {
        res.sendStatus(404);
      }
    });
});

router.get("/:netId", async (req, res, next) => {
  User.find({ netId: req.params.netId })
    .populate("events")
    .exec(function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send(result);
      } else {
        res.sendStatus(404);
      }
    });
});

router.delete("/:netId", async (req, res, next) => {
  User.findOneAndDelete({ netId: req.params.netId }).exec(function (
    err,
    result
  ) {
    if (err) return next(err);

    if (result) {
      res.status(200).send(result);
    } else {
      res.sendStatus(404);
    }
  });
});

router.patch("/:netId", async (req, res, next) => {
  User.findOneAndUpdate(
    { netId: req.params.netId },
    { ...req.body },
    function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send(result);
      } else {
        res.sendStatus(404);
      }
    }
  );
});

module.exports = router;
