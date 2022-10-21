const express = require("express");
const { customAlphabet } = require("nanoid");
const Event = require("../models/event");

const router = express.Router();
const nanoid = customAlphabet("123456789abcdefghijkmnopqrstuvwxyz", 6);

router.get("/", async (req, res, next) => {
  let query;
  if (req.query.event_keys) {
    const eventKeys = req.query.event_keys.split(",");
    query = { key: { $in: eventKeys } };
  }
  Event.find(query, function (err, result) {
    if (err) return next(err);
    res.status(200).send(result);
  });
});

router.post("/", async (req, res, next) => {
  const eventKey = nanoid();

  const event = new Event({
    ...req.body,
    key: eventKey,
  });

  const err = event.validateSync();
  if (err) return next(err);

  event.save(function (err) {
    if (err) return next(err);
    res
      .status(200)
      .send({ message: "Event created successfully", result: eventKey });
  });
});

router.put("/:eventId", async (req, res, next) => {
  if (!req.body.netId) {
    return res.status(400).send({ message: "Invalid NetID" });
  }

  Event.findOneAndUpdate(
    { _id: req.params.eventId, key: req.body.key },
    {
      $addToSet: { attendees: req.body.netId.toLowerCase() },
    },
    function (err, result) {
      if (err) return next(err);

      if (result) {
        res.status(200).send({ message: "User checked in successfully" });
      } else {
        res.status(400).send({ message: "Invalid event key" });
      }
    }
  );
});

module.exports = router;
