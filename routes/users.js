const router = require("express").Router();
const User = require("../models/user");
const Event = require("../models/event");

router.get("/:netId", async (req, res, next) => {
  User.findOne({ netId: req.params.netId })
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

router.put("/:netId", async (req, res, next) => {
  const event = await Event.findOne({ key: req.body.eventKey });

  if (!event) {
    return res.status(400).send({ message: "Invalid event key" });
  }

  User.findOneAndUpdate(
    { netId: req.params.netId, events: { $ne: event._id } },
    { $push: { events: event._id }, $inc: { points: event.points } },
    function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send({ message: "User checked in successfully" });
      } else {
        res.status(400).send({ message: "User already checked in" });
      }
    }
  );
});

module.exports = router;
