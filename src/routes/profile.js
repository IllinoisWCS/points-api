const router = require("express").Router();
const User = require("../models/user");
const Event = require("../models/event");

router.get("/", async (req, res, next) => {
  User.findById(req.user._id)
    .populate({ path: "events", options: { sort: { start: -1 } } })
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

  if (new Date() - event.end > process.env.CHECK_IN_GRACE_PERIOD) {
    return res.status(400).send({ message: "Event not active" });
  }

  User.findOneAndUpdate(
    { _id: req.user._id, events: { $ne: event._id } },
    { $push: { events: event._id }, $inc: { points: event.points } },
    function (err, result) {
      if (err) return next(err);

      if (result) {
        res
          .status(200)
          .send({ message: "Checked in successfully", event: event });
      } else {
        res.status(400).send({ message: "Already checked in", event: event });
      }
    }
  );
});

module.exports = router;
