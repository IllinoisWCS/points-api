const router = require("express").Router();
const User = require("../models/user");
const Event = require("../models/event");

router.get("/", async (req, res, next) => {
  User.findById(req.user._id)
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

router.patch("/", async (req, res, next) => {
  const event = await Event.findOne({ key: req.body.eventKey });

  if (!event) {
    return res.status(400).send({ message: "Invalid event key" });
  }

  User.findOneAndUpdate(
    { _id: req.user._id, events: { $ne: event._id } },
    { $push: { events: event._id }, $inc: { points: event.points } },
    function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send({ message: "Checked in successfully" });
      } else {
        res.status(400).send({ message: "Already checked in" });
      }
    }
  );
});

module.exports = router;
