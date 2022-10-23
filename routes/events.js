const express = require("express");
const { customAlphabet } = require("nanoid");
const Event = require("../models/event");
const isOfficer = require("../middlewares/isOfficer");

const router = express.Router();
const nanoid = customAlphabet("123456789abcdefghijkmnopqrstuvwxyz", 6);

router.get("/", async (req, res, next) => {
  Event.find({ private: false }, function (err, result) {
    if (err) return next(err);
    res.status(200).send(result);
  });
});

router.post("/", isOfficer, async (req, res, next) => {
  const eventKey = nanoid();

  const event = new Event({
    ...req.body,
    key: eventKey,
  });

  const err = event.validateSync();
  if (err) return next(err);

  event.save(function (err) {
    if (err) return next(err);
    res.status(200).send({
      message: "Event created successfully",
      result: eventKey,
    });
  });
});

module.exports = router;
